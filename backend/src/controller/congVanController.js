import CongVan from "../models/congVanModel.js";

// Thêm công văn mới
export const addCongVan = async (req, res) => {
    try {
        const { congVanId, congVanTitle, congVanContent } = req.body;

        // Kiểm tra công văn đã tồn tại chưa
        const existingCongVan = await CongVan.findOne({ congVanId });
        if (existingCongVan) return res.status(400).json({ message: "Công văn ID đã tồn tại!" });

        // Tạo công văn mới
        const newCongVan = new CongVan({ congVanId, congVanTitle, congVanContent });
        await newCongVan.save();

        return res.status(201).json({ message: "Thêm công văn thành công!", congVan: newCongVan });
    } catch (error) {
        console.error("Lỗi khi thêm công văn:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Xóa công văn theo ID
export const deleteCongVan = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCongVan = await CongVan.findByIdAndDelete(id);

        if (!deletedCongVan) return res.status(404).json({ message: "Công văn không tồn tại!" });

        return res.json({ message: "Xóa công văn thành công!", deletedCongVan });
    } catch (error) {
        console.error("Lỗi khi xóa công văn:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Cập nhật công văn theo ID
export const updateCongVan = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCongVan = await CongVan.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedCongVan) return res.status(404).json({ message: "Công văn không tồn tại!" });

        return res.json({ message: "Cập nhật công văn thành công!", congVan: updatedCongVan });
    } catch (error) {
        console.error("Lỗi khi cập nhật công văn:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Tìm kiếm công văn theo từ khóa trong title và content
export const searchCongVan = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });

        const results = await CongVan.find({
            $or: [
                { congVanTitle: { $regex: q, $options: "i" } },
                { congVanContent: { $regex: q, $options: "i" } }
            ]
        }).lean(); // ⚡ Tăng hiệu suất

        return res.json(results);
    } catch (error) {
        console.error("Lỗi khi tìm kiếm công văn:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};

// Lấy tất cả công văn
export const getAllCongVan = async (req, res) => {
    try {
        const congVans = await CongVan.find().lean(); // ⚡ Tăng hiệu suất
        return res.json(congVans);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách công văn:", error);
        return res.status(500).json({ message: "Lỗi server!", error: error.message });
    }
};
