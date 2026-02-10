"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_IMAGE_TYPES = exports.SUPPORTED_TEXT_TYPES = exports.CATEGORY_NAMES = exports.FILE_CATEGORIES = void 0;
exports.getFileCategory = getFileCategory;
exports.FILE_CATEGORIES = {
    editable: [
        "text/plain",
        "text/html",
        "text/markdown",
        "application/rtf",
        "application/json",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    image: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ],
    viewOnly: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
};
exports.CATEGORY_NAMES = {
    Editable: "editable",
    Image: "image",
    ViewOnly: "viewOnly",
    Other: "other",
};
function getFileCategory(file) {
    console.log(file.type);
    if (exports.FILE_CATEGORIES.editable.includes(file.type))
        return exports.CATEGORY_NAMES.Editable;
    if (exports.FILE_CATEGORIES.image.includes(file.type))
        return exports.CATEGORY_NAMES.Image;
    if (exports.FILE_CATEGORIES.viewOnly.includes(file.type))
        return exports.CATEGORY_NAMES.ViewOnly;
    return exports.CATEGORY_NAMES.Other;
}
exports.SUPPORTED_TEXT_TYPES = {
    'text/plain': '.txt',
    'text/markdown': '.md',
    'text/html': '.html',
    'application/json': '.json',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};
exports.SUPPORTED_IMAGE_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
};
//# sourceMappingURL=file.js.map