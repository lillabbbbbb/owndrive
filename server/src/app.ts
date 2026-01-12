
import express, {Express} from "express"
import { Request, Response } from "express";
import path from "path"
import router from "./src/routes/index"
import userRouter from "./src/routes/user"
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"
import cors, {CorsOptions} from 'cors'


//backbone of the backend



//Configure environment variables
dotenv.config()

//Establish server with Express
const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 8001


//Connect server to DB
const mongoDB: string = "mongodb://127.0.0.1:27017/OwnDrive"
mongoose.connect(mongoDB)
mongoose.Promise = Promise
const db: Connection = mongoose.connection

db.on("error", console.error.bind(console, "MongoDB connection error"))


//Set up what Express should use
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))


app.use(express.static(path.join(__dirname, "../public")))
app.use("/", router)
app.use("/user/", userRouter)

//Server listens to port
app.listen(port, () => {
    console.log(`Server running on port ${port}`)

})

//Enable cross-origin resource sharing
if(process.env.NODE_ENV === "development") {
    const corsOptions: CorsOptions = {
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200,
    }

    app.use(cors(corsOptions))
} else if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("../..", "client", "build")))
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.resolve("../..", "client", "build", "index.html"))
    })
}
