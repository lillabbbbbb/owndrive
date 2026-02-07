//This file handles all requests that are sent when a user is authenticated

import { Request, Response, Router } from "express"
import { IImage, Image } from "../models/Image"
import { User } from "../models/User"
import upload from "../middleware/multer-config"
import { CustomRequest, validateUserToken } from "../middleware/userValidation"
import fs from "fs"

const userRouter: Router = Router()

userRouter.use(validateUserToken)


//route to anything else: handled in frontend

userRouter.get("/me", async (req: Request, res: Response) => {
    try {

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        const existingUser = await User.findById({ _id: userId })

        return res.json(existingUser)
    }
    catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})


//UPDATE Upload or change profile picture
userRouter.patch("/me", upload.single("image"), async (req: Request, res: Response) => {
    try {
        console.log("🔥 PATCH /me endpoint HIT!")
        console.log("Has file?", !!req.file)
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        // ✅ TEST LOGGING
        console.log("=================== MULTER TEST ===================")
        console.log("File uploaded:", req.file.filename)
        console.log("File path:", req.file.path)
        console.log("File size:", req.file.size)
        console.log("Mimetype:", req.file.mimetype)
        console.log("process.cwd():", process.cwd())
        console.log("__dirname:", __dirname)

        // Check if file exists
        if (fs.existsSync(req.file.path)) {
            console.log("✅ File EXISTS at:", req.file.path)
        } else {
            console.log("❌ File NOT FOUND at:", req.file.path)
        }
        console.log("===================================================")


        const customReq = req as CustomRequest;
        if (!customReq.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user._id

        // Get the user with their current profile_pic reference
        const user = await User.findById(userId).select("profile_pic")
        if (!user) return res.status(404).json({ message: 'User not found' })
// Prepare image data
const imgPath = `/images/${req.file.filename}`
const imageData = {
    filename: req.file.filename,
    description: req.body.description,
    path: imgPath,
    createdAt: new Date()
}

// ✅ Check if user has a profile_pic reference
if (user.profile_pic) {
    // ✅ Verify the image document actually exists
    const existingImage = await Image.findById(user.profile_pic)
    
    if (existingImage) {
        // Image exists, update it
        await Image.findByIdAndUpdate(
            user.profile_pic,
            { $set: imageData },
            { runValidators: true }
        )
        
        return res.status(200).json({
            message: "Profile pic successfully updated",
            imageId: user.profile_pic
        })
    } else {
        // Reference exists but image document is missing - create new
        console.log("⚠️ Orphaned reference, creating new image")
        const newImage = await Image.create(imageData)
        await User.findByIdAndUpdate(userId, { profile_pic: newImage._id })
        
        return res.status(201).json({
            message: "Profile pic created",
            imageId: newImage._id
        })
    }
}

// No profile_pic reference - create new
const newImage = await Image.create(imageData)
await User.findByIdAndUpdate(userId, { profile_pic: newImage._id })

return res.status(201).json({
    message: "Profile pic successfully uploaded",
    imageId: newImage._id
})

    } catch (error: any) {
        console.error(`Error while uploading file:`, error)
        return res.status(500).json({ message: 'Internal server error' })
    }
})

//GET get profile picture of a user
//params: userId
userRouter.get("/:userId/profile_picture", async (req: Request, res: Response) => {
    try {

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id


        //find the right user
        const user = await User
            .findOne({ _id: userId })
            .select("image")

        //if user not found
        if (!user) return res.status(404).json({ message: 'User not found' })

        //if there is no profile pic model in the user record
        if (!user?.profile_pic) return res.status(404).json({ message: 'Profile picture not found' })

        console.log(user.profile_pic)
        return res.status(201).json(user.profile_pic)
    } catch (error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({ message: 'Internal server error' })
    }
})


export default userRouter