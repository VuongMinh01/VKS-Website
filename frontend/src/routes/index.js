import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/Admin";

const publicRoute = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
];

export { publicRoute };
