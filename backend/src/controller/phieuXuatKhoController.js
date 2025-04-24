import PhieuXuatKho from '../models/PhieuXuatKho.js';
import SanPham from '../models/sanPhamModel.js';
import mongoose from 'mongoose';

// Lấy danh sách phiếu xuất kho
export const getAllPhieuXuatKho = async (req, res) => {
    try {
        const phieuXuatKho = await PhieuXuatKho.find().populate('sanPham.sanPham'); // Populate để hiển thị thông tin sản phẩm
        res.json(phieuXuatKho);
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

        // Chuyển đổi ID sản phẩm từ string sang ObjectId
        // Kiểm tra và chuyển đổi ID sản phẩm sang ObjectId
        console.log(sanPham);  // In ra để kiểm tra dữ liệu từ client
        sanPham.forEach(item => {
            if (!mongoose.Types.ObjectId.isValid(item.sanPham)) {
                throw new Error(`ID không hợp lệ: ${item.sanPham}`);
            }
            item.sanPham = new mongoose.Types.ObjectId(item.sanPham);
        });


        // Lấy danh sách sản phẩm từ DB
        const sanPhamIds = sanPham.map(item => item.sanPham);
        const products = await SanPham.find({ '_id': { $in: sanPhamIds } });

        // Tạo map sản phẩm để đối chiếu
        const productMap = new Map();
        products.forEach(product => {
            productMap.set(product._id.toString(), product);
        });

        // Duyệt qua các sản phẩm để kiểm tra số lượng tồn
        for (const item of sanPham) {
            const product = productMap.get(item.sanPham.toString());
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm không tồn tại: ${item.sanPham}` });
            }

            if (product.soLuongTon < item.soLuong) {
                return res.status(400).json({ message: `Sản phẩm ${product.tenSanPham} không đủ số lượng để xuất.` });
            }

            // Cập nhật tồn kho
            product.soLuongTon -= item.soLuong;
            await product.save();
        }

        // Tạo và lưu phiếu xuất kho
        const newPhieuXuatKho = new PhieuXuatKho({
            maPhieu,
            sanPham,
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
