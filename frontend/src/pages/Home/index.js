import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Table, Button, Row, Col } from "antd";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [data] = useState([
        { id: 1, title: "React Basics", content: "Learn the basics of React including components, props, and state." },
        { id: 2, title: "Advanced React", content: "Explore advanced concepts like hooks, context API, and performance optimization." },
        { id: 3, title: "JavaScript Tips", content: "Improve your JavaScript skills with best practices and useful tricks." },
        { id: 4, title: "CSS Tricks", content: "Master CSS with flexbox, grid, and responsive design techniques." },
        { id: 5, title: "Node.js Guide", content: "Learn how to build backend applications using Node.js and Express." }
    ]);
    const [expanded, setExpanded] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/login");
        }
    }, [navigate]);

    const toggleContent = (id) => {
        setExpanded(expanded === id ? null : id);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Button type="primary" onClick={() => toggleContent(record.id)}>
                    {expanded === record.id ? "Hide" : "Show"} Content
                </Button>
            ),
        },
    ];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Row justify="space-between" className="mb-4">
                <Col span={12}>
                    <h1 className="text-2xl font-bold">Search Articles</h1>
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
                        placeholder="Search by title or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={false}
                expandable={{
                    expandedRowRender: (record) => <p>{record.content}</p>,
                    expandedRowKeys: expanded ? [expanded] : [],
                    onExpand: (_, record) => toggleContent(record.id),
                }}
            />
        </div>
    );
}
