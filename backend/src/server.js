import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import mongoose from "mongoose";
import userRoutes from "./routes/v1/userRoute.js"
import congVanRoutes from "./routes/v1/congVanRoute.js";

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Failed:", err.message));



// Load biến môi trường từ .env
dotenv.config();
// Kết nối MongoDB Atlas
connectDB();

const app = express();
const PORT = process.env.PORT || 8017;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/congvan", congVanRoutes);

// Route test API
app.get("/", (req, res) => {
    res.send("🚀 Server is running with MongoDB Atlas!");
});

// Khởi động server
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});
