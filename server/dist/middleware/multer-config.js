"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToDisk = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
//Disk storage
const diskStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        // What's the actual path here?
        console.log("🔍 Multer saving to:", path_1.default.join(__dirname, '../../public/images'));
        console.log("🔍 __dirname is:", __dirname);
        const uploadPath = path_1.default.join(__dirname, '../../public/images');
        // Check if directory exists
        if (!fs_1.default.existsSync(uploadPath)) {
            console.log("❌ Directory doesn't exist, creating it...");
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const name = file.originalname.split('.').slice(0, -1).join('.');
        console.log(name);
        const filename = name + '-' + Date.now() + path_1.default.extname(file.originalname);
        console.log("🔍 Multer generating filename:", filename);
        cb(null, filename);
    }
});
exports.uploadToDisk = (0, multer_1.default)({ storage: diskStorage });
//Memory storage
const memoryStorage = multer_1.default.memoryStorage();
const uploadToMemory = (0, multer_1.default)({ storage: memoryStorage });
exports.default = uploadToMemory;
//# sourceMappingURL=multer-config.js.map