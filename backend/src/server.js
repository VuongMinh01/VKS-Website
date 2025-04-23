import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";  // ❗ Chỉ giữ dòng này, không cần `mongoose.connect()`
import userRoutes from "./routes/v1/userRoute.js";
import congVanRoutes from "./routes/v1/congVanRoute.js";
import khoHangRoutes from "./routes/v1/khoHangRoute.js";

import axios from "axios";

// Load biến môi trường từ .env
dotenv.config();

// Lấy IP Public để debug
const getPublicIP = async () => {
    try {
        const res = await axios.get("https://api64.ipify.org?format=json");
        console.log(`🌐 Public Render IP: ${res.data.ip}`);
    } catch (error) {
        console.error("❌ Lỗi lấy IP:", error);
    }
};
getPublicIP();

// Kết nối MongoDB Atlas
connectDB();  // ❗ Dùng connectDB() thay vì mongoose.connect()

const app = express();
const PORT = process.env.PORT || 8017;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/congvan", congVanRoutes);
app.use("/api/khohang", khoHangRoutes);


// Route test API
app.get("/", (req, res) => {
    res.send("🚀 Server is running with MongoDB Atlas!");
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
