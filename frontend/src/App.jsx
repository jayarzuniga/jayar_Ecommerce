import { useEffect, useState } from "react";

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
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugin/Context";
import CardId from "./views/plugin/CardId";
import UserData from "./views/plugin/UserData";
import apiInstance from "./utils/axios";

function App() {
  const [count, setCount] = useState(0);
  const [cartCount, setCartCount] = useState();

  const cart_id = CardId();
  const userData = UserData();

  useEffect(() => {
    const url = userData ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`
    apiInstance.get(url).then((res) => {
      setCartCount(res.data.length)
    })
  })

  return (
    <CartContext.Provider value={[cartCount,setCartCount]}>

    <BrowserRouter>
      <StoreHeader />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreatePassword />} />

        {/*Store Components */}
        <Route path="/" element={<Products />} />
        <Route path="/product-detail/:slug/" element={<ProductDetail />} />
        <Route path="/cart/" element={<Cart />} />
        <Route path="/checkout/:order_oid" element={<Checkout />} />
        <Route path="/payment-success/:order_oid/" element={<PaymentSuccess />} />
        <Route path="/search/" element={<Search />} />



      </Routes>
      <StoreFooter />
    </BrowserRouter>

    </CartContext.Provider>
  );
}

export default App;
