import express from "express";
import { registerUser, loginUser, getUserById, updateUser, deleteUser, getAllUsers } from "../../controller/userController.js";
import { verifyToken, verifyAdmin } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", verifyToken, getUserById);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser); // Chỉ admin mới có thể xóa user
router.get("/getAllUsers", verifyToken, getAllUsers);

export default router;
