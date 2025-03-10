import express from "express";
import { addCongVan, deleteCongVan, updateCongVan, searchCongVan } from "../../controller/congVanController.js";

const router = express.Router();

// Thêm công văn mới
router.post("/add", addCongVan);

// Xóa công văn theo ID
router.delete("/delete/:id", deleteCongVan);

// Cập nhật công văn theo ID
router.put("/update/:id", updateCongVan);

// Tìm kiếm công văn theo từ khóa trong title hoặc content
router.get("/search", searchCongVan);

export default router;
