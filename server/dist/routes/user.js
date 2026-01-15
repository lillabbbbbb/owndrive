"use strict";
//This file handles all requests that are sent when a user is authenticated
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Image_1 = require("../models/Image");
const User_1 = require("../models/User");
const multer_config_1 = __importDefault(require("../middleware/multer-config"));
const userRouter = (0, express_1.Router)();
//route to anything else: handled in frontend
//Home
userRouter.get("/:user/home", async (req, res) => {
    try {
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//Route to a file of a user
//Return: JSON of the right File DB record
userRouter.get("/:user/:file", async (req, res) => {
    try {
        //
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//????????????
userRouter.post("/:user/:file/:permissions", async (req, res) => {
    try {
        //check if token exists
        //check if user is the owner
        //if not, check what access this user has to the file (view or edit)
        //check if user is logged in
        //check 
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//NOTE: Is this route really needed?
//upload profile pic
userRouter.post("/profile_pic/upload", multer_config_1.default.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const imgPath = req.file.path.replace("public", "");
        const image = new Image_1.Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath
        });
        await image.save();
        console.log("File uploaded and saved in the database");
        return res.status(201).json({ message: "File uploaded and saved in the database" });
    }
    catch (error) {
        console.error(`Error while uploading file: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//change profile picture
userRouter.patch("/profile_pic/change", multer_config_1.default.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        //set up the image 
        const imgPath = req.file.path.replace("public", "");
        const image = new Image_1.Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath,
            createdAt: new Date()
        });
        //get the right user
        const user = await User_1.User
            .findOne({ username: req.body.username })
            .select("image");
        //if user not found
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        //if there is no profile pic model in the user record
        if (!user?.profile_pic)
            return res.status(404).json({ message: 'Previous image not found' });
        //otherwise save the new image in the image db
        //Note: no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Image_1.Image.findByIdAndUpdate(user.profile_pic, { $set: {
                image
            } }, { runValidators: true });
        console.log("File successfully changed and saved in the database");
        return res.status(201).json({ message: "File uploaded and saved in the database" });
    }
    catch (error) {
        console.error(`Error while uploading file: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = userRouter;
//# sourceMappingURL=user.js.map