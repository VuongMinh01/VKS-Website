import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Admin from "./pages/Admin";
import PrivateRoute from "./components/PrivateRoute"; // Import PrivateRoute
import { publicRoute } from "./routes";
import "antd/dist/reset.css"; // Ant Design v5

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Các route công khai */}
        {publicRoute.map((route, index) => {
          const Page = route.component;
          return <Route key={index} path={route.path} element={<Page />} />;
        })}

        {/* Route admin - chỉ dành cho admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
