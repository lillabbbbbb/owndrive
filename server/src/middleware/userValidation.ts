//user and admin validation (checking valid token, checking access)

import {Request, Response, NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export interface CustomRequest extends Request {
    user?: JwtPayload
}

export const validateUserToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("authorization")?.split(" ")[1]

    if(!token) return res.status(401).json({message: "Token not found."})


    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified
        next()

    }  catch (error: any) {
        console.log(error)
        res.status(401).json({message: "Token not found."})
    }
}

export const validateAdminToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log("Authorization header:", req.header("authorization"));
    const token: string | undefined = req.header("authorization")?.split(" ")[1]

    if(!token) return res.status(403).json({message: "Token not found"})
    console.log("token found")


    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified

        if (!req.user.isAdmin){
            return res.status(403).json({message: "Access denied."})
        }
        next()

    }  catch (error: any) {
        console.log(error)
        res.status(403).json({message: "Access denied."})
    }
}