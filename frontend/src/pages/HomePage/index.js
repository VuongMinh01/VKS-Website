import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, Button, Row, Col } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const API_URL = "https://vks-website.onrender.com/api/congvan/all";
const MAX_LENGTH = 100; // Giới hạn ký tự hiển thị ban đầu

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchCongVan(token);
    }, [navigate]);

    const fetchCongVan = async (token) => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách công văn:", error);
            navigate("/login");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const toggleExpand = (record) => {
        setExpandedRowKeys((prev) =>
            prev.includes(record._id)
                ? prev.filter((id) => id !== record._id)
                : [...prev, record._id]
        );
    };

    const filteredData = data.filter((item) =>
        item.congVanTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.congVanContent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            render: (_, __, index) => index + 1,
        },
        {
            title: "Tiêu đề",
            dataIndex: "congVanTitle",
            key: "title",
        },
        {
            title: "Nội dung",
            dataIndex: "congVanContent",
            key: "content",
            render: (_, record) => {
                const isExpanded = expandedRowKeys.includes(record._id);
                const content = isExpanded
                    ? record.congVanContent
                    : record.congVanContent.slice(0, MAX_LENGTH) + (record.congVanContent.length > MAX_LENGTH ? "..." : "");

                return (
                    <div className="relative">
                        <motion.div
                            initial={{ height: "auto" }}
                            animate={{ height: isExpanded ? "auto" : 60 }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <p className="whitespace-pre-wrap">{content}</p>
                        </motion.div>
                        {record.congVanContent.length > MAX_LENGTH && (
                            <Button
                                type="link"
                                onClick={() => toggleExpand(record)}
                                icon={isExpanded ? <MinusOutlined /> : <PlusOutlined />}
                            />
                        )}
                    </div>
                );
            },
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Row justify="space-between" className="mb-4">
                <Col span={12}>
                    <h1 className="text-2xl font-bold">Danh sách Công văn</h1>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                    <Button type="primary" danger onClick={handleLogout}>
                        Đăng xuất
                    </Button>
                </Col>
            </Row>
            <Row justify="center" className="mb-4">
                <Col span={24}>
                    <Input
                        placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
