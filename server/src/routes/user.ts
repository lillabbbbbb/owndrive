//This file handles all requests that are sent when a user is authenticated

import { Request, Response, Router } from "express"
import { IImage, Image } from "../models/Image"
import upload from "../middleware/multer-config"

const userRouter: Router = Router()


//route to anything else: handled in frontend


//Home
userRouter.get("/:user/home", 
    async (req: Request, res: Response) => {
    try {
        
        return res.status(200).json()
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//Route to a file of a user
//Return: JSON of the right File DB record
userRouter.get("/:user/:file", 
    async (req: Request, res: Response) => {
    try {

        //



        return res.status(200).json()
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//????????????
userRouter.post("/:user/:file/:permissions", 
    async (req: Request, res: Response) => {
    try {

        //check if token exists


            //check if user is the owner


            //if not, check what access this user has to the file (view or edit)


        //check if user is logged in


        //check 
        
        return res.status(200).json()
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//upload profile pic
userRouter.post("/profile_pic/upload", upload.single("image"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: "No file uploaded"})
        }

        const imgPath: string = req.file.path.replace("public", "")

        const image: IImage = new Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath
        })
        await image.save()
        console.log("File uploaded and saved in the database")
        return res.status(201).json({message: "File uploaded and saved in the database"})
    } catch(error: any) {
        console.error(`Error while uploading file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }
 
    
})

//change profile picture
userRouter.patch("/profile_pic/change", async (req: Request, res: Response) => {
    try {
        const image: IImage | null = await Image.findById(req.params.id)
        
        if(!image) {
            return res.status(404).json({message: 'Image not found'})
        }

        image.description = req.body.description
        await image.save()

        res.status(200).json({message: "Image updated"})
        console.log('Image updated')

    } catch (error: any) {
        console.error(`Error while updating a file: ${error}`)
        return res.status(500).json({message: 'Internal server error'})
    }

   
})

export default userRouter