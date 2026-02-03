"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateUserToken = (req, res, next) => {
    console.log('Headers received:', req.headers);
    console.log('Auth header:', req.headers.authorization);
    const token = req.header("authorization")?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "Token not found." });
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        if (!verified)
            return res.status(401).json({ message: "User not found" });
        console.log(verified);
        req.user = verified;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.validateUserToken = validateUserToken;
//# sourceMappingURL=userValidation.js.map