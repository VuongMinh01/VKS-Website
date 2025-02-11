import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import { publicRoute } from "./routes";
function App() {
  return (
    <div>
      <BrowserRouter>

        <Routes>



          {publicRoute.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />


          })}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
