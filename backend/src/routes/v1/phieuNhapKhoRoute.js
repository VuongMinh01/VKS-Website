import express from "express";
import { addPhieuNhapKho, getAllPhieuNhapKho } from "../../controller/phieuNhapKhoController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Các API phiếu nhập kho có xác thực
router.post("/add", verifyToken, addPhieuNhapKho); // Thêm phiếu nhập kho
router.get("/all", verifyToken, getAllPhieuNhapKho); // Lấy tất cả phiếu nhập kho

export default router;
