import React, { } from "react";
import PageContent from "../../components/AdminComponents/PageContent";
import SideMenu from "../../components/AdminComponents/SideMenu";
import { Container, Row, Col } from "react-bootstrap";
import "../../css/Admin.css"
export default function Admin() {

    return (

        <Container fluid >
            <Row>
                <Col xs={12} sm={3} md={2} className="side-menu-col">
                    <SideMenu />
                </Col>
                <Col xs={12} sm={9} md={10} className="content-col">
                    <PageContent />
                </Col>
            </Row>


        </Container>
    )
}