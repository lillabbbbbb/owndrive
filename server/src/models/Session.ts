//DB model for Session

import mongoose, {Document, Schema} from "mongoose";

interface ISession extends Document {
    user: string, //_id of user
   sorting: string,
   filterType: string,
   filterKeyWords: string[],
   pagination_current: number
}

const sessionSchema = new Schema({
    author: {type: String, required: true},
})

const Session: mongoose.Model<ISession> = mongoose.model<ISession>("Session", sessionSchema)

export {Session, ISession}