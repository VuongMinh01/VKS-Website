import KhoHang from "../models/khoHangModel.js";

// Thêm kho hàng mới
export const addKhoHang = async (req, res) => {
    try {
        const { id, name, quantity, price, type } = req.body;

        // Kiểm tra kho hàng đã tồn tại chưa
        const existingKho = await KhoHang.findOne({ id });
        if (existingKho) return res.status(400).json({ message: "Kho hàng ID đã tồn tại!" });

        // Tạo kho hàng mới
        const newKho = new KhoHang({ id, name, quantity, price, type });
        await newKho.save();

        return res.status(201).json({ message: "Thêm kho hàng thành công!", khoHang: newKho });
    } catch (error) {
        console.error("Lỗi khi thêm kho hàng:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Xóa kho hàng theo MongoDB _id
export const deleteKhoHang = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedKho = await KhoHang.findByIdAndDelete(id);

        if (!deletedKho) return res.status(404).json({ message: "Kho hàng không tồn tại!" });

        return res.json({ message: "Xóa kho hàng thành công!", deletedKho });
    } catch (error) {
        console.error("Lỗi khi xóa kho hàng:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Cập nhật kho hàng theo MongoDB _id
export const updateKhoHang = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedKho = await KhoHang.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedKho) return res.status(404).json({ message: "Kho hàng không tồn tại!" });

        return res.json({ message: "Cập nhật kho hàng thành công!", khoHang: updatedKho });
    } catch (error) {
        console.error("Lỗi khi cập nhật kho hàng:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Tìm kiếm kho hàng theo từ khóa trong name hoặc type
export const searchKhoHang = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });

        const results = await KhoHang.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { type: { $regex: q, $options: "i" } }
            ]
        }).lean();

        return res.json(results);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm kho hàng:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả kho hàng
export const getAllKhoHang = async (req, res) => {
    try {
        const khoHangs = await KhoHang.find().lean();
        return res.json(khoHangs);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách kho hàng:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};
