import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "user" }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
