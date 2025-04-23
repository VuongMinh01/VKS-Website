import { Space, Table, Typography, Button, Modal, Input } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";


const API_URL = "https://vks-website.onrender.com/api/khohang";

export default function KhoHang() {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [values, setValues] = useState({ id: "", title: "", content: "" });
    const [dataSource, setDataSource] = useState([]);
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    // Xử lý toggle nội dung kho hàng
    const toggleExpand = (key) => {
        setExpandedRowKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };
    useEffect(() => {
        fetchKhoHang();
    }, []);

    // 🔹 API: Lấy danh sách kho hàng
    const fetchKhoHang = async () => {
        try {
            console.log("🔄 Đang làm mới danh sách kho hàng...");
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDataSource(response.data);
            console.log("✅ Dữ liệu kho hàng:", response.data); // ✅ In dữ liệu ra console
            toast.success("Làm mới thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi tải danh sách kho hàng:", error);
            toast.error("Lỗi tải danh sách kho hàng");
        }
    };

    // 🔹 API: Thêm kho hàng
    const handleAdd = async () => {
        if (!values.title || !values.content) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/add`, {
                khoHangId: Date.now().toString(),
                khoHangTitle: values.title,
                khoHangContent: values.content,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDataSource([...dataSource, response.data.khoHang]);
            setIsModalAddOpen(false);
            setValues({ id: "", title: "", content: "" }); // Reset form
            toast.success("Thêm kho hàng thành công!");
        } catch (error) {
            toast.error("Lỗi khi thêm kho hàng");
        }
    };

    // 🔹 API: Cập nhật kho hàng
    const handleUpdate = async () => {
        if (!values.title || !values.content) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/update/${values.id}`, {
                khoHangTitle: values.title,
                khoHangContent: values.content,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDataSource(dataSource.map(item => item._id === values.id ? response.data.khoHang : item));
            setIsModalUpdateOpen(false);
            setValues({ id: "", title: "", content: "" }); // Reset form
            toast.success("Cập nhật kho hàng thành công!");
        } catch (error) {
            toast.error("Lỗi khi cập nhật kho hàng");
        }
    };

    // 🔹 API: Xóa kho hàng
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa kho hàng này?")) {
            try {
                await axios.delete(`${API_URL}/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDataSource(dataSource.filter(item => item._id !== id));
                toast.success("Xóa kho hàng thành công!");
            } catch (error) {
                toast.error("Lỗi khi xóa kho hàng");
            }
        }
    };

    return (
        <div style={{ padding: 16 }}>
            <Space size={20} direction="vertical" style={{ width: "100%" }}>
                {/* Tiêu đề và nút thêm kho hàng */}
                <Space
                    direction="horizontal"
                    style={{
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >
                    <Typography.Title level={4} style={{ margin: 0 }}>
                        Danh sách kho hàng
                    </Typography.Title>
                    <Space>
                        <Button type="default" onClick={fetchKhoHang}>
                            🔄 Làm mới
                        </Button>
                        <Button type="primary" onClick={() => setIsModalAddOpen(true)}>
                            ➕ Thêm Kho hàng
                        </Button>
                    </Space>
                </Space>

                {/* Bảng danh sách kho hàng */}
                <Table
                    columns={[
                        { key: "0", title: "STT", render: (_, __, index) => index + 1, width: 80 },
                        { key: "1", title: "Tiêu đề", dataIndex: "khoHangTitle", width: 250, ellipsis: true },
                        {
                            key: "2",
                            title: "Nội dung",
                            dataIndex: "khoHangContent",
                            width: 400,
                            render: (text, record) => (
                                <>
                                    {expandedRowKeys.includes(record._id)
                                        ? text
                                        : text.length > 50
                                            ? `${text.substring(0, 50)}...`
                                            : text}
                                    {text.length > 50 && (
                                        <Button
                                            type="link"
                                            onClick={() => toggleExpand(record._id)}
                                            style={{ marginLeft: 8, fontSize: "18px", fontWeight: "bold" }} // 👈 Tăng kích thước
                                        >
                                            {expandedRowKeys.includes(record._id) ? "+" : "-"}
                                        </Button>
                                    )}
                                </>
                            ),
                        },
                        {
                            key: "3",
                            title: "Actions",
                            width: 120,
                            render: (record) => (
                                <Space size="middle">
                                    <DeleteOutlined
                                        onClick={() => handleDelete(record._id)}
                                        style={{ color: "red", cursor: "pointer" }}
                                    />
                                    <EditOutlined
                                        onClick={() => {
                                            setValues({ id: record._id, title: record.khoHangTitle, content: record.khoHangContent });
                                            setIsModalUpdateOpen(true);
                                        }}
                                        style={{ color: "green", cursor: "pointer" }}
                                    />
                                </Space>
                            ),
                        },
                    ]}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: "max-content" }}
                    style={{ width: "100%" }}
                />
            </Space>

            {/* Modal Thêm Kho hàng */}
            <Modal
                title="Thêm Kho hàng"
                open={isModalAddOpen}
                onOk={handleAdd}
                onCancel={() => {
                    setIsModalAddOpen(false);
                    setValues({ id: "", title: "", content: "" }); // Reset form
                }}
            >
                <Input
                    placeholder="Tiêu đề kho hàng"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    style={{ marginBottom: 10 }}
                />
                <Input.TextArea
                    placeholder="Nội dung kho hàng"
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            </Modal>

            {/* Modal Cập nhật Kho hàng */}
            <Modal
                title="Cập nhật Kho hàng"
                open={isModalUpdateOpen}
                onOk={handleUpdate}
                onCancel={() => { setIsModalUpdateOpen(false); setValues({ id: "", title: "", content: "" }); }}
            >
                <Input
                    placeholder="Tiêu đề kho hàng"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    style={{ marginBottom: 10 }}
                />
                <Input.TextArea
                    placeholder="Nội dung kho hàng"
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            </Modal>
        </div>
    );
};
