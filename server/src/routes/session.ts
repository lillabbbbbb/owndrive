//this router is for handling all backend communication regarding session data such as sorting keyword, filter, current page of pagination

import passport from "../middleware/google-passport-config"
import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User } from "../models/User"
import { Session } from "../models/Session"
import { validateEmail, validatePassword, validateUsername } from "../validators/inputValidation"


const sessionRouter: Router = Router()

//UPDATE add search filter
//params: username , filterType, filterValue
sessionRouter.patch(":user/session/filter/add",
    async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token
        

        //set up the filter
        const filterType = req.body.type
        const filterValue = req.body.value

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("session")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Session.findByIdAndUpdate(
            user._id,
            {$addToSet: {
                filters: {filter_type: filterType, filter_value: filterValue}
            } }

        )
        
        return res.status(200).json({"message": `Filter ${filterType} : ${filterValue} added succesfully.`})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//UPDATE remove filter
//params: username JSON with type and value of filter
sessionRouter.patch(":user/session/filter/remove",
    async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token
        

        //set up the filter
        const filterType = req.body.type
        const filterValue = req.body.value

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("session")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Session.findByIdAndUpdate(
            user._id,
            {$pull: {
                filters: {filter_type: filterType, filter_value: filterValue}
            } },
            {new: true}
        )
        
        return res.status(200).json({"message": `Filter ${filterType} : ${filterValue} removed succesfully.`})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//UPDATE remove all filters
//params: username
sessionRouter.patch(":user/session/filter/remove_all",
    async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token
        

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("session")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Session.findByIdAndUpdate(
            user._id,
            {$set: {
                filters: []
            } },
            {new: true}
        )
        
        return res.status(200).json({"message": `All filters removed succesfully.`})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//UPDATE change sorting
//params: sorting: string (e.g. "newest first")
sessionRouter.patch(":user/session/filter/remove_all",
    async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token
        

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("session")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Session.findByIdAndUpdate(
            user._id,
            {$set: {
                sorting: req.body.sorting
            } },
            {new: true}
        )
        
        return res.status(200).json({"message": `${req.body.sorting} sorting applied successfully.`})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})

//UPDATE change page
//params: page_num: number

sessionRouter.patch(":user/session/filter/remove_all",
    async (req: Request, res: Response) => {
    try {

        //check if username (:user) matches the user signed inside the jwt token
        

        //get the right user
        const user = await User
            .findOne({username: req.body.username})
            .select("session")

        //if user not found
        if (!user) return res.status(404).json({message: 'User not found'})

        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Session.findByIdAndUpdate(
            user._id,
            {$set: {
                pagination_current: req.body.page_num
            } },
            {new: true}
        )
        
        return res.status(200).json({"message": `Current page value (${req.body.page_num}) saved successfully.`})
    } catch (error: any) {
        console.log(error)
        return res.status(500).json({"message": "Internal Server Error"})
    }
})