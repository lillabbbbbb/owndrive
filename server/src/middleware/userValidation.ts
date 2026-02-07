import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { User, IUser } from "../models/User";
import { Document } from "mongoose";

dotenv.config();

export interface CustomRequest extends Request {
    user?: JwtPayload
}

export const validateUserToken = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {

    //console.log('Headers received:', req.headers);
    //console.log('Auth header:', req.headers.authorization);

    const token: string | undefined = req.header("authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token not found." });

    try {
        const verified = jwt.verify(token, process.env.SECRET as string) as { _id: string }

        if (!verified) return res.status(401).json({ message: "User not found" });

        console.log(verified)
        req.user = verified

        next();

    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
