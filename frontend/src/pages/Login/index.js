import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Login.css";
import { loginRoute } from "../../utils";
export default function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            navigate(user.role === "admin" ? "/admin" : "/");
        }
    }, [navigate]);

    const handleValidation = () => {
        const { email, password } = values;
        if (email !== "admin" && !email.includes("@")) {
            toast.error("Vui lòng nhập email hợp lệ.");
            return false;
        }
        if (password.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự.");
            return false;
        }
        return true;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        try {
            const response = await axios.post(loginRoute, values);
            console.log("Phản hồi từ API:", response.data);

            const { message, token, user } = response.data;

            if (token && user) {
                // Lưu token và user vào localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));

                toast.success(message || "Đăng nhập thành công!");

                // Điều hướng dựa theo role
                setTimeout(() => {
                    navigate(user.role === "admin" ? "/admin" : "/");
                }, 1500); // Đợi toast hiển thị xong
            } else {
                toast.error("Dữ liệu phản hồi không hợp lệ!");
            }
        } catch (error) {
            console.error("Lỗi từ API:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại!");
        }
    };




    return (
        <div className="mainContainer">
            <div className="Login">
                <h2 className="titleContainer">Đăng nhập</h2>
                <div className="inputContainer">
                    <input
                        className="inputBox"
                        type="text"
                        name="email"
                        placeholder="Tên đăng nhập"
                        onChange={(e) => setValues({ ...values, email: e.target.value })}
                    />
                </div>
                <div className="inputContainer">
                    <input
                        className="inputBox"
                        type="password"
                        name="password"
                        placeholder="Mật khẩu"
                        onChange={(e) => setValues({ ...values, password: e.target.value })}
                    />
                </div>
                <div className="inputContainer">
                    <button type="submit" onClick={handleLogin}>Đăng nhập</button>
                </div>
                <div className="login-links">
                    <p>
                        Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
                    </p>
                    <p>
                        Quên mật khẩu? <a href="/forgetPassword">Khôi phục</a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
