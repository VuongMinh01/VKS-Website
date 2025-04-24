const phieuXuatKhoSchema = new mongoose.Schema({
    maPhieu: {
        type: String,
        required: true,
        unique: true
    },
    sanPham: [
        {
            sanPham: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "SanPham",
                required: true
            },
            soLuong: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
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
