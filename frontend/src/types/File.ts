export interface IFileFrontend {
    _id: string
    created_at: Date,
   created_by: string,
   last_edited_at: Date,
   file_type: string,
   filename: string,
   content: string,
   canView: string[], //list of usernames that can view the file
   canEdit: string[], //list of usernames that can edit the file
   visibleToGuests: boolean,
   showsInHomeShared: boolean,
   private: boolean,
   isArchived: boolean,
   archivedAt?: Date,
   inUse: boolean, //= is anyone viewing (with edit permission) /editing this document
   usedBy?: string //the user _id, if any, that is "using" the file
}