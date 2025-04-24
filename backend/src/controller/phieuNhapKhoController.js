import PhieuNhapKho from "../models/phieuNhapKhoModel.js";
import SanPham from "../models/sanPhamModel.js";

// Thêm phiếu nhập kho mới
export const addPhieuNhapKho = async (req, res) => {
    try {
        const { maPhieu, sanPham, soLuongNhap, nguoiNhap } = req.body;

        // Tìm sản phẩm và kiểm tra xem có tồn tại không
        const products = await SanPham.find({ '_id': { $in: sanPham } });

        if (products.length !== sanPham.length) {
            return res.status(404).json({ message: "Một hoặc nhiều sản phẩm không tồn tại." });
        }

        // Cập nhật số lượng tồn kho của sản phẩm
        for (const productId of sanPham) {
            const product = await SanPham.findById(productId);
            product.soLuongTon += soLuongNhap;
            await product.save();
        }

        // Tạo phiếu nhập kho
        const newPhieuNhapKho = new PhieuNhapKho({
            maPhieu,
            sanPham,
            soLuongNhap,
            nguoiNhap
        });

        await newPhieuNhapKho.save();
        return res.status(201).json({ message: "Thêm phiếu nhập kho thành công!", phieuNhap: newPhieuNhapKho });
    } catch (error) {
        console.error("Lỗi khi thêm phiếu nhập kho:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả phiếu nhập kho
export const getAllPhieuNhapKho = async (req, res) => {
    try {
        const phieuNhapKho = await PhieuNhapKho.find().populate("sanPham"); // Kết nối với sản phẩm
        return res.json(phieuNhapKho);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};
