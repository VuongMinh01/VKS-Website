import express from "express";
import {
    addKhoHang,
    deleteKhoHang,
    updateKhoHang,
    searchKhoHang,
    getAllKhoHang
} from "../../controller/khoHangController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Các API kho hàng có xác thực
router.post("/add", verifyToken, addKhoHang);             // Thêm kho hàng
router.delete("/delete/:id", verifyToken, deleteKhoHang); // Xóa kho hàng
router.put("/update/:id", verifyToken, updateKhoHang);    // Cập nhật kho hàng
router.get("/search", verifyToken, searchKhoHang);        // Tìm kiếm kho hàng
router.get("/all", verifyToken, getAllKhoHang);           // Lấy tất cả kho hàng

export default router;
