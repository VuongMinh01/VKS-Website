import PhieuNhapKho from "../models/phieuNhapKhoModel.js";
import PhieuXuatKho from "../models/phieuXuatKhoModel.js";
import SanPham from "../models/sanPhamModel.js";

// Thêm phiếu nhập kho
export const addPhieuNhapKho = async (req, res) => {
    try {
        const { maPhieu, sanPham, soLuongNhap, nguoiNhap } = req.body;

        // Kiểm tra sản phẩm tồn tại
        const products = await SanPham.find({ '_id': { $in: sanPham } });
        if (products.length !== sanPham.length) {
            return res.status(404).json({ message: "Một hoặc nhiều sản phẩm không tồn tại." });
        }

        // Cập nhật số lượng tồn kho
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
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Thêm phiếu xuất kho
export const addPhieuXuatKho = async (req, res) => {
    try {
        const { maPhieu, sanPham, soLuongXuat, nguoiXuat } = req.body;

        // Kiểm tra sản phẩm tồn tại và đủ số lượng để xuất
        const products = await SanPham.find({ '_id': { $in: sanPham } });
        if (products.length !== sanPham.length) {
            return res.status(404).json({ message: "Một hoặc nhiều sản phẩm không tồn tại." });
        }

        // Cập nhật số lượng tồn kho sau khi xuất
        for (const productId of sanPham) {
            const product = await SanPham.findById(productId);
            if (product.soLuongTon < soLuongXuat) {
                return res.status(400).json({ message: "Sản phẩm không đủ số lượng để xuất." });
            }
            product.soLuongTon -= soLuongXuat;
            await product.save();
        }

        // Tạo phiếu xuất kho
        const newPhieuXuatKho = new PhieuXuatKho({
            maPhieu,
            sanPham,
            soLuongXuat,
            nguoiXuat
        });

        await newPhieuXuatKho.save();
        return res.status(201).json({ message: "Thêm phiếu xuất kho thành công!", phieuXuat: newPhieuXuatKho });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả phiếu nhập kho
export const getAllPhieuNhapKho = async (req, res) => {
    try {
        const phieuNhapKho = await PhieuNhapKho.find().populate("sanPham");
        return res.json(phieuNhapKho);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả phiếu xuất kho
export const getAllPhieuXuatKho = async (req, res) => {
    try {
        const phieuXuatKho = await PhieuXuatKho.find().populate("sanPham");
        return res.json(phieuXuatKho);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};
