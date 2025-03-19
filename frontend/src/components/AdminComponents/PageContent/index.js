import React from "react";
import AppRoutes from "../AppRoutes"; // Đảm bảo đường dẫn đúng
import "../../../css/PageContent.css"
export default function PageContent() {
    return (
        <div className="PageContent">
            {/* Gọi AppRoutes để xử lý các route */}
            <AppRoutes />
        </div>
    );
}
