import { Table, Typography, Button, Space, Modal, Form, Input, InputNumber, Select } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "https://vks-website.onrender.com/api/khohang";

export default function KhoHang() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false); // Modal cập nhật
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm(); // Form cho cập nhật
    const [currentItem, setCurrentItem] = useState(null); // Dữ liệu mặt hàng hiện tại
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchKhoHang();
    }, []);

    const fetchKhoHang = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource(response.data);
        } catch (err) {
            toast.error("Không thể tải danh sách kho hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleAddKho = async () => {
        try {
            const values = await formAdd.validateFields();
            const response = await axios.post(`${API_URL}/add`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource([...dataSource, response.data.khoHang]);
            toast.success("Thêm mặt hàng thành công!");
            formAdd.resetFields();
            setOpenAdd(false);
        } catch (err) {
            toast.error("Không thể thêm mặt hàng");
        }
    };

    const handleDeleteKho = async (id) => {
        // Sử dụng window.confirm() để xác nhận việc xoá
        const confirmed = window.confirm("Bạn có chắc muốn xoá mặt hàng này?");
        if (confirmed) {
            try {
                const response = await axios.delete(`${API_URL}/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setDataSource(dataSource.filter((item) => item._id !== id));
                    toast.success("Xoá thành công");
                } else {
                    toast.error("Xoá không thành công");
                }
            } catch (err) {
                toast.error("Xoá không thành công");
            }
        }
    };

    const handleUpdateKho = async () => {
        try {
            const values = await formUpdate.validateFields();
            const response = await axios.put(`${API_URL}/update/${currentItem._id}`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource(dataSource.map(item => item._id === currentItem._id ? response.data.khoHang : item));
            toast.success("Cập nhật thành công!");
            formUpdate.resetFields();
            setOpenUpdate(false);
        } catch (err) {
            toast.error("Không thể cập nhật mặt hàng");
        }
    };

    const handleOpenUpdate = (item) => {
        setCurrentItem(item);
        formUpdate.setFieldsValue({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            type: item.type,
        });
        setOpenUpdate(true);
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (_, __, index) => index + 1,
            width: 60,
        },
        {
            title: "Tên hàng",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Đơn giá",
            dataIndex: "price",
            key: "price",
        },
        {
            title: "Loại hàng",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleOpenUpdate(record)} style={{ marginRight: 8 }}>
                        Cập nhật
                    </Button>
                    <Button danger onClick={() => handleDeleteKho(record._id)}>
                        Xoá
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: 16 }}>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Space style={{ justifyContent: "space-between", width: "100%", flexWrap: "wrap" }}>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Danh sách kho hàng
                    </Typography.Title>
                    <Space>
                        <Button onClick={fetchKhoHang}>🔄 Làm mới</Button>
                        <Button type="primary" onClick={() => setOpenAdd(true)}>➕ Thêm mặt hàng</Button>
                    </Space>
                </Space>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                />
            </Space>

            {/* Modal thêm mặt hàng */}
            <Modal
                title="Thêm mặt hàng mới"
                open={openAdd}
                onCancel={() => setOpenAdd(false)}
                onOk={handleAddKho}
                okText="Thêm"
                cancelText="Huỷ"
                destroyOnClose
            >
                <Form form={formAdd} layout="vertical">
                    <Form.Item
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: "Vui lòng nhập ID!" }]}
                    >
                        <Input placeholder="Nhập ID mặt hàng" />
                    </Form.Item>

                    <Form.Item
                        label="Tên hàng"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên hàng!" }]}
                    >
                        <Input placeholder="Nhập tên hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Đơn giá"
                        name="price"
                        rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Loại hàng"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng chọn loại hàng!" }]}
                    >
                        <Select placeholder="Chọn loại hàng">
                            <Select.Option value="văn phòng phẩm">Văn phòng phẩm</Select.Option>
                            <Select.Option value="thiết bị">Thiết bị</Select.Option>
                            <Select.Option value="khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal cập nhật mặt hàng */}
            <Modal
                title="Cập nhật mặt hàng"
                open={openUpdate}
                onCancel={() => setOpenUpdate(false)}
                onOk={handleUpdateKho}
                okText="Cập nhật"
                cancelText="Huỷ"
                destroyOnClose
            >
                <Form form={formUpdate} layout="vertical">
                    <Form.Item
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: "Vui lòng nhập ID!" }]}
                    >
                        <Input disabled placeholder="ID mặt hàng" />
                    </Form.Item>

                    <Form.Item
                        label="Tên hàng"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập tên hàng!" }]}
                    >
                        <Input placeholder="Nhập tên hàng" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng"
                        name="quantity"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Đơn giá"
                        name="price"
                        rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Loại hàng"
                        name="type"
                        rules={[{ required: true, message: "Vui lòng chọn loại hàng!" }]}
                    >
                        <Select placeholder="Chọn loại hàng">
                            <Select.Option value="văn phòng phẩm">Văn phòng phẩm</Select.Option>
                            <Select.Option value="thiết bị">Thiết bị</Select.Option>
                            <Select.Option value="khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <ToastContainer />
        </div>
    );
}
