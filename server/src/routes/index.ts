//routes on index page, login and registration

import { Request, Response, Router } from "express"
import { body, Result, ValidationError, validationResult } from "express-validator"
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { TUser, User, Users } from "../models/User"
import { validateToken} from "../middleware/validateToken"
import passport from "../middleware/google-passport-config"

const router: Router = Router()


//route to anything else: handled in frontend


//Note: entire code was pasted, needs modification
//Handle login requests
router.post("/login", 
    body("email").trim().escape(),
    body("password").escape(),
    async (req: Request, res: Response) => {
        try{
            let user: TUser | undefined = Users.find((u) => u.email === req.body.email);
            console.log(user)

            if(!user) {
                return res.status(403).json({message: "Login failed"})
            }

            if (bcrypt.compareSync(req.body.password, user.password as string)){
                const jwtPayload : JwtPayload = {
                    email: user.email
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "2m"})
                console.log(token)

                return res.status(200).json({success: true, token})
            }
            return res.status(401).json({message: "Login failed"})


        }catch(error: any){
            console.error(`Error during user login: ${error}`)
            return res.status(500).json({error: "Internal Server Error"})
        }
    })

//Note: entire code was pasted, needs modification
//Handle register requests
router.post("/register", 
    //sanithize user input (check for injection)
    body("email").trim().isLength({min: 3}).escape(),
    body("password").isLength({min: 1}).escape(),
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        //log errors, if there is any
        if(!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({errors: errors.array()})
        }
        try {
            let existingUser: IUser | undefined = User.find((u) => u.email === req.body.email);
            console.log(existingUser)
            

            //return if there is already a user with this email
            if(existingUser){
                return res.status(403).json({message: "Email already in use"})
            }

            //create salt and encrypting the password
            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            //append new user to the local storage list
            Users.push({email: req.body.email, password: hash})

            //Return email and pw (with status code 200)
            return res.status(200).json({email: req.body.email, password: hash})



        }catch(error: any){
            //catch and log errors
            console.log(`Error during registration: ${error}`)
            return res.status(500).json({error: "Internal Server Error"})

        }
    })

    
router.post("/login/google", passport.authenticate("google",  {scope: ['profile']}))

router.get("auth/google/callback", passport.authenticate("google", {
    session:false,
    failureRedirect: "/user/login"
    }), async(req: Request, res: Response) => {

        try{
            const user : IUser | null = await User.findOne({googleId: (req.user as {id:string}).id})
            const jwtPayload: JwtPayload = {}

            if(!user){
                const newUser : IUser = await User.create({
                    username: (req.user as {displayName : string}).displayName,
                    googleId: (req.user as {id: string}).id
                })

                jwtPayload.username = newUser.username
                jwtPayload.id = newUser.googleId
            }
            else{
                jwtPayload.username = user.username
                jwtPayload.id = user.googleId
            }

            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "5m"})
            res.redirect("index.html?token=" + token)


        }catch(error: any){
            console.error(`Error during external login: ${error}`)
            res.status(500).json({error: "Internal Server Error"})
        }

    
})

export default router