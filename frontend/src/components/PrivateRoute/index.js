// src/components/PrivateRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        // Nếu người dùng không đăng nhập, chuyển hướng đến trang login
        return <Navigate to="/login" />;
    }

    // Kiểm tra nếu user có role đúng với yêu cầu
    if (user.role !== role) {
        // Nếu người dùng không phải admin, chuyển hướng về trang chính
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;
