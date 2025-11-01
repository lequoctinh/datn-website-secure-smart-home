import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import ProductSmartLock from "./pages/products/ProductSmartLock";
import BrandAll from "./pages/products/BrandAll";
import Contact from "./pages/contact/Contact";
import AuthPage from "./pages/auth/auth";
import Taikhoan from "./pages/account/TaiKhoan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartPage from "./pages/cart/CartPage";
import OrderHistoryPage from "./pages/cart/OrderHistoryPage";

function App() {
  return (
    <Layout>
      <ToastContainer
        position="top-center"
        autoClose={2200}
        theme="colored"
        newestOnTop
        pauseOnFocusLoss={false}  
        closeOnClick
        draggable
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ve-chung-toi" element={<About />} />
        <Route path="/khoa-cua-thong-minh" element={<ProductSmartLock />} />
        <Route path="/thuong-hieu/:slug" element={<BrandAll />} />
        <Route path="/lien-he" element={<Contact />} />
        <Route path="/auth-page" element={<AuthPage />} />
        <Route path="/dang-nhap" element={<AuthPage />} />
        <Route path="/dang-ky" element={<AuthPage />} />
        <Route path="/tai-khoan" element={<Taikhoan />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />

      </Routes>
    </Layout>
  );
}

export default App;
