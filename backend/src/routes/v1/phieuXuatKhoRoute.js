import express from 'express';
import { addPhieuXuatKho, getAllPhieuXuatKho } from '../../controller/phieuXuatKhoController.js';
import { verifyToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Các API phiếu xuất kho có xác thực
router.post('/add', verifyToken, addPhieuXuatKho); // Thêm phiếu xuất kho
router.get('/all', verifyToken, getAllPhieuXuatKho); // Lấy tất cả phiếu xuất kho

export default router;
