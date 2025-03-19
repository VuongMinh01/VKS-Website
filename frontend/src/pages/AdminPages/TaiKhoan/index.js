import { Space, Table, Typography, Button, Modal, Input, Form, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function TaiKhoan() {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [form] = Form.useForm();
    const token = localStorage.getItem("token");

    // Lấy danh sách người dùng từ API
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
            if (!values.role) values.role = "user";

            await axios.post("https://vks-website.onrender.com/api/users/register", values, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Tạo tài khoản thành công!");
            setIsModalAddOpen(false);
            form.resetFields();
            getAllUsers();
        } catch (error) {
            toast.error("Lỗi khi tạo tài khoản!");
        }
    };

    // Hàm xử lý xóa người dùng
    const handleDeleteUser = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
            try {
                await axios.delete(`https://vks-website.onrender.com/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                message.success("Xóa nhân viên thành công!");
                getAllUsers(); // Cập nhật danh sách sau khi xóa
            } catch (error) {
                message.error("Lỗi khi xóa nhân viên!");
            }
        }
    };

    // return (
    //     <div>
    //         <Space size={20} direction="vertical" style={{ width: "100%" }}>
    //             <Space direction="horizontal" style={{ justifyContent: "space-between", width: "100%" }}>
    //                 <Typography.Title level={4}>Danh sách người dùng</Typography.Title>
    //                 <Button type="primary" onClick={() => setIsModalAddOpen(true)}>
    //                     Tạo tài khoản
    //                 </Button>
    //             </Space>

    //             <Table
    //                 columns={[
    //                     { key: "1", title: "ID", dataIndex: "_id" },
    //                     { key: "2", title: "Tên", dataIndex: "username" },
    //                     { key: "3", title: "Email", dataIndex: "email" },
    //                     { key: "4", title: "Số điện thoại", dataIndex: "phone" },
    //                     { key: "5", title: "Vai trò", dataIndex: "role" },
    //                     {
    //                         key: "6",
    //                         title: "Hành động",
    //                         render: (text, record) => (
    //                             <Button danger onClick={() => handleDeleteUser(record._id)}>
    //                                 Xóa
    //                             </Button>
    //                         ),
    //                     },
    //                 ]}
    //                 dataSource={dataSource}
    //                 rowKey="_id"
    //                 pagination={{ pageSize: 10 }}
    //             />
    //         </Space>

    //         {/* Modal thêm tài khoản */}
    //         <Modal
    //             title="Tạo tài khoản mới"
    //             open={isModalAddOpen}
    //             onCancel={() => setIsModalAddOpen(false)}
    //             onOk={handleCreateAccount}
    //             okText="Tạo"
    //             cancelText="Hủy"
    //         >
    //             <Form form={form} layout="vertical">
    //                 <Form.Item name="username" label="Tên người dùng" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
    //                     <Input />
    //                 </Form.Item>
    //                 <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Vui lòng nhập email hợp lệ!" }]}>
    //                     <Input />
    //                 </Form.Item>
    //                 <Form.Item name="phone" label="Số điện thoại">
    //                     <Input />
    //                 </Form.Item>
    //                 <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
    //                     <Input.Password />
    //                 </Form.Item>
    //                 <Form.Item name="role" label="Vai trò" initialValue="user">
    //                     <Select>
    //                         <Select.Option value="user">User</Select.Option>
    //                         <Select.Option value="admin">Admin</Select.Option>
    //                     </Select>
    //                 </Form.Item>
    //             </Form>
    //         </Modal>

    //         <ToastContainer />
    //     </div>
    // );
    return (
        <div style={{ padding: 16 }}>
            <Space size={20} direction="vertical" style={{ width: "100%" }}>
                {/* Tiêu đề và nút thêm tài khoản */}
                <Space
                    direction="horizontal"
                    style={{
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap", // ✅ Để tránh vỡ layout trên mobile
                        gap: 10, // ✅ Khoảng cách giữa các phần tử
                    }}
                >
                    <Typography.Title level={4} style={{ margin: 0 }}>Danh sách người dùng</Typography.Title>
                    <Button type="primary" onClick={() => setIsModalAddOpen(true)}>
                        Tạo tài khoản
                    </Button>
                </Space>

                {/* Bảng danh sách người dùng */}
                <Table
                    columns={[
                        { key: "1", title: "ID", dataIndex: "_id", width: 100 },
                        { key: "2", title: "Tên", dataIndex: "username", width: 150 },
                        { key: "3", title: "Email", dataIndex: "email", width: 200 },
                        { key: "4", title: "Số điện thoại", dataIndex: "phone", width: 150 },
                        { key: "5", title: "Vai trò", dataIndex: "role", width: 100 },
                        {
                            key: "6",
                            title: "Hành động",
                            width: 100,
                            render: (text, record) => (
                                <Button danger onClick={() => handleDeleteUser(record._id)}>
                                    Xóa
                                </Button>
                            ),
                        },
                    ]}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }} // ✅ Cho phép cuộn ngang trên mobile
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
