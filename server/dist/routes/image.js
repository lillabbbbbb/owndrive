"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Image_1 = require("../models/Image");
const User_1 = require("../models/User");
const userValidation_1 = require("../middleware/userValidation");
const imageRouter = (0, express_1.Router)();
imageRouter.use(userValidation_1.validateUserToken);
imageRouter.get("/", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        const user = await User_1.User.findOne({ _id: userId });
        if (!user)
            return res.status(404).json({ message: `User not found` });
        console.log("User found:", user?._id);
        console.log("Profile pic ID:", user?.profile_pic); // ✅ What is this?
        const imageId = user?.profile_pic;
        if (!imageId)
            return res.status(404).json({ "message": "This user has not set a profile picture yet." });
        const existingImage = await Image_1.Image.findOne({ _id: imageId });
        console.log("Image found:", existingImage); // ✅ What does this return?
        if (!existingImage)
            return res.status(404).json({ "message": "Image not found based on _id" });
        return res.status(200).json(existingImage);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
exports.default = imageRouter;
//# sourceMappingURL=image.js.map