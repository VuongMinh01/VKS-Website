import express from "express";
import {
    addSanPham,
    deleteSanPham,
    updateSanPham,
    searchSanPham,
    getAllSanPham
} from "../../controller/sanPhamController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Các API sản phẩm có xác thực
router.post("/add", verifyToken, addSanPham);             // Thêm sản phẩm
router.delete("/delete/:id", verifyToken, deleteSanPham); // Xóa sản phẩm
router.put("/update/:id", verifyToken, updateSanPham);    // Cập nhật sản phẩm
router.get("/search", verifyToken, searchSanPham);        // Tìm kiếm sản phẩm
router.get("/all", verifyToken, getAllSanPham);           // Lấy tất cả sản phẩm

export default router;
