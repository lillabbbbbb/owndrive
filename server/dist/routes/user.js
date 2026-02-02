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
const userValidation_1 = require("../middleware/userValidation");
const userRouter = (0, express_1.Router)();
userRouter.use(userValidation_1.validateUserToken);
//route to anything else: handled in frontend
//UPDATE Upload or change profile picture
userRouter.patch("/:userId/profile_pic", multer_config_1.default.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        //get the right user
        const user = await User_1.User
            .findOne({ _id: userId })
            .select("image");
        //if user not found
        if (!userId)
            return res.status(404).json({ message: 'User not found' });
        //set up the image 
        const imgPath = req.file.path.replace("public", "");
        const image = new Image_1.Image({
            filename: req.file.filename,
            description: req.body.description,
            path: imgPath,
            createdAt: new Date()
        });
        //if there is no profile pic model in the user record
        if (!user?.profile_pic) {
            //Create new image record in db
            const img = await Image_1.Image.create({
                filename: req.file.filename,
                description: req.body.description,
                path: imgPath,
                createdAt: new Date()
            });
            //Update user record, linking the new image's id to it
            User_1.User.findByIdAndUpdate({ userId, profile_pic: img._id });
        }
        //Note: If there was an image previously, then no need to update the parent (user) record since the Image was referenced, not embedded, in the model declaration
        await Image_1.Image.findByIdAndUpdate(user?.profile_pic, {
            $set: {
                image
            }
        }, { runValidators: true });
        console.log("Profile pic successfully changed and saved in the database");
        return res.status(201).json({ message: "Profile pic successfully uploaded and saved in the database" });
    }
    catch (error) {
        console.error(`Error while uploading file: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
//GET get profile picture of a user
//params: userId
userRouter.get("/:userId/profile_picture", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        //find the right user
        const user = await User_1.User
            .findOne({ _id: userId })
            .select("image");
        //if user not found
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        //if there is no profile pic model in the user record
        if (!user?.profile_pic)
            return res.status(404).json({ message: 'Profile picture not found' });
        console.log(user.profile_pic);
        return res.status(201).json(user.profile_pic);
    }
    catch (error) {
        console.error(`Error while uploading file: ${error}`);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = userRouter;
//# sourceMappingURL=user.js.map