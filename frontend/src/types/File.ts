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
   data?: Buffer;
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