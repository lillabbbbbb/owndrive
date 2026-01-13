import {Request, Response, NextFunction} from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"


export const validateEmail =  body("email").trim().isEmail().escape()

export const validatePassword = 
    body("password").trim().isStrongPassword({
        minLength:8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).escape()

export const validateUsername = body("username").trim().isLength({min: 3, max: 25}).escape()