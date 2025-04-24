import { Table, Typography, Button, Space, Modal, Form, Input, InputNumber, Select } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "https://vks-website.onrender.com/api/sanpham";

export default function SanPham() {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [formAdd] = Form.useForm();
    const [formUpdate] = Form.useForm();
    const [currentItem, setCurrentItem] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchSanPham();
    }, []);

    const fetchSanPham = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource(response.data);
        } catch (err) {
            toast.error("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSanPham = async () => {
        try {
            const values = await formAdd.validateFields();
            const response = await axios.post(`${API_URL}/add`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource([...dataSource, response.data.sanPham]);
            toast.success("Thêm sản phẩm thành công!");
            formAdd.resetFields();
            setOpenAdd(false);
        } catch (err) {
            toast.error("Không thể thêm sản phẩm");
        }
    };

    const handleDeleteSanPham = async (id) => {
        const confirmed = window.confirm("Bạn có chắc muốn xoá sản phẩm này?");
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
    const handleOpenAdd = () => {
        const maxIndex = dataSource.length;
        const nextId = `SP${String(maxIndex + 1).padStart(3, "0")}`;
        formAdd.setFieldsValue({ id: nextId }); // set ID mặc định
        setOpenAdd(true);
    };

    const handleUpdateSanPham = async () => {
        try {
            const values = await formUpdate.validateFields();
            const response = await axios.put(`${API_URL}/update/${currentItem._id}`, values, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDataSource(dataSource.map(item => item._id === currentItem._id ? response.data.sanPham : item));
            toast.success("Cập nhật thành công!");
            formUpdate.resetFields();
            setOpenUpdate(false);
        } catch (err) {
            toast.error("Không thể cập nhật sản phẩm");
        }
    };

    const handleOpenUpdate = (item) => {
        setCurrentItem(item);
        formUpdate.setFieldsValue({
            id: item.id,
            tenSanPham: item.tenSanPham,
            soLuongTon: item.soLuongTon,
            donGia: item.donGia,
            danhMuc: item.danhMuc,
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
            title: "Tên sản phẩm",
            dataIndex: "tenSanPham",
            key: "tenSanPham",
        },
        {
            title: "Số lượng tồn",
            dataIndex: "soLuongTon",
            key: "soLuongTon",
        },
        {
            title: "Đơn giá",
            dataIndex: "donGia",
            key: "donGia",
        },
        {
            title: "Danh mục",
            dataIndex: "danhMuc",
            key: "danhMuc",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button onClick={() => handleOpenUpdate(record)} style={{ marginRight: 8 }}>
                        Cập nhật
                    </Button>
                    <Button danger onClick={() => handleDeleteSanPham(record._id)}>
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
                        Danh sách sản phẩm
                    </Typography.Title>
                    <Space>
                        <Button onClick={fetchSanPham}>🔄 Làm mới</Button>
                        <Button type="primary" onClick={handleOpenAdd}>➕ Thêm sản phẩm</Button>
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

            {/* Modal thêm sản phẩm */}
            <Modal
                title="Thêm sản phẩm mới"
                open={openAdd}
                onCancel={() => setOpenAdd(false)}
                onOk={handleAddSanPham}
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
                        <Input placeholder="Nhập ID sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        label="Tên sản phẩm"
                        name="tenSanPham"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng tồn"
                        name="soLuongTon"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng tồn!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Đơn giá"
                        name="donGia"
                        rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="danhMuc"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                    >
                        <Select placeholder="Chọn danh mục">
                            <Select.Option value="văn phòng phẩm">Văn phòng phẩm</Select.Option>
                            <Select.Option value="thiết bị">Thiết bị</Select.Option>
                            <Select.Option value="khác">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal cập nhật sản phẩm */}
            <Modal
                title="Cập nhật sản phẩm"
                open={openUpdate}
                onCancel={() => setOpenUpdate(false)}
                onOk={handleUpdateSanPham}
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
                        <Input disabled placeholder="ID sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        label="Tên sản phẩm"
                        name="tenSanPham"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                        <Input placeholder="Nhập tên sản phẩm" />
                    </Form.Item>
                    <Form.Item
                        label="Số lượng tồn"
                        name="soLuongTon"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng tồn!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Đơn giá"
                        name="donGia"
                        rules={[{ required: true, message: "Vui lòng nhập đơn giá!" }]}
                    >
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                        label="Danh mục"
                        name="danhMuc"
                        rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                    >
                        <Select placeholder="Chọn danh mục">
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
