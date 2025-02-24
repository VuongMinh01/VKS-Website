import React, { useEffect, useState } from "react";
import PageContent from "../../components/AdminComponents/PageContent";
import SideMenu from "../../components/AdminComponents/SideMenu";
import { Container, Row, Col } from "react-bootstrap";
export default function Admin() {

    return (

        <Container fluid >
            <Row>
                <Col xs={3} sm={2}>
                    <SideMenu />
                </Col>
                <Col xs={9} sm={10}>
                    <PageContent></PageContent>
                </Col>
            </Row>
        </Container>
    )
}