import mongoose from "mongoose";

const khoHangSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const KhoHang = mongoose.model("KhoHang", khoHangSchema);

export default KhoHang;
