import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Form, Input, Button, Card, message } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../../utils";
import "../../css/Login.css"
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
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify({ email: user.email, role: user.role }));
                toast.success(message || "Đăng nhập thành công!");
                navigate(user.role === "admin" ? "/admin" : "/"); // Điều hướng ngay lập tức
            } else {
                toast.error("Dữ liệu phản hồi không hợp lệ!");
            }

        } catch (error) {
            console.error("Lỗi từ API:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại!");
        }
    };

    return (
        <Row
            justify="center"
            align="middle"
            style={{
                minHeight: "100vh",
                backgroundColor: "cornflowerblue",
                display: "flex",
                padding: "20px",
            }}
        >
            <Col xs={22} sm={16} md={12} lg={8}>
                <Card
                    title={
                        <h2 style={{
                            fontSize: "32px",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: "cornflowerblue"
                        }}>
                            Đăng nhập
                        </h2>
                    }
                    bordered={false}
                    style={{
                        borderRadius: 10,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                >

                    <Form layout="vertical">
                        <Form.Item label="Tên đăng nhập">
                            <Input
                                placeholder="Nhập email"
                                onChange={(e) => setValues({ ...values, email: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item label="Mật khẩu">
                            <Input.Password
                                placeholder="Nhập mật khẩu"
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" block onClick={handleLogin}>
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                        Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
                    </p>
                    <p style={{ textAlign: "center" }}>
                        Quên mật khẩu? <a href="/forgetPassword">Khôi phục</a>
                    </p>
                </Card>
            </Col>
            <ToastContainer />
        </Row>
    );
}
