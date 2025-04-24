import { Modal, Form, InputNumber, Select, Button, Input, Table } from "antd";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API_URL = "https://vks-website.onrender.com/api/khohang";

export default function KhoHangForm() {
    const [form] = Form.useForm();
    const [sanPhamList, setSanPhamList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [phieuList, setPhieuList] = useState([]);
    const [operationType, setOperationType] = useState('add'); // 'add' cho thêm phiếu nhập, 'export' cho phiếu xuất
    const [modalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal

    useEffect(() => {
        fetchSanPhamList();
        fetchPhieuList();
    }, []);

    // Hàm lấy token từ localStorage
    const getToken = () => {
        return localStorage.getItem('token');
    };

    const fetchSanPhamList = async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get("https://vks-website.onrender.com/api/sanpham/all", {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });
            console.log("Dữ liệu sản phẩm:", response.data);
            setSanPhamList(response.data);
        } catch (err) {
            toast.error("Không thể tải danh sách sản phẩm");
            console.error("Lỗi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPhieuList = async () => {
        try {
            const token = getToken();
            const [phieuNhapRes, phieuXuatRes] = await Promise.all([
                axios.get(`${API_URL}/phieunhap`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào header
                    }
                }),
                axios.get(`${API_URL}/phieuxuat`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Thêm token vào header
                    }
                })
            ]);
            setPhieuList([...phieuNhapRes.data, ...phieuXuatRes.data]);
        } catch (err) {
            toast.error("Không thể tải danh sách phiếu");
            console.error("Lỗi khi tải danh sách phiếu:", err);
        }
    };

    const generateMaPhieu = () => {
        const filteredPhieu = phieuList.filter(phieu =>
            phieu.maPhieu.startsWith(operationType === 'add' ? 'PNK' : 'PXK')
        );

        let maxNumber = 0;
        if (filteredPhieu.length > 0) {
            maxNumber = filteredPhieu.reduce((max, phieu) => {
                const number = parseInt(phieu.maPhieu.slice(3), 10);
                return number > max ? number : max;
            }, 0);
        }

        return operationType === 'add' ? `PNK${String(maxNumber + 1).padStart(3, '0')}` : `PXK${String(maxNumber + 1).padStart(3, '0')}`;
    };

    const handleOpenAdd = (operation) => {
        setOperationType(operation);
        const newMaPhieu = generateMaPhieu(); // Gán mã phiếu tự động khi mở modal
        form.setFieldsValue({ maPhieu: newMaPhieu }); // Set mã phiếu vào form
        setModalVisible(true);
    };

    const handleSubmitNhapKho = async () => {
        try {
            const values = await form.validateFields();
            console.log("Dữ liệu gửi lên:", values); // In log để kiểm tra

            // Kiểm tra số lượng hợp lệ cho phiếu nhập kho
            if (isNaN(values.soLuongNhap) || values.soLuongNhap <= 0) {
                toast.error("Số lượng nhập phải là một số hợp lệ và lớn hơn 0");
                return;
            }

            values.maPhieu = generateMaPhieu(); // Gán mã phiếu tự động
            const token = getToken(); // Lấy token từ localStorage

            // Gửi yêu cầu POST với token trong header
            await axios.post(API_URL + "/phieunhap", values, {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });

            toast.success("Thêm phiếu nhập kho thành công!");
            setModalVisible(false);
            fetchPhieuList();
        } catch (err) {
            if (err.response) {
                console.error("Lỗi khi thêm phiếu nhập kho:", err.response.data);
                toast.error(`Lỗi: ${err.response.data.message || 'Không thể thêm phiếu'}`);
            } else {
                console.error("Lỗi khi thêm phiếu nhập kho:", err);
                toast.error("Không thể kết nối với máy chủ.");
            }
        }
    };

    const handleSubmitXuatKho = async () => {
        try {
            const values = await form.validateFields();
            console.log("Dữ liệu gửi lên:", values); // In log để kiểm tra

            // Kiểm tra số lượng tồn kho cho phiếu xuất kho
            const sanPhamWithQuantity = values.sanPham.map(sanPhamId => ({
                sanPhamId,
                soLuong: values[`soLuong_${sanPhamId}`]  // Giả sử bạn có tên trường `soLuong_sanPhamId` cho từng sản phẩm
            }));

            for (let { sanPhamId, soLuong } of sanPhamWithQuantity) {
                const sanPham = await axios.get(`https://vks-website.onrender.com/api/sanpham/${sanPhamId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                if (sanPham.data.soLuongTon < soLuong) {
                    toast.error(`Sản phẩm ${sanPham.data.tenSanPham} không đủ số lượng để xuất.`);
                    return;
                }
            }

            // Gán mã phiếu tự động
            values.maPhieu = generateMaPhieu();

            // Chuyển đổi danh sách sản phẩm và số lượng
            const sanPhamList = sanPhamWithQuantity.map(item => ({
                sanPham: item.sanPhamId,
                soLuong: item.soLuong
            }));

            // Gửi yêu cầu POST với token trong header
            const token = getToken();
            await axios.post(API_URL + "/phieuxuat", {
                ...values,
                sanPham: sanPhamList  // Gửi danh sách sản phẩm với số lượng
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Thêm token vào header
                }
            });

            toast.success("Thêm phiếu xuất kho thành công!");
            setModalVisible(false);
            fetchPhieuList();
        } catch (err) {
            if (err.response) {
                console.error("Lỗi khi thêm phiếu xuất kho:", err.response.data);
                toast.error(`Lỗi: ${err.response.data.message || 'Không thể thêm phiếu'}`);
            } else {
                console.error("Lỗi khi thêm phiếu xuất kho:", err);
                toast.error("Không thể kết nối với máy chủ.");
            }
        }
    };



    return (
        <div>
            <Button onClick={() => handleOpenAdd('add')}>Thêm Phiếu Nhập Kho</Button>
            <Button onClick={() => handleOpenAdd('export')}>Thêm Phiếu Xuất Kho</Button>
            <Modal
                title={operationType === 'add' ? "Thêm Phiếu Nhập Kho" : "Thêm Phiếu Xuất Kho"}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={operationType === 'add' ? handleSubmitNhapKho : handleSubmitXuatKho}
                okText="Thêm"
                cancelText="Huỷ"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Mã phiếu"
                        name="maPhieu"
                        rules={[{ required: true, message: "Vui lòng nhập mã phiếu!" }]}
                    >
                        <InputNumber style={{ width: "100%" }} disabled />
                    </Form.Item>

                    <Form.Item
                        label="Chọn sản phẩm"
                        name="sanPham"
                        rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
                    >
                        <Select mode="multiple" placeholder="Chọn sản phẩm" loading={loading}>
                            {sanPhamList.length > 0 ? (
                                sanPhamList.map((item) => (
                                    <Select.Option key={item._id} value={item._id}>
                                        {item.tenSanPham}
                                    </Select.Option>
                                ))
                            ) : (
                                <Select.Option value="0">Không có sản phẩm</Select.Option>
                            )}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Số lượng"
                        name="soLuongNhap"
                        rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                    >
                        <InputNumber min={1} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label={operationType === 'add' ? "Người nhập" : "Người xuất"}
                        name="nguoiNhap"
                        rules={[{ required: true, message: "Vui lòng nhập tên người!" }]}
                    >
                        <Input placeholder={`Nhập tên người ${operationType === 'add' ? "nhập" : "xuất"}`} />
                    </Form.Item>

                </Form>
            </Modal>

            <Table
                dataSource={phieuList}
                columns={[
                    { title: "Mã Phiếu", dataIndex: "maPhieu" },
                    { title: "Ngày", dataIndex: "ngayNhap", render: date => new Date(date).toLocaleString() },
                    { title: "Sản phẩm", dataIndex: "sanPham", render: products => products.map(p => p.tenSanPham).join(", ") },
                    { title: "Số Lượng", dataIndex: "soLuongNhap" }
                ]}
            />
        </div>
    );
}
