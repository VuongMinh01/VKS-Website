import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";

const privateRoute = [
    { path: '/admin', component: Admin },  // Chỉ cho phép admin truy cập
];

const publicRoute = [
    { path: '/', component: Home },  // Trang công khai (home)
    { path: '/login', component: Login },  // Trang đăng nhập
];

export { privateRoute, publicRoute };
