import { IFile } from "../models/File";

export const FILE_CATEGORIES = {
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


export const CATEGORY_NAMES = {
  Editable: "editable",
  Image: "image",
  ViewOnly: "viewOnly",
  Other: "other",
} as const;

export type CategoryName = typeof CATEGORY_NAMES[keyof typeof CATEGORY_NAMES];

export function getFileCategory(file: File): CategoryName {
  console.log(file.type)
  if (FILE_CATEGORIES.editable.includes(file.type)) return CATEGORY_NAMES.Editable;
  if (FILE_CATEGORIES.image.includes(file.type)) return CATEGORY_NAMES.Image;
  if (FILE_CATEGORIES.viewOnly.includes(file.type)) return CATEGORY_NAMES.ViewOnly;
  return CATEGORY_NAMES.Other;
}



export const SUPPORTED_TEXT_TYPES = {
    'text/plain': '.txt',
    'text/markdown': '.md',
    'text/html': '.html',
    'application/json': '.json',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
} as const;

export const SUPPORTED_IMAGE_TYPES = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'image/svg+xml': '.svg',
} as const;