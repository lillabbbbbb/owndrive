//This file handles all requests that are sent when a user is authenticated

import { Request, Response, Router } from "express"
import { IImage, Image } from "../models/Image"
import { User } from "../models/User"
import upload from "../middleware/multer-config"

const userRouter: Router = Router()


//route to anything else: handled in frontend


//UPDATE Upload or change profile picture
userRouter.patch("/:userId/profile_pic", upload.single("image"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded"})
        }

        //set up the image 
        const imgPath: string = req.file.path.replace("public", "")
        const image: IImage = new Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath,
            createdAt: new Date()
        })

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("image")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //if there is no profile pic model in the user record
        if(!user?.profile_pic) return res.status(404).json({message: 'Previous image not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Image.findByIdAndUpdate(
            user.profile_pic,
            {$set: {
                image
            }}, 
            {runValidators: true}

        )
        console.log("File successfully changed and saved in the database")
        return res.status(201).json({message: "File uploaded and saved in the database"})
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

   
})

//GET get profile picture of a user
//params: userId
userRouter.get("/:userId/profile_picture", async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token

        //fetch image record from user db:
        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("image")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //if there is no profile pic model in the user record
        if(!user?.profile_pic) return res.status(404).json({message: 'Profile picture not found'})

        console.log(user.profile_pic)
        return res.status(201).json({message: user.profile_pic})
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }
})


export default userRouter