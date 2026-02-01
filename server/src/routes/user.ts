//This file handles all requests that are sent when a user is authenticated

import { Request, Response, Router } from "express"
import { IImage, Image } from "../models/Image"
import { User } from "../models/User"
import upload from "../middleware/multer-config"
import { validateUserToken } from "../middleware/userValidation"

const userRouter: Router = Router()

userRouter.use(validateUserToken)


//route to anything else: handled in frontend


//UPDATE Upload or change profile picture
userRouter.patch("/:userId/profile_pic", upload.single("image"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded"})
        }
        
        const userId = req.user?._id; // from auth middleware
        //get the right user
        const user = await User
            .findOne({_id: userId})
            .select("image")
        
        //if user not found
        if (!userId) return res.status(404).json({message: 'User not found'})


        //set up the image 
        const imgPath: string = req.file.path.replace("public", "")
        const image: IImage = new Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath,
            createdAt: new Date()
        })

        //if there is no profile pic model in the user record
        if(!user?.profile_pic) {

            //Create new image record in db
            const img = await Image.create({
                filename: req.file.filename,
                description: req.body.description,
                path: imgPath,
                createdAt: new Date()
            })

            //Update user record, linking the new image's id to it
            User.findByIdAndUpdate({userId, profile_pic: img._id})

        }


        //Note: If there was an image previously, then no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Image.findByIdAndUpdate(
            user?.profile_pic,
            {$set: {
                image
            }}, 
            {runValidators: true}

        )
        console.log("Profile pic successfully changed and saved in the database")

        return res.status(201).json({message: "Profile pic successfully uploaded and saved in the database"})
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

   
})

//GET get profile picture of a user
//params: userId
userRouter.get("/:userId/profile_picture", async (req: Request, res: Response) => {
    try {

        const userId = req.user?._id; // from auth middleware
        //find the right user
        const user = await User
            .findOne({_id: userId})
            .select("image")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //if there is no profile pic model in the user record
        if(!user?.profile_pic) return res.status(404).json({message: 'Profile picture not found'})

        console.log(user.profile_pic)
        return res.status(201).json(user.profile_pic)
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }
})


export default userRouter