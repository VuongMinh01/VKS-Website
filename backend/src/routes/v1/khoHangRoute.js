import express from "express";
import { verifyToken } from "../../middlewares/authMiddleware.js";
import {
    addPhieuNhapKho,
    addPhieuXuatKho,
    getAllPhieuNhapKho,
    getAllPhieuXuatKho
} from "../../controller/khoHangController.js";

const router = express.Router();

// API phiếu nhập kho
router.post("/phieunhap", verifyToken, addPhieuNhapKho);
router.get("/phieunhap", verifyToken, getAllPhieuNhapKho);

// API phiếu xuất kho
router.post("/phieuxuat", verifyToken, addPhieuXuatKho);
router.get("/phieuxuat", verifyToken, getAllPhieuXuatKho);

export default router;
