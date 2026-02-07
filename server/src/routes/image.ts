
import { Request, Response, Router } from "express"
import { IImage, Image } from "../models/Image";
import { IUser, User } from "../models/User";
import { CustomRequest, validateUserToken } from "../middleware/userValidation";

const imageRouter: Router = Router()
imageRouter.use(validateUserToken)

imageRouter.get("/", async (req: CustomRequest, res: Response) => {
    try {

        const customReq = req as CustomRequest;
        if (!req.user) return res.status(401).json({ message: "Unauthorized" })
        const userId = customReq.user?._id

        const user = await User.findOne({ _id: userId })
        if (!user) return res.status(404).json({ message: `User not found` })

        console.log("User found:", user?._id)
        console.log("Profile pic ID:", user?.profile_pic)  // ✅ What is this?

        const imageId = user?.profile_pic
        if (!imageId) return res.status(404).json({ "message": "This user has not set a profile picture yet." })

        const existingImage: IImage | null = await Image.findOne({ _id: imageId })

        console.log("Image found:", existingImage)  // ✅ What does this return?
        if (!existingImage) return res.status(404).json({ "message": "Image not found based on _id" })

        return res.status(200).json(existingImage)

    } catch (error: any) {
        console.log(error)
        return res.status(500).json({ "message": "Internal Server Error" })
    }
})

export default imageRouter