//routes on index page, login and registration

import passport from "../middleware/google-passport-config"
import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUser, User } from "../models/User"
import { validateEmail, validatePassword, validateUsername } from "../validators/inputValidation"
import { validateUserToken } from "../middleware/userValidation"
//import { validateToken} from "../middleware/validateToken"


const router: Router = Router()

router.use(validateUserToken)


//route to anything else: handled in frontend


//Handle login requests
router.post("/login", 
    //sanithize user input (check for injection)
    [validateEmail,
    validatePassword],
    async (req: Request, res: Response) => {
        try{
            const user = await User.findOne({email: req.body.email});
            console.log(user)

            if(!user) {
                return res.status(403).json({message: "Login failed"})
            }
            
            //inputted password matches with corresponding password in database
            if (bcrypt.compareSync(req.body.password, user.password_hash as string)){
                const jwtPayload : JwtPayload = {
                    id: user._id
                }

                //tokenize the data
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})
                console.log(token)

                return res.status(200).json({success: true, token})
            }
            return res.status(401).json({message: "Login failed"})

        //catch all errors
        }catch(error: any){
            console.error(`Error during user login: ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }
    })

//Note: entire code was pasted, needs modification
//Handle register requests
router.post("/register", 
    //sanithize user input (check for injection)
    [validateEmail,
    validatePassword,
    validateUsername],
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        //log errors, if there is any
        if(!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({errors: errors.array()})
        }
        try {
            //check if there is a user in the database with the provided email
            const existingUser = await User.findOne({email: req.body.email});
            console.log(existingUser)
            if(existingUser){
                return res.status(403).json({message: "Email already in use"})
            }

            //otherwise, create salt and encrypt the password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)


            //create new user record in db
            await User.create({
                email: req.body.email, 
                username: req.body.username, 
                password_hash: hash})

            //Return email and pw (with status code 200)
            return res.status(200).json({email: req.body.email, password: hash})


        //catch all errors
        }catch(error: any){
            //catch and log errors
            console.log(`Error during registration: ${error}`)
            return res.status(500).json({error: "Internal Server Error"})

        }
})
    
router.post("/login/google", passport.authenticate("google",  {scope: ['profile']}))

/*router.get("/auth/google/callback", passport.authenticate("google", {
    session:false,
    failureRedirect: "/login"
    }), async(req: Request, res: Response) => {

        try{
            //const user : IUser | null = await User.findOne({googleId: (req.user as {id:string}).id})
            const jwtPayload: JwtPayload = {}

            //if user is not in the databse yet:
            if(!user){

                //create other values (default):
                const language: string = "en"
                const mode: string = "light"

                const newUser : IUser = await User.create({
                    username: (req.user as {displayName : string}).displayName,
                    email: (req.user as {displayName : string}).displayName, //THIS NEEDS TO BE REPLACED
                    //googleId: (req.user as {id: string}).id,
                    language: language, 
                    mode: mode
                })

                jwtPayload.username = newUser.username
                //jwtPayload.id = newUser.googleId
            }
            //if user already exists:
            else{
                jwtPayload.username = user.username
                //jwtPayload.id = user.googleId
            }

            //tokenize and redirect
            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "5m"})
            res.redirect("index.html?token=" + token)

        //catch all errors
        }catch(error: any){
            console.error(`Error during external login: ${error}`)
            res.status(500).json({error: "Internal Server Error"})
        }

    
})*/

export default router