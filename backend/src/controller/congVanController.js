import CongVan from "../models/congVanModel.js";

// Thêm công văn mới
export const addCongVan = async (req, res) => {
    try {
        const { congVanId, congVanTitle, congVanContent } = req.body;

        const existingCongVan = await CongVan.findOne({ congVanId });
        if (existingCongVan) return res.status(400).json({ message: "Công văn ID đã tồn tại!" });

        const newCongVan = new CongVan({ congVanId, congVanTitle, congVanContent });
        await newCongVan.save();

        res.status(201).json({ message: "Thêm công văn thành công!", congVan: newCongVan });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Xóa công văn theo ID
export const deleteCongVan = async (req, res) => {
    try {
        const deletedCongVan = await CongVan.findByIdAndDelete(req.params.id);
        if (!deletedCongVan) return res.status(404).json({ message: "Công văn không tồn tại!" });

        res.json({ message: "Xóa công văn thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Cập nhật công văn theo ID
export const updateCongVan = async (req, res) => {
    try {
        const updatedCongVan = await CongVan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCongVan) return res.status(404).json({ message: "Công văn không tồn tại!" });

        res.json({ message: "Cập nhật công văn thành công!", congVan: updatedCongVan });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Tìm kiếm công văn theo từ khóa trong title và content
export const searchCongVan = async (req, res) => {
    try {
        const keyword = req.query.q;
        if (!keyword) return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm!" });

        const results = await CongVan.find({
            $or: [
                { congVanTitle: { $regex: keyword, $options: "i" } },
                { congVanContent: { $regex: keyword, $options: "i" } }
            ]
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};
