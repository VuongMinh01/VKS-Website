import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://username:password@cluster.mongodb.net/dbname";

const testMongoConnection = async () => {
    try {
        console.log("🔄 Đang kiểm tra kết nối MongoDB...");
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Kết nối MongoDB thành công!");
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error);
    }
};

testMongoConnection();
