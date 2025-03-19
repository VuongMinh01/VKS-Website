import React from "react";
import { Layout, Row, Col } from "antd";
import { FacebookOutlined, YoutubeOutlined, HomeOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Footer } = Layout;

export default function FooterVKS() {
    return (
        <Footer style={{ backgroundColor: "#f0f2f5", padding: "20px 50px", textAlign: "center" }}>
            <Row justify="space-between" gutter={[16, 16]}>
                <Col xs={24} md={8}>
                    <h3>Viện Kiểm Sát Hóc Môn</h3>
                    <p>Địa chỉ: Hóc Môn, TP. Hồ Chí Minh</p>
                    <p><MailOutlined /> Email: vks.hocmon@vgov.vn</p>
                    <p><PhoneOutlined /> Điện thoại: </p>
                </Col>
                <Col xs={24} md={8}>
                    <h3>Liên kết nhanh</h3>
                    <p><Link to="/">Trang chủ</Link></p>
                    <p><Link to="/documents">Công văn</Link></p>
                    <p><Link to="/services">Dịch vụ</Link></p>
                    <p><Link to="/contact">Liên hệ</Link></p>
                </Col>
                <Col xs={24} md={8}>
                    <h3>Kết nối với chúng tôi</h3>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px" }}>
                        <FacebookOutlined style={{ fontSize: "24px" }} />
                    </a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                        <YoutubeOutlined style={{ fontSize: "24px" }} />
                    </a>
                </Col>
            </Row>
            <div style={{ marginTop: "20px" }}>
                © {new Date().getFullYear()} Viện Kiểm Sát Hóc Môn. All rights reserved.
            </div>
        </Footer>
    );
}
