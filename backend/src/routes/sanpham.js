import express from "express";
import { getSanPhamById } from "../../controller/sanPhamController.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Route lấy chi tiết sản phẩm
router.get("/:id", verifyToken, getSanPhamById);

export default router;
