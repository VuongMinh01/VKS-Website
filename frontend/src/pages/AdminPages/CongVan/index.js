import { Space, Table, Typography, Button, Modal, Input } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "https://vks-website.onrender.com/api/congvan";

export default function CongVan() {
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [values, setValues] = useState({ id: "", title: "", content: "" });
    const [dataSource, setDataSource] = useState([]);
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    // Xử lý toggle nội dung công văn
    const toggleExpand = (key) => {
        setExpandedRowKeys((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };
    useEffect(() => {
        fetchCongVan();
    }, []);

    // 🔹 API: Lấy danh sách công văn
    const fetchCongVan = async () => {
        try {
            const response = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDataSource(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách công văn:", error);
            toast.error("Lỗi tải danh sách công văn");
        }
    };

    // 🔹 API: Thêm công văn
    const handleAdd = async () => {
        if (!values.title || !values.content) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/add`, {
                congVanId: Date.now().toString(),
                congVanTitle: values.title,
                congVanContent: values.content,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDataSource([...dataSource, response.data.congVan]);
            setIsModalAddOpen(false);
            setValues({ id: "", title: "", content: "" }); // Reset form
            toast.success("Thêm công văn thành công!");
        } catch (error) {
            toast.error("Lỗi khi thêm công văn");
        }
    };

    // 🔹 API: Cập nhật công văn
    const handleUpdate = async () => {
        if (!values.title || !values.content) {
            toast.warning("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        try {
            const response = await axios.put(`${API_URL}/update/${values.id}`, {
                congVanTitle: values.title,
                congVanContent: values.content,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDataSource(dataSource.map(item => item._id === values.id ? response.data.congVan : item));
            setIsModalUpdateOpen(false);
            setValues({ id: "", title: "", content: "" }); // Reset form
            toast.success("Cập nhật công văn thành công!");
        } catch (error) {
            toast.error("Lỗi khi cập nhật công văn");
        }
    };

    // 🔹 API: Xóa công văn
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa công văn này?")) {
            try {
                await axios.delete(`${API_URL}/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setDataSource(dataSource.filter(item => item._id !== id));
                toast.success("Xóa công văn thành công!");
            } catch (error) {
                toast.error("Lỗi khi xóa công văn");
            }
        }
    };

    // return (
    //     <div>
    //         <Space size={20} direction={"vertical"}>
    //             <Typography.Title level={4}>Danh sách công văn</Typography.Title>
    //             <Button type="primary" onClick={() => setIsModalAddOpen(true)}>Thêm Công văn</Button>

    //             {/* Bảng danh sách công văn */}
    //             <Table
    //                 columns={[
    //                     { key: "0", title: "STT", render: (_, __, index) => index + 1, width: 80 },
    //                     { key: "1", title: "Tiêu đề", dataIndex: "congVanTitle", width: "30%", ellipsis: true },
    //                     { key: "2", title: "Nội dung", dataIndex: "congVanContent", width: "50%", ellipsis: true },
    //                     {
    //                         key: "3",
    //                         title: "Actions",
    //                         width: 150,
    //                         render: (record) => (
    //                             <>
    //                                 <DeleteOutlined
    //                                     onClick={() => handleDelete(record._id)}
    //                                     style={{ color: "red", marginLeft: "12px" }}
    //                                 />
    //                                 <EditOutlined
    //                                     onClick={() => {
    //                                         setValues({ id: record._id, title: record.congVanTitle, content: record.congVanContent });
    //                                         setIsModalUpdateOpen(true);
    //                                     }}
    //                                     style={{ color: "green", marginLeft: "15px" }}
    //                                 />
    //                             </>
    //                         ),
    //                     },
    //                 ]}
    //                 dataSource={dataSource}
    //                 rowKey="_id"
    //                 pagination={{ pageSize: 10 }}
    //                 style={{ width: "100%" }} // ✅ Làm table chiếm hết ngang màn hình
    //             />

    //         </Space>

    //         {/* Modal Thêm Công văn */}
    //         <Modal
    //             title="Thêm Công văn"
    //             open={isModalAddOpen}
    //             onOk={handleAdd}
    //             onCancel={() => { setIsModalAddOpen(false); setValues({ id: "", title: "", content: "" }); }} // Reset form khi đóng
    //         >
    //             <Input
    //                 placeholder="Tiêu đề công văn"
    //                 value={values.title}
    //                 onChange={(e) => setValues({ ...values, title: e.target.value })}
    //                 style={{ marginBottom: "10px" }}
    //             />
    //             <Input
    //                 placeholder="Nội dung công văn"
    //                 value={values.content}
    //                 onChange={(e) => setValues({ ...values, content: e.target.value })}
    //             />
    //         </Modal>

    //         {/* Modal Cập nhật Công văn */}
    //         <Modal
    //             title="Cập nhật Công văn"
    //             open={isModalUpdateOpen}
    //             onOk={handleUpdate}
    //             onCancel={() => { setIsModalUpdateOpen(false); setValues({ id: "", title: "", content: "" }); }} // Reset form khi đóng
    //         >
    //             <Input
    //                 placeholder="Tiêu đề công văn"
    //                 value={values.title}
    //                 onChange={(e) => setValues({ ...values, title: e.target.value })}
    //                 style={{ marginBottom: "10px" }}
    //             />
    //             <Input
    //                 placeholder="Nội dung công văn"
    //                 value={values.content}
    //                 onChange={(e) => setValues({ ...values, content: e.target.value })}
    //             />
    //         </Modal>

    //         <ToastContainer />
    //     </div>
    // );
    return (
        <div style={{ padding: 16 }}>
            <Space size={20} direction="vertical" style={{ width: "100%" }}>
                {/* Tiêu đề và nút thêm công văn */}
                <Space
                    direction="horizontal"
                    style={{
                        justifyContent: "space-between",
                        width: "100%",
                        flexWrap: "wrap",
                        gap: 10,
                    }}
                >
                    <Typography.Title level={4} style={{ margin: 0 }}>Danh sách công văn</Typography.Title>
                    <Button type="primary">Thêm Công văn</Button>
                </Space>

                {/* Bảng danh sách công văn */}
                <Table
                    columns={[
                        { key: "0", title: "STT", render: (_, __, index) => index + 1, width: 80 },
                        { key: "1", title: "Tiêu đề", dataIndex: "congVanTitle", width: 250, ellipsis: true },
                        {
                            key: "2",
                            title: "Nội dung",
                            dataIndex: "congVanContent",
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
                                            setValues({ id: record._id, title: record.congVanTitle, content: record.congVanContent });
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

            {/* Modal Cập nhật Công văn */}
            <Modal
                title="Cập nhật Công văn"
                open={isModalUpdateOpen}
                onOk={handleUpdate}
                onCancel={() => { setIsModalUpdateOpen(false); setValues({ id: "", title: "", content: "" }); }}
            >
                <Input
                    placeholder="Tiêu đề công văn"
                    value={values.title}
                    onChange={(e) => setValues({ ...values, title: e.target.value })}
                    style={{ marginBottom: 10 }}
                />
                <Input.TextArea
                    placeholder="Nội dung công văn"
                    value={values.content}
                    onChange={(e) => setValues({ ...values, content: e.target.value })}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                />
            </Modal>
        </div>
    );
};


