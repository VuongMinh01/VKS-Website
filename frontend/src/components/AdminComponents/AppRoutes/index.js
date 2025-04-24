// src/components/AdminComponents/AppRoutes/index.js

import React from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../../../pages/Admin"; // Import trang admin của bạn
import Home from "../../../pages/HomePage"; // Import trang home
import PrivateRoute from "../../PrivateRoute"; // Import PrivateRoute để bảo vệ route
import CongVan from "../../../pages/AdminPages/CongVan"; // Import các trang admin khác
import TaiKhoan from "../../../pages/AdminPages/TaiKhoan";
import KhoHang from "../../../pages/AdminPages/KhoHang";
import SanPham from "../../../pages/AdminPages/SanPham";

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
            <Route
                path="/khohang"
                element={
                    <PrivateRoute role="admin">
                        <KhoHang />
                    </PrivateRoute>
                }
            />
            <Route
                path="/sanpham"
                element={
                    <PrivateRoute role="admin">
                        <SanPham />
                    </PrivateRoute>
                }
            />

            {/* Route cho user */}
            <Route path="/" element={<Home />} />
        </Routes>
    );
}
