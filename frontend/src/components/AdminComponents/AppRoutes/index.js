// src/components/AdminComponents/AppRoutes/index.js

import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../../../pages/Admin"; // Import trang admin của bạn
import Home from "../../../pages/Home"; // Import trang home
import PrivateRoute from "../../PrivateRoute"; // Import PrivateRoute để bảo vệ route
import CongVan from "../../../pages/AdminPages/CongVan"; // Import các trang admin khác
import TaiKhoan from "../../../pages/AdminPages/TaiKhoan";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Đảm bảo chỉ người dùng admin mới có thể truy cập vào admin */}
            <Route
                path="/admin"
                element={
                    <PrivateRoute role="admin">
                        <Admin />
                    </PrivateRoute>
                }
            />

            <Route
                path="/congvan"
                element={
                    <PrivateRoute role="admin">
                        <CongVan />
                    </PrivateRoute>
                }
            />
            <Route
                path="/taikhoan"
                element={
                    <PrivateRoute role="admin">
                        <TaiKhoan />
                    </PrivateRoute>
                }
            />

            {/* Route cho user */}
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
