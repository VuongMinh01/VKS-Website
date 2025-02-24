import { Space, Table, Typography, Button, Modal, Input } from "antd";
import React, { useState } from "react";
import { DeleteOutlined, EditOutlined, InfoOutlined } from '@ant-design/icons';
import { ToastContainer, toast } from 'react-toastify';

export default function CongVan() {
    // Các state để quản lý modal và dữ liệu
    const [isModalAddOpen, setIsModalAddOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalQuestionOpen, setIsModalQuestionOpen] = useState(false);
    const [values, setValues] = useState({ id: '', title: '', content: '' });
    const [dataSource, setDataSource] = useState([
        // Dữ liệu mẫu, bạn có thể thay thế bằng dữ liệu thực từ API sau
        { _id: '1', title: 'Công văn 1', content: 'Nội dung công văn 1' },
        { _id: '2', title: 'Công văn 2', content: 'Nội dung công văn 2' },
        { _id: '3', title: 'Công văn 3', content: 'Nội dung công văn 3' },
    ]);

    // Các hàm xử lý modal
    const showModalAdd = () => {
        setIsModalAddOpen(true);
    };

    const handleCancel = () => {
        setIsModalAddOpen(false);
    };

    const handleAddTest = () => {
        // Thêm công văn mới vào bảng (có thể thay thế API sau này)
        const newData = {
            _id: (dataSource.length + 1).toString(),
            title: values.title,
            content: values.content,
        };
        setDataSource([...dataSource, newData]);
        setIsModalAddOpen(false);
        toast.success("Thêm công văn thành công!");
    };

    const showModalUpdate = (record) => {
        setValues({ id: record._id, title: record.title, content: record.content });
        setIsModalUpdateOpen(true);
    };

    const handleUpdateTest = () => {
        // Cập nhật công văn
        const updatedData = dataSource.map(item =>
            item._id === values.id ? { ...item, title: values.title, content: values.content } : item
        );
        setDataSource(updatedData);
        setIsModalUpdateOpen(false);
        toast.success("Cập nhật công văn thành công!");
    };

    const onDeleteTest = (record) => {
        // Xóa công văn khỏi bảng
        const newData = dataSource.filter(item => item._id !== record._id);
        setDataSource(newData);
        toast.success("Xóa công văn thành công!");
    };

    return (
        <div>
            <Space size={20} direction={"vertical"}>
                <Typography.Title level={4}>Danh sách công văn</Typography.Title>

                <Space>
                    <Button
                        style={{ margin: '10px' }}
                        type="primary"
                        onClick={showModalAdd}>
                        Thêm Công văn
                    </Button>
                </Space>

                {/* Bảng hiển thị danh sách công văn */}
                <Table
                    scroll={{ y: 'max-content', x: 'max-content' }}
                    columns={[
                        {
                            key: '1',
                            title: "ID",
                            dataIndex: "_id",
                        },
                        {
                            key: '2',
                            title: "Tiêu đề",
                            dataIndex: "title",
                        },
                        {
                            key: '3',
                            title: "Nội dung",
                            dataIndex: "content",
                        },
                        {
                            key: '4',
                            title: "Actions",
                            render: (record) => (
                                <div>
                                    <DeleteOutlined
                                        onClick={() => {
                                            if (window.confirm("Bạn có chắc muốn xóa công văn này?")) {
                                                onDeleteTest(record);
                                            }
                                        }}
                                        style={{ color: "red", marginLeft: "12px" }}
                                    />
                                    <InfoOutlined
                                        onClick={() => setIsModalQuestionOpen(true)} // Giả sử để mở modal xem chi tiết công văn
                                        style={{ color: "green", marginLeft: "12px" }}
                                    />
                                    <EditOutlined
                                        onClick={() => showModalUpdate(record)}
                                        style={{ color: "green", marginLeft: "15px" }}
                                    />
                                </div>
                            ),
                        },
                    ]}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                    }}
                />

            </Space>

            {/* Modal Thêm Công văn */}
            <Modal
                width={900}
                title="Thêm Công văn"
                open={isModalAddOpen}
                onOk={handleAddTest}
                onCancel={handleCancel}
            >
                <div>
                    <Input
                        style={{ marginBottom: '10px' }}
                        value={values.title}
                        onChange={(e) => setValues({ ...values, title: e.target.value })}
                        placeholder="Tiêu đề công văn"
                    />
                    <Input
                        value={values.content}
                        onChange={(e) => setValues({ ...values, content: e.target.value })}
                        placeholder="Nội dung công văn"
                    />
                </div>
            </Modal>

            {/* Modal Cập nhật Công văn */}
            <Modal
                width={900}
                title="Cập nhật Công văn"
                open={isModalUpdateOpen}
                onOk={handleUpdateTest}
                onCancel={() => setIsModalUpdateOpen(false)}
            >
                <div>
                    <Input
                        style={{ marginBottom: '10px' }}
                        value={values.title}
                        onChange={(e) => setValues({ ...values, title: e.target.value })}
                        placeholder="Tiêu đề công văn"
                    />
                    <Input
                        value={values.content}
                        onChange={(e) => setValues({ ...values, content: e.target.value })}
                        placeholder="Nội dung công văn"
                    />
                </div>
            </Modal>

            {/* Modal Xem chi tiết công văn (tạm thời không sử dụng trong trường hợp này) */}
            <Modal
                width={900}
                title="Thông tin chi tiết công văn"
                open={isModalQuestionOpen}
                onCancel={() => setIsModalQuestionOpen(false)}
                footer={null}
            >
                {/* Nội dung chi tiết công văn */}
                <Typography.Text>Chi tiết công văn</Typography.Text>
            </Modal>

            <ToastContainer />
        </div>
    );
}
