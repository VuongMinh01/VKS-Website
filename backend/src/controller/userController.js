import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Đăng ký user mới
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, phone, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "Email hoặc username đã tồn tại!" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role === "admin" ? "admin" : "user",
        });

        await newUser.save();
        res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Đăng nhập user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng!" });

        // Tạo token JWT có chứa role
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ message: "Đăng nhập thành công!", token, user });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Lấy thông tin user theo ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // Ẩn password
        if (!user) return res.status(404).json({ message: "User không tồn tại!" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Cập nhật thông tin user
export const updateUser = async (req, res) => {
    try {
        const { password, role, ...updateData } = req.body;

        // Kiểm tra token trước khi cho phép cập nhật
        if (!req.user) {
            return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
        }

        // Không cho phép cập nhật password trực tiếp
        if (password) {
            return res.status(400).json({ message: "Không thể cập nhật mật khẩu tại đây!" });
        }

        // Nếu cập nhật role, chỉ admin mới có quyền
        if (role && req.user.role !== "admin") {
            return res.status(403).json({ message: "Bạn không có quyền thay đổi role!" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User không tồn tại!" });

        res.json({ message: "Cập nhật thành công!", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};

// Xóa user theo ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User không tồn tại!" });

        res.json({ message: "Xóa user thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server!", error });
    }
};
