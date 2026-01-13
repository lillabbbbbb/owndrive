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

//POST create new file

//DELETE delete file

//GET fetch one file (and its data) of a user

//POST / UPDATE change permisions of a file





export default fileRouter