import PhieuXuatKho from '../models/PhieuXuatKho.js';

// Lấy danh sách phiếu xuất kho
export const getAllPhieuXuatKho = async (req, res) => {
    try {
        const phieuXuatKho = await PhieuXuatKho.find(); // Lấy tất cả phiếu xuất kho
        res.json(phieuXuatKho); // Trả về kết quả
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu xuất kho" });
    }
};

// Thêm phiếu xuất kho
export const addPhieuXuatKho = async (req, res) => {
    try {
        const { maPhieu, sanPham, soLuongXuat, nguoiXuat, ngayXuat } = req.body;

        // Kiểm tra nếu thiếu thông tin cần thiết
        if (!maPhieu || !sanPham || !soLuongXuat || !nguoiXuat || !ngayXuat) {
            return res.status(400).json({ message: "Thiếu thông tin phiếu xuất kho" });
        }

        // Tạo một phiếu xuất kho mới
        const newPhieuXuatKho = new PhieuXuatKho({
            maPhieu,
            sanPham,
            soLuongXuat,
            nguoiXuat,
            ngayXuat
        });

        await newPhieuXuatKho.save(); // Lưu phiếu vào cơ sở dữ liệu
        res.status(201).json(newPhieuXuatKho); // Trả về phiếu xuất kho đã được tạo
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thêm phiếu xuất kho", error: err.message });
    }
};
