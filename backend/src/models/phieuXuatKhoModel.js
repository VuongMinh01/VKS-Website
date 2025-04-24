import mongoose from "mongoose";

const phieuXuatKhoSchema = new mongoose.Schema({
    maPhieu: {
        type: String,
        required: true,
        unique: true
    },
    sanPham: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SanPham",
            required: true
        }
    ],
    soLuongXuat: {
        type: Number,
        required: true
    },
    nguoiXuat: {
        type: String,
        required: true
    },
    ngayXuat: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const PhieuXuatKho = mongoose.model("PhieuXuatKho", phieuXuatKhoSchema);

export default PhieuXuatKho;
