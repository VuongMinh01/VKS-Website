import React from "react";
import { Layout } from "antd";
import Header from "../../components/Header";
import HomePage from "../HomePage";
import Footer from "../../components/Footer";

const { Content } = Layout;

export default function Home() {
    return (
        <Layout>
            <Header />
            <Content style={{ minHeight: "80vh", padding: "20px" }}>
                <HomePage />
            </Content>
            <Footer />
        </Layout>
    );
}
