import mongoose from "mongoose";

const congVanSchema = new mongoose.Schema({
    congVanId: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        trim: true
    },
    congVanTitle: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        trim: true
    },
    congVanContent: {
        type: String,
        required: false,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const CongVan = mongoose.model("CongVan", congVanSchema);

export default CongVan;
