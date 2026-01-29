"use strict";
//this router file is for handling all backend communication related to modifying files (and their permissions)
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const File_1 = require("../models/File");
const userValidation_1 = require("../middleware/userValidation");
const fileRouter = (0, express_1.Router)();
//NOTE: SORTING CAN BE HANDLED IN THE FRONTEND
//GET fetch all files (and a lot of their data) of a user
//params: username: string, token: string, filter?: JSON[] (e.g. [{filter: "lillabbbbbb", filter_type: "user"}])
//since the filter is passed into here, pls also add it to the corresponding Session db object schema
fileRouter.get("/", async (req, res) => {
    try {
        //get the right user
        const user = await User_1.User.findOne({ _id: req.headers["authorization"] }).populate("files");
        //return if user not found
        if (!user)
            throw new Error("Owner not found");
        //get the files of the user
        const files = user.files;
        return res.status(200).json(files);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//POST create new file
//params: username: string, token: string, filedata: JSON
//NOTE: check if the user has the right permissions to post to this route
fileRouter.post("/create", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if there is already a file with this name in the db of the owner (schema within schema), return if so'
        const existingFile = await File_1.File.findOne({ filename: req.body.fileName });
        if (existingFile)
            return res.status(401).json({ "message": "A file with this name already exists" });
        //get the right user
        const user = await User_1.User
            .findOne({ email: req.body.email })
            .select("files");
        //if user not found
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const content = req.body.content ? req.body.content : "";
        const createdAt = new Date();
        //pass the received fileData JSON to create the new db record
        const newFile = await File_1.File.create({
            created_at: createdAt,
            created_by: req.body.email,
            last_edited_at: createdAt,
            file_type: ".docx",
            filename: req.body.fileName,
            content: content,
            canView: [],
            canEdit: [],
            visibleToGuests: false,
            showsInHomeShared: true,
            private: false,
            inUse: false,
        });
        //store new reference in the user record
        await User_1.User.findByIdAndUpdate(user._id, {
            $push: {
                files: [newFile]
            }
        }, { new: true });
        return res.status(200).json({ "message": "New file successfully saved" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//DELETE delete file
//params: username: string, token: string, filedata: JSON
fileRouter.delete("/:fileId", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if there is already a file with this name in the db of the owner (schema within schema), return if not
        const existingFile = await File_1.File.findOne({ filename: req.body.fileName });
        if (!existingFile)
            return res.status(404).json({ "message": "File not found with this name" });
        //get the right user
        const user = await User_1.User
            .findOne({ username: req.body.username })
            .select("files");
        //if user not found
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        //NOTE: I SHOULD IMPLEMENT THE ARCHIVED HERE
        //const file = await Archive.create(req.body.fileData);
        //delete record
        await User_1.User.findByIdAndUpdate(user._id, {
            $pull: {
                files: { filename: existingFile.filename }
            }
        }, { new: true });
        return res.status(200).json({ "message": `File "${req.body.filename}" successfully deleted.` });
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
fileRouter.get("/:fileId", userValidation_1.validateOwnerToken, async (req, res) => {
    try {
        //check if there is already a file with this name in the db of the owner (schema within schema), return if not
        const existingFile = await File_1.File.findOne({ file_name: req.body.fileName });
        if (!existingFile)
            return res.status(404).json({ "message": "File not found with this name" });
        //find owner of file
        const user = await User_1.User
            .findOne({ username: req.params?.username }); //ATTENTION: if there's a space in the req params, record may not be found
        //if user not found
        if (!user)
            return res.status(404).json({ message: `${req.body.username} workspace not found` });
        const permissions = {
            accessType: "none",
            private: true
        };
        //CHECK IF TOKEN BELONGS TO ...
        //(1) if the token belongs to the author of the file
        if (req.body.email === req.user?.email) {
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
        if (existingFile?.canView.includes(user2name))
            permissions.accessType = "viewer";
        else if (existingFile?.canView.includes(user2name))
            permissions.accessType = "editor";
        //return res.status(200).json(permissions)
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//UPDATE one file
//params: username, updates
//NOTE: check if the user has the right permissions to post to this route
fileRouter.patch("/:fileId", async (req, res) => {
    try {
        //
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
fileRouter.patch("/:fileId/lock", async (req, res) => {
    try {
        //
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
fileRouter.patch("/:fileId/unlock", async (req, res) => {
    try {
        //
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//DELETE LATER, ONLY HERE FOR TESTING
fileRouter.get("/files/list", async (req, res) => {
    try {
        const files = await File_1.File.find();
        console.log(files);
        return res.status(200).json(files);
    }
    catch (error) {
        console.log(`Error while fecthing users ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = fileRouter;
//# sourceMappingURL=file.js.map