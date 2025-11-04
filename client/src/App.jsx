import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

const AdminLayout = lazy(() => import("./admin/adminlayout/AdminLayout"));
const RequireAdmin = lazy(() => import("./admin/components/RequireAdmin"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminUsers = lazy(() => import("./admin/pages/users/UsersList"));
const AdminProducts = lazy(() => import("./admin/pages/products/ProductsList"));
const AdminProductForm = lazy(() => import("./admin/pages/products/ProductForm"));
const AdminBrands = lazy(() => import("./admin/pages/brands/BrandsList"));
const AdminBrandForm = lazy(() => import("./admin/pages/brands/BrandForm"));
function App() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/");

  return (
    <>
      <Suspense fallback={<div className="p-6">Đang tải admin…</div>}>
        <Routes>
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id" element={<AdminProductForm />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/new" element={<AdminBrandForm />} />
            <Route path="brands/:id" element={<AdminBrandForm />} />
          </Route>
        </Routes>
      </Suspense>

      {!isAdminRoute && (
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
      )}
    </>
  );
}

export default App;
