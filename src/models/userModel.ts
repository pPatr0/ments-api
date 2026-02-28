import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>({
    name: { type: String, required: true, minlength: 3, maxlength: 255 },
    email: { type: String, required: true, unique: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 6, maxlength: 1024 },
    registerDate: { type: Date, default: Date.now }
});

export const UserModel = model<User>('User', userSchema);