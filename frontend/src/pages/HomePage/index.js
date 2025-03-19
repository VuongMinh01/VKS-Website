import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, Button, Row, Col } from "antd";
import axios from "axios";

const API_URL = "https://vks-website.onrender.com/api/congvan/all";

export default function HomePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]);
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
