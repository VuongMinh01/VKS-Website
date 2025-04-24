import PhieuXuatKho from '../models/PhieuXuatKho.js';
import SanPham from '../models/sanPhamModel.js';

// Lấy danh sách phiếu xuất kho
export const getAllPhieuXuatKho = async (req, res) => {
    try {
        const phieuXuatKho = await PhieuXuatKho.find(); // Lấy tất cả phiếu xuất kho
        res.json(phieuXuatKho); // Trả về kết quả
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu xuất kho" });
    }
};
export const addPhieuXuatKho = async (req, res) => {
    try {
        const { maPhieu, sanPham, nguoiXuat, ngayXuat } = req.body;

        if (!maPhieu || !sanPham || !Array.isArray(sanPham) || sanPham.length === 0 || !nguoiXuat) {
            return res.status(400).json({ message: "Thiếu thông tin phiếu xuất kho" });
        }

        // Kiểm tra và cập nhật tồn kho cho từng sản phẩm
        for (const item of sanPham) {
            const product = await SanPham.findById(item.sanPham);

            if (!product) {
                return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.sanPham}` });
            }

            if (product.soLuongTon < item.soLuong) {
                return res.status(400).json({ message: `Sản phẩm ${product.tenSanPham} không đủ số lượng để xuất.` });
            }

            product.soLuongTon -= item.soLuong;
            await product.save();
        }

        // Tạo phiếu xuất kho
        const newPhieuXuatKho = new PhieuXuatKho({
            maPhieu,
            sanPham, // là một mảng [{sanPham, soLuong}]
            nguoiXuat,
            ngayXuat: ngayXuat || new Date()
        });

        await newPhieuXuatKho.save();
        res.status(201).json({ message: "Thêm phiếu xuất kho thành công!", phieuXuat: newPhieuXuatKho });
    } catch (err) {
        console.error("Lỗi khi thêm phiếu xuất kho:", err);
        res.status(500).json({ message: "Lỗi khi thêm phiếu xuất kho", error: err.message });
    }
};
