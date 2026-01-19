"use strict";
//user and admin validation (checking valid token, checking access)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdminToken = exports.validateUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateUserToken = (req, res, next) => {
    const token = req.header("authorization")?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token not found." });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Token not found." });
    }
};
exports.validateUserToken = validateUserToken;
const validateAdminToken = (req, res, next) => {
    console.log("Authorization header:", req.header("authorization"));
    const token = req.header("authorization")?.split(" ")[1];
    if (!token)
        return res.status(403).json({ message: "Token not found" });
    console.log("token found");
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = verified;
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied." });
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ message: "Access denied." });
    }
};
exports.validateAdminToken = validateAdminToken;
//# sourceMappingURL=userValidation.js.map