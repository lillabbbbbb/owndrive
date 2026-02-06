"use strict";
//this router file is for handling all backend communication related to modifying files (and their permissions)
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const File_1 = require("../models/File");
const mongoose_1 = require("mongoose");
const userValidation_1 = require("../middleware/userValidation");
const fileRouter = (0, express_1.Router)();
//This way, all the routes will first run validateUserToken 
fileRouter.use(userValidation_1.validateUserToken);
fileRouter.get("/", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        //get the right user
        const user = await User_1.User.findOne({ _id: userId }).populate("files");
        //return if user not found
        if (!user)
            throw new Error("Owner not found");
        console.log(user.files);
        return res.status(200).json(user.files);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//POST create new file
//params: id: string, filedata: JSON
fileRouter.post("/", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        const { filename, file_type = "doc", content = "", inUse = false, usedBy, status = "active", visibleToGuests = false, showsInHomeShared = true, private: isPrivate = false } = req.body;
        if (!filename) {
            return res.status(400).json({ message: "Filename is required" });
        }
        // 1️⃣ Check if a file with this name already exists for this user
        let file = await File_1.File.findOne({ filename, created_by: userId });
        if (!file) {
            // 2️⃣ Create new file
            const now = new Date();
            file = await File_1.File.create({
                created_at: now,
                created_by: userId,
                last_edited_at: now,
                file_type,
                filename,
                content,
                inUse,
                usedBy,
                status,
                visibleToGuests,
                showsInHomeShared,
                private: isPrivate,
                canView: [userId],
                canEdit: [userId],
            });
        }
        // 3️⃣ Push reference to user's files array
        await User_1.User.findByIdAndUpdate(userId, { $push: { files: file._id } });
        /*store new reference in the user record
        await User.findByIdAndUpdate(
            user._id,
            {
                $push: {
                    files: [newFile]
                }
            },
            { new: true }
        )
        */
        const updatedFile = await file.save();
        return res.status(200).json(updatedFile);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
fileRouter.patch("/", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        if (!req.body.filters) {
            return res.status(400).json({ message: "No filters provided" });
        }
        const result = await File_1.File.updateMany(req.body.filters, { $set: req.body.updates });
        return res.status(200).json({
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Failed to batch update files." });
    }
});
//Delete many instances based on filter
fileRouter.delete("/", async (req, res) => {
    const customReq = req;
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    const userId = customReq.user?._id;
    const { filters } = req.body;
    if (!filters || Object.keys(filters).length === 0) {
        return res.status(400).json({ message: "Filters cannot be empty" });
    }
    try {
        const result = await File_1.File.deleteMany(filters);
        res.json({ deletedCount: result.deletedCount });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to delete files" });
    }
});
//DELETE delete file
//params: username: string, token: string, filedata: JSON
fileRouter.delete("/:fileId", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        const existingFile = await File_1.File.findOne({ _id: req.params.fileId });
        if (!existingFile)
            return res.status(404).json({ "message": "File not found based on _id" });
        const filename = existingFile.filename;
        //delete record
        await User_1.User.findByIdAndUpdate(userId, {
            $pull: {
                files: { _id: existingFile._id }
            }
        }, { new: true });
        return res.status(200).json({ "message": `File "${filename}" successfully deleted.` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//GET fetch one file (and its data) of a user
//params: username: string, token: string, filename: JSON
//NOTE: check if the user has the right permissions to post to this route
//NOTE: check if the file is set to private by the owner (don't render to others if it is)!!!!
fileRouter.get("/:fileId", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        const existingFile = await File_1.File.findOne({ _id: req.params.fileId });
        if (!existingFile)
            return res.status(404).json({ "message": "File not found based on _id" });
        //find owner of file
        const user = await User_1.User
            .findOne({ _id: userId });
        //if user not found
        if (!user)
            return res.status(404).json({ message: `File's owner (user) not found` });
        const permissions = {
            accessType: "none",
            private: true
        };
        //CHECK IF TOKEN BELONGS TO ...
        //(1) if the token belongs to the author of the file
        if (existingFile.created_by === userId) {
            permissions.accessType = "owner";
            //RETURN HERE
            return res.status(200).json(permissions);
        }
        //check if file is set to private
        permissions.private = existingFile?.private;
        //(2) check if token is missing (=guest user) AND file not private
        permissions.accessType = "guest";
        //return res.status(200).json(permissions)
        //find out the username of the "accessor"
        const user2name = "some user";
        //(3) check if otheruser AND haspermission (view or edit!)
        if (existingFile?.canView.includes(userId))
            permissions.accessType = "viewer";
        else if (existingFile?.canView.includes(userId))
            permissions.accessType = "editor";
        return res.status(200).json({ permissions: permissions, file: existingFile });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//UPDATE one file
//params: username, updates
fileRouter.patch("/:fileId", async (req, res) => {
    try {
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        const updates = req.body;
        const { fileId } = req.params;
        //Check whether fileId can be coverted into a Mongoose ObjectId
        if (!fileId || Array.isArray(fileId)) {
            return res.status(400).json({ message: "Invalid file ID" });
        }
        if (!mongoose_1.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ message: "Invalid file ID format" });
        }
        // 1️⃣ Find the file and make sure the user owns it
        const file = await File_1.File.findOne({ _id: fileId, created_by: userId });
        if (!file) {
            return res.status(404).json({ message: "File not found or access denied" });
        }
        // 2️⃣ Check for filename conflict if updates include a new filename
        if (updates.filename) {
            const conflict = await File_1.File.findOne({
                filename: updates.filename,
                created_by: userId,
                _id: { $ne: new mongoose_1.Types.ObjectId(fileId) } // exclude the current file itself
            });
            if (conflict) {
                return res.status(400).json({ message: "A file with this name already exists" });
            }
        }
        // 3️⃣ Apply updates (only fields provided in the request)
        Object.entries(updates).forEach(([key, value]) => {
            file[key] = value;
        });
        // 4️⃣ Update last_edited_at if not provided
        if (!updates.last_edited_at) {
            file.last_edited_at = new Date();
        }
        // 5️⃣ Save changes
        const updatedFile = await file.save();
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
fileRouter.patch("/:fileId/lock", async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        // 1️⃣ Find the file and make sure the user owns it
        const file = await File_1.File.findOne({ _id: fileId, created_by: userId });
        const canEdit = await File_1.File.findOne({ _id: fileId, canEdit: userId }) || File_1.File.findOne({ _id: fileId, created_by: userId });
        if (!file || !canEdit) {
            return res.status(404).json({ message: "File not found or access denied" });
        }
        await File_1.File.findByIdAndUpdate(userId, { inUse: true, usedBy: userId });
        return res.status(200).json({ "message": `File locked by ${userId}` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
fileRouter.patch("/:fileId/unlock", async (req, res) => {
    try {
        const fileId = req.params.fileId;
        const customReq = req;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const userId = customReq.user?._id;
        // 1️⃣ Find the file and make sure the user owns it
        const file = await File_1.File.findOne({ _id: fileId, created_by: userId });
        if (!file) {
            return res.status(404).json({ message: "File not found or access denied" });
        }
        await File_1.File.findByIdAndUpdate(userId, { inUse: false, usedBy: null });
        return res.status(200).json({ "message": `File unlocked` });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
exports.default = fileRouter;
//# sourceMappingURL=file.js.map