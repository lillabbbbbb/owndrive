"use strict";
//This file handles all requests that are sent when a user is authenticated
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
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
//Route to a file of a user
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
exports.default = userRouter;
//# sourceMappingURL=user.js.map