import express from "express";
import {
    addCongVan,
    deleteCongVan,
    updateCongVan,
    searchCongVan,
    getAllCongVan
} from "../../controller/congVanController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js"; // ✅ Thêm xác thực

const router = express.Router();

// Các API công văn có xác thực
router.post("/add", verifyToken, addCongVan);          // Thêm công văn
router.delete("/delete/:id", verifyToken, deleteCongVan); // Xóa công văn
router.put("/update/:id", verifyToken, updateCongVan); // Cập nhật công văn
router.get("/search", verifyToken, searchCongVan);     // Tìm kiếm công văn
router.get("/all", verifyToken, getAllCongVan);        // 🔥 Lấy tất cả công văn

export default router;
