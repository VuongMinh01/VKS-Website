import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Login.css";

export default function Login() {
    const [values, setValues] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            // Nếu đã đăng nhập và có user, chuyển hướng theo role
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

    const handleLogin = (e) => {
        e.preventDefault();
        if (!handleValidation()) return;

        const users = {
            admin: { email: "admin", password: "admin123", role: "admin" },
            user: { email: "userVKS@gmail.com", password: "userVKS123", role: "user" },
        };

        const user = Object.values(users).find(
            (u) => u.email === values.email && u.password === values.password
        );

        if (user) {
            localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
            navigate(user.role === "admin" ? "/admin" : "/");
        } else {
            toast.error("Sai thông tin đăng nhập.");
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
