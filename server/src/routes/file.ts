//this router file is for handling all backend communication related to modifying files (and their permissions)

import passport from "../middleware/google-passport-config"
import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User } from "../models/User"
import { validateEmail, validatePassword, validateUsername } from "../validators/inputValidation"


const fileRouter: Router = Router()

//GET fetch all files (and a lot of their data) of a user
//params: username: string, token: string, filter?: string[]

//POST create new file
//params: username: string, token: string, filedata: JSON
//NOTE: check if the user has the right permissions to post to this route

//DELETE delete file
//params: username: string, token: string, filedata: JSON

//GET fetch one file (and its data) of a user
//params: username: string, token: string, filename: JSON
//NOTE: check if the user has the right permissions to post to this route
//NOTE: check if the file is set to private by the owner (don't render to others if it is)!!!!


//maybe leave this feature out now, even though it would be nice if permission update were handled upon pressing a "save changes" button, not immediately
//POST / UPDATE change permisions of a file ????????????
//params: username: string, token: string, filename: JSON, ??????????? 


//UPDATE add a file permission to a user ..../permissions/add
//params: username: string, token: string, filedata: JSON, user2name: string, permissionType: string (e.g. "view", "edit")
//NOTE: check if the user has the right permissions to post to this route


//UPDATE remove file permission from a user ..../permissions/remove
//params: username: string, token: string, filedata: JSON, user2name


//UPDATE change guest view mode /visibility/change
//params: username: string, token: string, filedata: JSON, abledness: boolean (true or false)
//if it is already set like that, print that to the screen (for testing purposes)



export default fileRouter