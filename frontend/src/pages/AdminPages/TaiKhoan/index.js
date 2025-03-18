import { Space, Table, Typography, Button, Modal, Input, Form, Select } from "antd";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { registerRoute, getAllUsers } from "../../../utils";

import axios from "axios";

export default function TaiKhoan() {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm(); // Form Ant Design
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    // Hàm lấy danh sách người dùng từ API
    const getAllUsers = async () => {
        try {
            const response = await axios.get("https://vks-website.onrender.com/api/users/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource(response.data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách người dùng!");
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    // Hàm xử lý tạo tài khoản mới
    const handleCreateAccount = async () => {
        try {
            const values = await form.validateFields();
            console.log("Dữ liệu gửi đi:", values); // Kiểm tra dữ liệu

            if (!values.role) {
                values.role = "user"; // Gán giá trị mặc định nếu role bị undefined
            }

            const response = await axios.post("https://vks-website.onrender.com/api/users/register", values, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("Phản hồi từ server:", response.data);
            toast.success("Tạo tài khoản thành công!");
            setIsModalAddOpen(false);
            form.resetFields();
            getAllUsers();
        } catch (error) {
            console.error("Lỗi khi tạo tài khoản:", error.response?.data || error.message);
            toast.error("Lỗi khi tạo tài khoản!");
        }
    };



    return (
        <div>
            <Space size={20} direction={"vertical"} style={{ width: "100%" }}>
                <Space direction="horizontal" style={{ justifyContent: "space-between", width: "100%" }}>
                    <Typography.Title level={4}>Danh sách người dùng</Typography.Title>
                    <Button type="primary" onClick={() => setIsModalAddOpen(true)}>
                        Tạo tài khoản
                    </Button>
                </Space>

                <Table
                    columns={[
                        { key: '1', title: "ID", dataIndex: "_id" },
                        { key: '2', title: "Tên", dataIndex: "username" },
                        { key: '3', title: "Email", dataIndex: "email" },
                        { key: '4', title: "Số điện thoại", dataIndex: "phone" },
                        { key: '5', title: "Vai trò", dataIndex: "role" },
                    ]}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </Space>

            {/* Modal thêm tài khoản */}
            <Modal
                title="Tạo tài khoản mới"
                open={isModalAddOpen}
                onCancel={() => setIsModalAddOpen(false)}
                onOk={handleCreateAccount}
                okText="Tạo"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="username" label="Tên người dùng" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="role" label="Vai trò" initialValue="user">
                        <Select>
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="admin">Admin</Select.Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Modal>

            <ToastContainer />
        </div>
    );
}
