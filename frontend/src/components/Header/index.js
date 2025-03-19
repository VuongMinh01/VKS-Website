import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import VKSLogo from "../../assets/VKS.png";

export default function Header() {
    return (
        <Container
            fluid
            style={{
                backgroundColor: "#b22222", // Màu nền đỏ
                height: "150px", // Chiều cao hợp lý
                display: "flex",
                alignItems: "center",
                borderBottom: "4px solid #8B0000", // Viền dưới
                padding: "10px 20px"
            }}
        >
            <Row className="w-100 align-items-center">
                {/* Cột logo */}
                <Col xs={3} sm={2} className="d-flex justify-content-center">
                    <img
                        src={VKSLogo}
                        alt="VKS Logo"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </Col>

                {/* Cột tiêu đề */}
                <Col xs={9} sm={10} className="text-center">
                    <h1
                        className="text-wrap text-break"
                        style={{
                            color: "white",
                            fontSize: "clamp(16px, 4vw, 24px)", // Responsive font-size
                            fontWeight: "bold",
                            margin: 0,
                            textTransform: "uppercase",
                        }}
                    >
                        VIỆN KIỂM SÁT NHÂN DÂN HUYỆN HÓC MÔN
                    </h1>
                </Col>
            </Row>
        </Container>
    );
}
