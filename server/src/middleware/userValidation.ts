//user and admin validation (checking valid token, checking access)

import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import { User, IUser } from "../models/User"

dotenv.config()

export interface CustomRequest extends Request {
    user?: IUser
}

interface TokenPayload extends JwtPayload {
  id: string;
}

export const validateUserToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header("authorization")?.split(" ")[1]

    if (!token) return res.status(401).json({ message: "Token not found." })


    try {
        const verified: JwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload


        const user: IUser = await User.findById(verified.id).select("-password"); //Exclude password hash

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Invalid or expired token" });
    }

}