//DB model for User

import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
   username?: string, //only for Google users?
   googleId?: string, //google ID
   email: string,
   password_hash: string,
   profile_pic_link?: string, //!
   language: string,
   mode: string, //light or dark mode

}

const userSchema = new Schema({
    username: {type: String, required: false, unique: true},
    googleId: {type: String, required: false, unique: true},
    email: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true},
    profile_pic_link: {type: String, required: false},
    language: {type: String, required: true},
    mode: {type: String, required: true},
})

const User: mongoose.Model<IUser> = mongoose.model<IUser>("User", userSchema)

export {User, IUser}