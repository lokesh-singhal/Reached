import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface User extends Document {
    username: string,
    fullName: string,
    email: string,
    password: string,
}

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;