//This file handles all requests that are sent when a user is authenticated

import { Request, Response, Router } from "express"

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

//Route to a file of a user
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

export default userRouter