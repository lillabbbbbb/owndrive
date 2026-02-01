//DB model for File

import mongoose, {Document, Schema, Types } from "mongoose";

interface IFile extends Document {
   created_at: Date,
   created_by: Types.ObjectId,
   last_edited_at: Date,
   file_type: string,
   filename: string,
   content: string,
   canView: Types.ObjectId[], //list of usernames that can view the file
   canEdit: Types.ObjectId[], //list of usernames that can edit the file
   visibleToGuests: boolean,
   showsInHomeShared: boolean,
   private: boolean,
   status: string, //"active" or "archived"
   archivedAt?: Date,
   inUse: boolean, //= is anyone viewing (with edit permission) /editing this document
   usedBy?: Types.ObjectId //the user _id, if any, that is "using" the file
}

const fileSchema = new Schema({
   created_at: {type: Date, required: true}, //permanent
   created_by: {type: Schema.Types.ObjectId, ref: 'User', required: true}, //permanent
   last_edited_at: {type: Date, required: true},
   file_type: {type: String, required: true, default: ".docx"}, //permanent
   filename: {type: String, required: true},
   content: {type: String, required: true, default: ""},
   canView: {type: [Schema.Types.ObjectId], required: true, default : []}, //list of userids that can view the file
   canEdit: {type: [Schema.Types.ObjectId], required: true, default : []}, //list of userids that can edit the file
   visibleToGuests: {type: Boolean, required: true, default: false},
   showsInHomeShared: {type: Boolean, required: true, default: true},
   private: {type: Boolean, required: true, default: false},
   status: {type: String, required: true, default: "active"},
   archivedAt: {type: Date, required: false},
   inUse: {type: Boolean, required: true}, //= is anyone viewing (with edit permission) /editing this document
   usedBy: {type: Schema.Types.ObjectId, required: false} //the user _id, if any, that is "using" the file

})

const File: mongoose.Model<IFile> = mongoose.model<IFile>("File", fileSchema)

export {File, IFile}