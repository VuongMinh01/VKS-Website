import Home from "../pages/Home";
import Login from "../pages/Login";
const privateRoute = []
const publicRoute = [
    { path: '/', component: Home },
    { path: '/login', component: Login },

]
export { privateRoute, publicRoute }