
import dotenv from "dotenv"
import 'dotenv/config'; //if this line is not HERE, the google oauth passport runs into an error
import passport from "./middleware/google-passport-config"
import express, { Express } from "express"
import { Request, Response } from "express";
import path from "path"
import router from "./routes/index"
import userRouter from "./routes/user"
import imageRouter from "./routes/image";
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import cors, { CorsOptions } from 'cors'
import fileRouter from "./routes/file";
import fs from 'fs'
import bodyParser from "body-parser";

console.log("🔥 ENTRY FILE LOADED");


//backbone of the backend



//Configure environment variables
dotenv.config()

//Establish server with Express
const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 8001


//Connect server to DB
export const mongoDB: string = "mongodb://127.0.0.1:27017/OwnDrive"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

// Connect function for scripts
export async function connectDB(): Promise<void> {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoDB);
    }
}

db.on("error", console.error.bind(console, "MongoDB connection error"))
//db.dropDatabase()
//console.log("Database dropped")

//Set up what the app should use
app.use(passport.initialize())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); //Max request body size is 10MB

//routers and other endpoints
app.use('/images', express.static(path.join(__dirname, '../public/images')))
app.use("/api/", router)
app.use("/api/users/", userRouter)
app.use("/api/files/", fileRouter)
app.use("/api/images/", imageRouter)



//Server listens to port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)

})


const allowedEnvs = ['development', 'test']
if (!allowedEnvs.includes(process.env.NODE_ENV ?? '')) {
    throw new Error('❌ Invalid environment for seeding')
}



//Enable cross-origin resource sharing

if (process.env.NODE_ENV === "development") {
    const corsOptions: CorsOptions = {
        origin: "http://localhost:3000",
        optionsSuccessStatus: 200,
    }

    app.use(cors(corsOptions))
} else if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("../..", "client", "build")))
    app.get("*", (req: Request, res: Response) => {
        if (req.path.startsWith("/api")) {
            return res.status(404).json({ message: "API route not found" });
        }
        res.sendFile(path.resolve("../..", "client", "build", "index.html"))
    })
}

