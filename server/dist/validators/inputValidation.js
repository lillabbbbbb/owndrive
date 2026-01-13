"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsername = exports.validatePassword = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
exports.validateEmail = (0, express_validator_1.body)("email").trim().isEmail().escape();
exports.validatePassword = (0, express_validator_1.body)("password").trim().isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
}).escape();
exports.validateUsername = (0, express_validator_1.body)("username").trim().isLength({ min: 3, max: 25 }).escape();
//# sourceMappingURL=inputValidation.js.map