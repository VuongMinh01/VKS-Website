import SanPham from "../models/sanPhamModel.js";

// Thêm sản phẩm mới
export const addSanPham = async (req, res) => {
    try {
        const { id, tenSanPham, soLuongTon, donGia, danhMuc } = req.body;

        // Kiểm tra sản phẩm đã tồn tại chưa
        const existingSanPham = await SanPham.findOne({ id });
        if (existingSanPham) return res.status(400).json({ message: "ID sản phẩm đã tồn tại!" });

        // Tạo sản phẩm mới
        const newSanPham = new SanPham({ id, tenSanPham, soLuongTon, donGia, danhMuc });
        await newSanPham.save();

        return res.status(201).json({ message: "Thêm sản phẩm thành công!", sanPham: newSanPham });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Xóa sản phẩm theo MongoDB _id
export const deleteSanPham = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSanPham = await SanPham.findByIdAndDelete(id);

        if (!deletedSanPham) return res.status(404).json({ message: "Sản phẩm không tồn tại!" });

        return res.json({ message: "Xóa sản phẩm thành công!", deletedSanPham });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Cập nhật sản phẩm theo MongoDB _id
export const updateSanPham = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSanPham = await SanPham.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedSanPham) return res.status(404).json({ message: "Sản phẩm không tồn tại!" });

        return res.json({ message: "Cập nhật sản phẩm thành công!", sanPham: updatedSanPham });
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Tìm kiếm sản phẩm theo từ khóa trong tên hoặc danh mục
export const searchSanPham = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });

        const results = await SanPham.find({
            $or: [
                { tenSanPham: { $regex: q, $options: "i" } },
                { danhMuc: { $regex: q, $options: "i" } }
            ]
        }).lean();

        return res.json(results);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả sản phẩm
export const getAllSanPham = async (req, res) => {
    try {
        const sanPhams = await SanPham.find().lean();
        return res.json(sanPhams);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};
