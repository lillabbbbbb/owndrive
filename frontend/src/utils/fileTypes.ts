import { IFileFrontend } from "../types/File";

export const FILE_CATEGORIES = {
  editable: [
    "text/plain",
    "text/html",
    "text/markdown",
    "application/rtf",
    "application/json",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  images: [
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

export function getFileCategory(file: IFileFrontend): "editable" | "images" | "viewOnly" | "other" {
  console.log(file.mime_type)
  if (FILE_CATEGORIES.editable.includes(file.mime_type)) return "editable";
  if (FILE_CATEGORIES.images.includes(file.mime_type)) return "images";
  if (FILE_CATEGORIES.viewOnly.includes(file.mime_type)) return "viewOnly";
  return "other";
}
