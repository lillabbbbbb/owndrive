//this router file is for handling all backend communication related to modifying files (and their permissions)

import passport from "../middleware/google-passport-config"
import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User } from "../models/User"
import { IFile, File } from "../models/File"
import { Types } from "mongoose"
import { validateEmail, validatePassword, validateUsername } from "../validators/inputValidation"
import { CustomRequest, validateUserToken } from "../middleware/userValidation"
import { asyncHandler } from "../middleware/asyncHelper"


const fileRouter: Router = Router()

//This way, all the routes will first run validateUserToken 
fileRouter.use(validateUserToken);

fileRouter.get("/", async (req: Request, res: Response) => {
    try {

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        //get the right user
        const user: IUser | null = await User.findOne({ _id: userId }).populate("files")

        //return if user not found
        if (!user) throw new Error("Owner not found");

        //get the files of the user
        const files: IFile[] = user.files


        return res.status(200).json(files)

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})

//POST create new file
//params: id: string, filedata: JSON
fileRouter.post("/",
    async (req: Request, res: Response) => {
        try {

            const customReq = req as CustomRequest;
            if (!req.user) return res.status(401).json({ message: "Unauthorized" })
            const userId = customReq.user?._id

            const {
                filename,
                file_type = "doc",
                content = "",
                inUse = false,
                usedBy,
                status = "active",
                visibleToGuests = false,
                showsInHomeShared = true,
                private: isPrivate = false
            } = req.body;

            if (!filename) {
                return res.status(400).json({ message: "Filename is required" });
            }

            // 1️⃣ Check if a file with this name already exists for this user
            let file = await File.findOne({ filename, created_by: userId });


            if (!file) {
                // 2️⃣ Create new file
                const now = new Date();

                file = await File.create({
                    created_at: now,
                    created_by: userId,
                    last_edited_at: now,
                    file_type,
                    filename,
                    content,
                    inUse,
                    usedBy,
                    status,
                    visibleToGuests,
                    showsInHomeShared,
                    private: isPrivate,
                    canView: [userId],
                    canEdit: [userId],
                });

            }

            // 3️⃣ Push reference to user's files array
            await User.findByIdAndUpdate(userId, { $push: { files: file._id } });
            /*store new reference in the user record
            await User.findByIdAndUpdate(
                user._id,
                {
                    $push: {
                        files: [newFile]
                    }
                },
                { new: true }
            )
            */

            const updatedFile = await file.save();

            return res.status(200).json(updatedFile);
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//DELETE delete file
//params: username: string, token: string, filedata: JSON
fileRouter.delete("/:fileId",
    async (req: Request, res: Response) => {
        try {

            const customReq = req as CustomRequest;
            if (!req.user) return res.status(401).json({ message: "Unauthorized" })
            const userId = customReq.user?._id



            const existingFile: IFile | null = await File.findOne({ _id: req.params.fileId })
            if (!existingFile) return res.status(404).json({ "message": "File not found based on _id" })

            const filename = existingFile.filename


            //delete record
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        files: { _id: existingFile._id }
                    }
                },
                { new: true }
            )


            return res.status(200).json({ "message": `File "${filename}" successfully deleted.` })

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//GET fetch one file (and its data) of a user
//params: username: string, token: string, filename: JSON
//NOTE: check if the user has the right permissions to post to this route
//NOTE: check if the file is set to private by the owner (don't render to others if it is)!!!!
fileRouter.get("/:fileId",
    async (req: CustomRequest, res: Response) => {
        try {

            const customReq = req as CustomRequest;
            if (!req.user) return res.status(401).json({ message: "Unauthorized" })
            const userId = customReq.user?._id


            const existingFile: IFile | null = await File.findOne({ _id: req.params.fileId })
            if (!existingFile) return res.status(404).json({ "message": "File not found based on _id" })
            //find owner of file
            const user = await User
                .findOne({ username: req.params?.username as string }) //ATTENTION: if there's a space in the req params, record may not be found

            //if user not found
            if (!user) return res.status(404).json({ message: `File's owner (user) not found` })

            type TPermission = {
                accessType: string,
                private: boolean
            }

            const permissions: TPermission = {
                accessType: "none",
                private: true
            }

            //CHECK IF TOKEN BELONGS TO ...
            //(1) if the token belongs to the author of the file
            if (req.body.email === req.user?.email) {
                permissions.accessType = "owner"
                //RETURN HERE
                return res.status(200).json(permissions)
            }


            //check if file is set to private
            permissions.private = existingFile?.private

            //(2) check if token is missing (=guest user) AND file not private
            permissions.accessType = "guest"
            //return res.status(200).json(permissions)

            //find out the username of the "accessor"
            const user2name = "some user"

            //(3) check if otheruser AND haspermission (view or edit!)
            if (existingFile?.canView.includes(userId)) permissions.accessType = "viewer"
            else if (existingFile?.canView.includes(userId)) permissions.accessType = "editor"

            return res.status(200).json({ permissions: permissions, file: existingFile })

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//UPDATE one file
//params: username, updates
fileRouter.patch("/:fileId", async (req: Request, res: Response) => {
    try {


        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        const updates: Partial<IFile> = req.body;
        const { fileId } = req.params

        //Check whether fileId can be coverted into a Mongoose ObjectId
        if (!fileId || Array.isArray(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
        if (!Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ message: "Invalid file ID format" });
        }



        // 1️⃣ Find the file and make sure the user owns it
        const file = await File.findOne({ _id: fileId, created_by: userId });
        if (!file) {
            return res.status(404).json({ message: "File not found or access denied" });
        }

        // 2️⃣ Check for filename conflict if updates include a new filename
        if (updates.filename) {
            const conflict: IFile | null = await File.findOne({
                filename: updates.filename,
                created_by: userId,
                _id: { $ne: new Types.ObjectId(fileId) } // exclude the current file itself
            });

            if (conflict) {
                return res.status(400).json({ message: "A file with this name already exists" });
            }
        }

        // 3️⃣ Apply updates (only fields provided in the request)
        Object.entries(updates).forEach(([key, value]) => {
            (file as any)[key] = value;
        });

        // 4️⃣ Update last_edited_at if not provided
        if (!updates.last_edited_at) {
            file.last_edited_at = new Date();
        }

        // 5️⃣ Save changes
        const updatedFile = await file.save();

        return res.status(200).json()
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})

fileRouter.patch("/:fileId/lock", async (req: Request, res: Response) => {
    try {

        const fileId = req.params.id;

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        // 1️⃣ Find the file and make sure the user owns it
        const file = await File.findOne({ _id: fileId, created_by: userId });
        const canEdit = await File.findOne({ _id: fileId, canEdit: userId });
        if (!file || !canEdit) {
            return res.status(404).json({ message: "File not found or access denied" });
        }

        await File.findByIdAndUpdate(userId, { inUse: true, usedBy: userId })

        return res.status(200).json({ "message": `File locked by ${userId}` })
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})

fileRouter.patch("/:fileId/unlock", async (req: Request, res: Response) => {
    try {

        const fileId = req.params.id;

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        // 1️⃣ Find the file and make sure the user owns it
        const file = await File.findOne({ _id: fileId, created_by: userId });
        const canEdit = await File.findOne({ _id: fileId, canEdit: userId });
        if (!file || !canEdit) {
            return res.status(404).json({ message: "File not found or access denied" });
        }

        await File.findByIdAndUpdate(userId, { inUse: false, usedBy: null })

        return res.status(200).json({ "message": `File unlocked` })

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})


//DELETE LATER, ONLY HERE FOR TESTING
fileRouter.get("/files/list", async (req: Request, res: Response) => {
    try {
        const files: IFile[] = await File.find()
        console.log(files)
        return res.status(200).json(files)
    } catch (error: any) {
        console.log(`Error while fecthing users ${error}`)
        return res.status(500).json({ error: "Internal Server Error" })
    }

})


export default fileRouter