import React, { useState } from "react";
import { Menu } from "antd";
import { HomeOutlined, LogoutOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Card } from "antd";

export default function SideMenu() {
    const { Meta } = Card;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Kiểm tra nếu userData không tồn tại hoặc không có thông tin role
    if (!userData) {
        // Nếu không có userData, có thể điều hướng đến trang login hoặc một hành động khác
        navigate("/login");
        return null;
    }

    return (
        <div className="SideMenu">
            <Card style={{ width: "100%" }}>
                {userData && (
                    <Meta
                        avatar={<Avatar src={userData.avatar} />}
                        title={userData.name} // Hiển thị tên người dùng
                    />
                )}
            </Card>
            <Menu
                mode="inline"
                onClick={(item) => {
                    if (item.key === "/signout") {
                        localStorage.clear();
                        navigate("/login");
                    } else {
                        navigate(item.key);
                    }
                }}
                items={[
                    {
                        label: "Trang cá nhân",
                        icon: <HomeOutlined />,
                        key: "/admin",
                    },
                    {
                        label: "Dữ liệu công văn",
                        icon: <DatabaseOutlined />,
                        key: "/admin/congvan",
                    },
                    {
                        label: "Tài khoản",
                        icon: <DatabaseOutlined />,
                        key: "/admin/taikhoan",
                    },
                    {
                        label: "Đăng xuất",
                        key: "/signout",
                        icon: <LogoutOutlined />,
                    },
                ]}
            ></Menu>
        </div>
    );
}
