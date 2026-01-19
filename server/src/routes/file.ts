//this router file is for handling all backend communication related to modifying files (and their permissions)

import passport from "../middleware/google-passport-config"
import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User } from "../models/User"
import { IFile, File } from "../models/File"
import { validateEmail, validatePassword, validateUsername } from "../validators/inputValidation"
import { CustomRequest, validateOwnerToken } from "../middleware/userValidation"


const fileRouter: Router = Router()

//NOTE: SORTING CAN BE HANDLED IN THE FRONTEND
//GET fetch all files (and a lot of their data) of a user
//params: username: string, token: string, filter?: JSON[] (e.g. [{filter: "lillabbbbbb", filter_type: "user"}])
//since the filter is passed into here, pls also add it to the corresponding Session db object schema
fileRouter.get("/:user/home/files",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME


            //get the right user
            const user: IUser | null = await User.findOne({ email: req.params.user as string })

            //return if user not found
            if (!user) throw new Error("Parent not found");

            //get the files of the user
            const files: IFile[] = user.files

            //NOTE: HANDLE THE FILTERS (AND SORTING) IN THE FRONTEND
            //iterate the array and choose files which (1) name or (2) content or (3) author matches the filter
            //check the diff cases depending on what kind of filter it is


            return res.status(200).json(files)

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//POST create new file
//params: username: string, token: string, filedata: JSON
//NOTE: check if the user has the right permissions to post to this route
fileRouter.post("/:user/home/create",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            //check if there is already a file with this name in the db of the owner (schema within schema), return if so'
            const existingFile: IFile | null = await File.findOne({ file_name: req.body.fileName })
            if (existingFile) return res.status(401).json({ "message": "A file with this name already exists" })

            //get the right user
            const user = await User
                .findOne({ email: req.body.email })
                .select("files")

            //if user not found
            if (!user) return res.status(404).json({ message: 'User not found' })

            const content = req.body.content ? req.body.content : ""
            const createdAt = new Date()
            
            //pass the received fileData JSON to create the new db record
            const newFile = await File.create({
                created_at: createdAt,
                created_by: req.body.email,
                last_edited_at: createdAt,
                file_type: ".docx",
                file_name: req.body.fileName,
                content: content,
                canView: [],
                canEdit: [],
                visibleToGuests: false,
                showsInHomeShared: true,
                private: false,
                inUse: false,
            });

            //store new reference in the user record
            await User.findByIdAndUpdate(
                user._id,
                {
                    $push: {
                        files: [newFile]
                    }
                },
                { new: true }
            )


            return res.status(200).json({ "message": "New file successfully saved" })
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//DELETE delete file
//params: username: string, token: string, filedata: JSON
fileRouter.delete("/:user/files/delete",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            //check if there is already a file with this name in the db of the owner (schema within schema), return if not
            const existingFile: IFile | null = await File.findOne({ filename: req.body.fileName})
            if (!existingFile) return res.status(404).json({ "message": "File not found with this name" })

            //get the right user
            const user = await User
                .findOne({ username: req.body.username })
                .select("files")

            //if user not found
            if (!user) return res.status(404).json({ message: 'User not found' })


            //NOTE: I SHOULD IMPLEMENT THE ARCHIVED HERE
            //const file = await Archive.create(req.body.fileData);


            //delete record
            await User.findByIdAndUpdate(
                user._id,
                {
                    $pull: {
                        files: {filename: existingFile.file_name}
                    }
                },
                { new: true }
            )


            return res.status(200).json({ "message": `File "${req.body.filename}" successfully deleted.` })

        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//GET fetch one file (and its data) of a user
//params: username: string, token: string, filename: JSON
//NOTE: check if the user has the right permissions to post to this route
//NOTE: check if the file is set to private by the owner (don't render to others if it is)!!!!
fileRouter.get("/:user/:file",
    validateOwnerToken,
    async (req: CustomRequest, res: Response) => {
        try {
            //check if there is already a file with this name in the db of the owner (schema within schema), return if not
            const existingFile: IFile | null = await File.findOne({ file_name: req.body.fileName })
            if (!existingFile) return res.status(404).json({ "message": "File not found with this name" })

            //find owner of file
            const user = await User
                .findOne({ username: req.params?.username as string}) //ATTENTION: if there's a space in the req params, record may not be found

            //if user not found
            if (!user) return res.status(404).json({ message: `${req.body.username} workspace not found` })

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
            if(req.body.email === req.user?.email){
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
            if (existingFile?.canView.includes(user2name)) permissions.accessType = "viewer"
            else if (existingFile?.canView.includes(user2name)) permissions.accessType = "editor"
        
            //return res.status(200).json(permissions)
            
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//UPDATE one file's content
//params: username, file
//NOTE: check if the user has the right permissions to post to this route
fileRouter.patch("/:user/:file",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            ////?????????????


            return res.status(200).json()
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })



//maybe leave this feature out now, even though it would be nice if permission update were handled upon pressing a "save changes" button, not immediately
//POST / UPDATE change permisions of a file ????????????
//params: username: string, token: string, filename: JSON, ??????????? 



//UPDATE add a file permission to a user ..../permissions/add
//params: username: string, token: string, filedata: JSON, user2name: string, permissionType: string (e.g. "view", "edit")
//NOTE: check if the user has the right permissions to post to this route
fileRouter.patch("/:user/:file/permissions/add",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            //check if file exists

            //check if user2name exists

            //update db record of file (ADD TO THE permissions array) How to add to existing data without overwriting?


            return res.status(200).json()
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })

//UPDATE remove file permission from a user ..../permissions/remove
//params: username: string, token: string, filedata: JSON, user2name
fileRouter.patch("/:user/:file/permissions/remove",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            //check if file exists

            //check if user2name exists

            //update db record of file (REMOVE ONE FROM permissions array) How to alter existing data without overwriting?


            return res.status(200).json()
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })


//UPDATE change guest view mode /visibility
//params: username: string, token: string, filedata: JSON, abledness: boolean (true or false)
//if it is already set like that, print that to the screen (for testing purposes)
fileRouter.patch("/:user/:file/visibility",
    async (req: Request, res: Response) => {
        try {

            //check if username (:user) matches the user signed inside the jwt token
            //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME

            //check if file exists

            //check if user2name exists

            //update db record of file (visibility)


            return res.status(200).json()
        } catch (error: any) {
            console.log(error)
            return res.status(500).json({ "message": "Internal Server Error" })
        }
    })

    //DELETE LATER, ONLY HERE FOR TESTING
    fileRouter.get("/list/files", async (req: Request, res: Response) => {
        try {
            const files: IFile[] = await File.find()
            console.log(files)
            return res.status(200).json(files)
        } catch (error: any) {
            console.log(`Error while fecthing users ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }
    
    })


export default fileRouter