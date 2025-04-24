import mongoose from "mongoose";

const phieuNhapKhoSchema = new mongoose.Schema({
    maPhieu: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    sanPham: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SanPham",  // Liên kết với model SanPham
            required: true
        }
    ],
    soLuongNhap: {
        type: Number,
        required: true,
        min: 1
    },
    ngayNhap: {
        type: Date,
        default: Date.now
    },
    nguoiNhap: {
        type: String,  // Ví dụ: tên người nhập kho
        required: true
    }
}, { timestamps: true });

const PhieuNhapKho = mongoose.model("PhieuNhapKho", phieuNhapKhoSchema);

export default PhieuNhapKho;
