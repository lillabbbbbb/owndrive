"use strict";
//this router file is for handling all backend communication related to modifying files (and their permissions)
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const File_1 = require("../models/File");
const fileRouter = (0, express_1.Router)();
//NOTE: SORTING CAN BE HANDLED IN THE FRONTEND
//GET fetch all files (and a lot of their data) of a user
//params: username: string, token: string, filter?: JSON[] (e.g. [{filter: "lillabbbbbb", filter_type: "user"}])
//since the filter is passed into here, pls also add it to the corresponding Session db object schema
fileRouter.get("/:user/home/files", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //get the right user
        const user = await User_1.User.findOne({ username: req.body.username });
        //return if user not found
        if (!user)
            throw new Error("Parent not found");
        //get the files of the user
        const files = user.files;
        //NOTE: HANDLE THE FILTERS (AND SORTING) IN THE FRONTEND
        //iterate the array and choose files which (1) name or (2) content or (3) author matches the filter
        //check the diff cases depending on what kind of filter it is
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
fileRouter.post("/:user/home/create", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if there is already a file with this name in the db of the owner (schema within schema), return if so'
        const existingFile = await File_1.File.findOne({ file_name: req.body.fileData.fileName });
        if (existingFile)
            return res.status(401).json({ "message": "A file with this name already exists" });
        //get the right user
        const user = await User_1.User
            .findOne({ username: req.body.username })
            .select("files");
        //if user not found
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        //pass the received fileData JSON to create the new db record
        const newFile = await File_1.File.create(req.body.fileData);
        //store new reference in the user record
        await User_1.User.findByIdAndUpdate(user._id, {
            $push: {
                files: newFile._id
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
fileRouter.delete("/:user/:file/delete", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //delete record
        //NOTE: I SHOULD IMPLEMENT THE ARCHIVED
        return res.status(200).json();
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
fileRouter.get("/:user/:file", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if file exists
        //check if token is missing (=guest user) AND file not private
        //check if otheruser AND haspermission (view or edit!)
        //return data JSON depending on permissions
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//maybe leave this feature out now, even though it would be nice if permission update were handled upon pressing a "save changes" button, not immediately
//POST / UPDATE change permisions of a file ????????????
//params: username: string, token: string, filename: JSON, ??????????? 
//UPDATE add a file permission to a user ..../permissions/add
//params: username: string, token: string, filedata: JSON, user2name: string, permissionType: string (e.g. "view", "edit")
//NOTE: check if the user has the right permissions to post to this route
fileRouter.patch(":file/permissions/add", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if file exists
        //check if user2name exists
        //update db record of file (ADD TO THE permissions array) How to add to existing data without overwriting?
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//UPDATE remove file permission from a user ..../permissions/remove
//params: username: string, token: string, filedata: JSON, user2name
fileRouter.patch(":file/permissions/remove", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if file exists
        //check if user2name exists
        //update db record of file (REMOVE ONE FROM permissions array) How to alter existing data without overwriting?
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
//UPDATE change guest view mode /visibility/change
//params: username: string, token: string, filedata: JSON, abledness: boolean (true or false)
//if it is already set like that, print that to the screen (for testing purposes)
fileRouter.patch(":file/visibility/change", async (req, res) => {
    try {
        //check if username (:user) matches the user signed inside the jwt token
        //NOTE: I COULD CREATE A MIDDLEWARE THAT DECONSTRUCTS THE TOKEN AND COMPARES IT TO THE USERNAME
        //check if file exists
        //check if user2name exists
        //update db record of file (visibility)
        return res.status(200).json();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal Server Error" });
    }
});
exports.default = fileRouter;
//# sourceMappingURL=file.js.map