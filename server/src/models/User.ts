//DB model for User

import mongoose, {Document, Schema} from "mongoose";
import { IFile } from "./File";

export interface IUser extends Document {
   username?: string, //only for Google users?
   //googleId?: string, //google ID
   email: string,
   password_hash?: string,
   profile_pic?: string, //!
   language: string,
   mode: string, //light or dark mode
   files: IFile[]
}


const userSchema = new Schema({
    username: {type: String, required: false, unique: true},
    //googleId: {type: String, required: false},
    email: {type: String, required: true, unique: true},
    password_hash: {type: String, required: false},
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }], // array of references
    session: { type: Schema.Types.ObjectId, ref: 'Session' }, // session schema
    profile_pic: { type: Schema.Types.ObjectId, ref: 'Image', required: false },
    language: {type: String, required: true},
    mode: {type: String, required: true},
})

export const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

