import React, { useState } from "react";
import { Menu, message, Avatar, Card } from "antd";
import { HomeOutlined, LogoutOutlined, DatabaseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function SideMenu() {
    const { Meta } = Card;
    const navigate = useNavigate();

    // Lấy thông tin người dùng từ localStorage
    const userData = JSON.parse(localStorage.getItem("user"));

    // Kiểm tra nếu userData không tồn tại
    if (!userData) {
        navigate("/login");
        return null;
    }

    const handleMenuClick = (item) => {
        if (item.key === "/signout") {
            const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
            if (confirmLogout) {
                localStorage.clear();
                message.success("Đăng xuất thành công!"); // Hiển thị thông báo
                setTimeout(() => navigate("/login"), 1000); // Điều hướng sau 1 giây
            }
        } else {
            navigate(item.key);
        }
    };

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
                style={{ minWidth: 200 }} // Đảm bảo menu không bị quá hẹp
                onClick={handleMenuClick}
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
                        label: "Kho hàng",
                        icon: <DatabaseOutlined />,
                        key: "/admin/khohang",
                    },
                    {
                        label: "Danh sách phiếu kho hàng",
                        icon: <DatabaseOutlined />,
                        key: "/admin/phieukhohang",
                    },
                    {
                        label: "Đăng xuất",
                        key: "/signout",
                        icon: <LogoutOutlined />,
                    },
                ]}
            />
        </div>
    );
}
