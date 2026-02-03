"use strict";
//routes on index page, login and registration
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_passport_config_1 = __importDefault(require("../middleware/google-passport-config"));
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const inputValidation_1 = require("../validators/inputValidation");
const dotenv_1 = __importDefault(require("dotenv"));
//import { validateToken} from "../middleware/validateToken"
const router = (0, express_1.Router)();
dotenv_1.default.config();
//route to anything else: handled in frontend
//Handle login requests
router.post("/login", 
//sanithize user input (check for injection)
[inputValidation_1.validateEmail,
    inputValidation_1.validatePassword], async (req, res) => {
    try {
        console.log(await User_1.User.find().lean().exec());
        const user = await User_1.User.findOne({ email: req.body.email });
        console.log(user);
        if (!user) {
            return res.status(403).json({ message: "Login failed" });
        }
        //inputted password matches with corresponding password in database
        if (bcrypt_1.default.compareSync(req.body.password, user.password_hash)) {
            const jwtPayload = {
                _id: user._id
            };
            //tokenize the data
            const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "20m" });
            console.log(token);
            return res.status(200).json({ user: user, token });
        }
        return res.status(401).json({ message: "Login failed" });
        //catch all errors
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
//Note: entire code was pasted, needs modification
//Handle register requests
router.post("/register", 
//sanithize user input (check for injection)
[inputValidation_1.validateEmail,
    inputValidation_1.validatePassword,
    inputValidation_1.validateUsername], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    //log errors, if there is any
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //check if there is a user in the database with the provided email
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        console.log(existingUser);
        if (existingUser) {
            return res.status(403).json({ message: "Email already in use" });
        }
        //otherwise, create salt and encrypt the password
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        //create new user record in db
        await User_1.User.create({
            email: req.body.email,
            username: req.body.username,
            password_hash: hash
        });
        //Return email and pw (with status code 200)
        return res.status(200).json({ email: req.body.email, password: hash });
        //catch all errors
    }
    catch (error) {
        //catch and log errors
        console.log(`Error during registration: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/login/google", google_passport_config_1.default.authenticate("google", { scope: ['profile'] }));
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
exports.default = router;
//# sourceMappingURL=index.js.map