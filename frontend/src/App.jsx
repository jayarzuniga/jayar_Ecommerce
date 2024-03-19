import { useState } from "react";

import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Dashboard from "./views/auth/Dashboard";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";

import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";

import MainWrapper from "../src/layout/MainWrapper";

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <StoreHeader />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreatePassword />} />
      </Routes>
      <StoreFooter />
    </BrowserRouter>
  );
}

export default App;
