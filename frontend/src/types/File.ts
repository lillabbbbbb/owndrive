import {FILE_CATEGORIES} from "../../../server/src/types/file"

export interface IFileFrontend {
    _id: string
    created_at: Date,
   created_by: string,
   last_edited_at: Date,
   file_type: string,
   filename: string,
   mime_type: string;
   content?: string;
   file_url?: string;
   data?: Uint8Array;
   canView: string[], //list of usernames that can view the file
   canEdit: string[], //list of usernames that can edit the file
   visibleToGuests: boolean,
   showsInHomeShared: boolean,
   private: boolean,
   status: string, //"active" or "archived"
   archivedAt?: Date,
   inUse: boolean, //= is anyone viewing (with edit permission) /editing this document
   usedBy?: string //the user _id, if any, that is "using" the file
}


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

export function getFrontendFileCategory(file: IFileFrontend): CategoryName {
  console.log(file.mime_type)
  if (FILE_CATEGORIES.editable.includes(file.mime_type)) return CATEGORY_NAMES.Editable;
  if (FILE_CATEGORIES.image.includes(file.mime_type)) return CATEGORY_NAMES.Image;
  if (FILE_CATEGORIES.viewOnly.includes(file.mime_type)) return CATEGORY_NAMES.ViewOnly;
  return CATEGORY_NAMES.Other;
}
