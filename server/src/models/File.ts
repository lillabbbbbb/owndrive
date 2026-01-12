//DB model for File

import mongoose, {Document, Schema} from "mongoose";

interface IFile extends Document {
   created_at: Date,
   created_by: string,
   last_edited_at: Date,
   file_type: string,
   file_name: string,
   word_cound?: number,
   canView: string[], //list of usernames that can view the file
   canEdit: string[], //list of usernames that can edit the file
   visibleToGuests: boolean,
   showsInHomeShared: boolean,
   private: boolean,
   inUse: boolean, //= is anyone viewing (with edit permission) /editing this document
   usedBy?: string //the user _id, if any, that is "using" the file
}

const fileSchema = new Schema({
    created_at: {type: Date, required: true},
   created_by: {type: String, required: true},
   last_edited_at: {type: Date, required: true},
   file_type: {type: String, required: true},
   file_name: {type: String, required: true},
   word_cound: {type: Number, required: false},
   canView: {type: Array<String>, required: true}, //list of usernames that can view the file
   canEdit: {type: Array<String>, required: true}, //list of usernames that can edit the file
   visibleToGuests: {type: Boolean, required: true},
   showsInHomeShared: {type: Boolean, required: true},
   private: {type: Boolean, required: true},
   inUse: {type: Boolean, required: true}, //= is anyone viewing (with edit permission) /editing this document
   usedBy: {type: String, required: false} //the user _id, if any, that is "using" the file

})

const File: mongoose.Model<IFile> = mongoose.model<IFile>("File", fileSchema)

export {File, IFile}