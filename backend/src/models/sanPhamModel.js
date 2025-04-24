import mongoose from "mongoose";

const sanPhamSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        trim: true
    },
    tenSanPham: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    soLuongTon: {
        type: Number,
        required: true,
        min: 0
    },
    donGia: {
        type: Number,
        required: true,
        min: 0
    },
    danhMuc: {
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

const SanPham = mongoose.model("SanPham", sanPhamSchema);

export default SanPham;
