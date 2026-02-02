"use strict";
//DB model for File
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const fileSchema = new mongoose_1.Schema({
    created_at: { type: Date, required: true }, //permanent
    created_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }, //permanent
    last_edited_at: { type: Date, required: true },
    file_type: { type: String, required: true, default: ".docx" }, //permanent
    filename: { type: String, required: true },
    content: { type: String, required: true, default: "" },
    canView: { type: [mongoose_1.Schema.Types.ObjectId], required: true, default: [] }, //list of userids that can view the file
    canEdit: { type: [mongoose_1.Schema.Types.ObjectId], required: true, default: [] }, //list of userids that can edit the file
    visibleToGuests: { type: Boolean, required: true, default: false },
    showsInHomeShared: { type: Boolean, required: true, default: true },
    private: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, default: "active" },
    archivedAt: { type: Date, required: false },
    inUse: { type: Boolean, required: true }, //= is anyone viewing (with edit permission) /editing this document
    usedBy: { type: mongoose_1.Schema.Types.ObjectId, required: false } //the user _id, if any, that is "using" the file
});
const File = mongoose_1.default.model("File", fileSchema);
exports.File = File;
//# sourceMappingURL=File.js.map