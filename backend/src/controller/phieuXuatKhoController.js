import PhieuXuatKho from '../models/PhieuXuatKho.js';
import SanPham from '../models/sanPhamModel.js';
import mongoose from 'mongoose';

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
        const { maPhieu, sanPham, nguoiXuat, ngayXuat } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!maPhieu || !sanPham || !Array.isArray(sanPham) || sanPham.length === 0 || !nguoiXuat) {
            return res.status(400).json({ message: "Thiếu thông tin phiếu xuất kho" });
        }

        // Kiểm tra từng sản phẩm
        const sanPhamIds = sanPham.map(item => item.sanPham);
        const products = await SanPham.find({ '_id': { $in: sanPhamIds } });

        // Kiểm tra nếu có sản phẩm không tồn tại
        const productMap = new Map();
        products.forEach(product => {
            productMap.set(product._id.toString(), product);
        });

        // Duyệt qua các sản phẩm trong phiếu xuất kho
        for (const item of sanPham) {
            const product = productMap.get(item.sanPham.toString());
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.sanPham}` });
            }

            // Kiểm tra số lượng tồn kho
            if (product.soLuongTon < item.soLuong) {
                return res.status(400).json({ message: `Sản phẩm ${product.tenSanPham} không đủ số lượng để xuất.` });
            }

            // Cập nhật số lượng tồn kho
            product.soLuongTon -= item.soLuong;
            await product.save();
        }

        // Tạo phiếu xuất kho mới
        const newPhieuXuatKho = new PhieuXuatKho({
            maPhieu,
            sanPham, // mảng các sản phẩm đã xuất
            nguoiXuat,
            ngayXuat: ngayXuat || new Date()
        });

        // Lưu phiếu xuất kho mới
        await newPhieuXuatKho.save();
        res.status(201).json({ message: "Thêm phiếu xuất kho thành công!", phieuXuat: newPhieuXuatKho });
    } catch (err) {
        console.error("Lỗi khi thêm phiếu xuất kho:", err);
        res.status(500).json({ message: "Lỗi khi thêm phiếu xuất kho", error: err.message });
    }
};
