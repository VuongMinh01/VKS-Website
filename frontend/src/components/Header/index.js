import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import VKSLogo from "../../assets/VKS.png";

export default function Header() {
    return (
        <Container
            fluid
            style={{
                backgroundColor: "#b22222", // Nền đỏ đậm
                backgroundImage: `url(${VKSLogo})`,
                backgroundSize: "contain", // Hiển thị logo rõ nét
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left center", // Căn trái cho logo
                height: "150px", // Điều chỉnh chiều cao hợp lý
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "24px",
                borderBottom: "4px solid #8B0000" // Viền dưới đậm hơn
            }}
        >
            <Row className="w-100">
                <Col xs={12} className="text-center">
                    <h1 style={{ color: 'blue' }}>VIỆN KIỂM SÁT NHÂN DÂN HUYỆN HÓC MÔN</h1>
                </Col>
            </Row>
        </Container>
    );
}
