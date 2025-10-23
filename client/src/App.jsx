import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layouts"; 
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import ProductSmartLock from "./pages/products/ProductSmartLock";
import BrandAll from "./pages/products/BrandAll";
import Contact from "./pages/contact/Contact";
import AuthPage from "./pages/auth/auth";
import NewsSection from "./pages/news/news";
import Taikhoan from "./pages/account/TaiKhoan";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tin-tuc" element={<NewsSection/>} />
        <Route path="/ve-chung-toi" element={<About />} />
        <Route path="/khoa-cua-thong-minh" element={<ProductSmartLock/>} />
        <Route path="/thuong-hieu/:slug" element={<BrandAll />} />
        <Route path="/lien-he" element={<Contact/>} />
      </Routes>
    </Layout>
  );  
}

export default App;
