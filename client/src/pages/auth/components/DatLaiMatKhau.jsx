import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function DatLaiMatKhau() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);


const submit = async (e) => {
  e.preventDefault();

  if (!token) {
    toast.error("Token không hợp lệ");
    return;
  }

  if (password.length < 6) {
    toast.error("Mật khẩu tối thiểu 6 ký tự");
    return;
  }

  if (password !== confirm) {
    toast.error("Mật khẩu nhập lại không khớp");
    return;
  }

  try {
    setLoading(true);

    const res = await api("/auth/reset-password", {
      method: "POST",
      body: {
        token,
        newPassword: password
      },
      withCred: false   // BẮT BUỘC
    });

    toast.success(res.message);
    setTimeout(() => navigate("/dang-nhap"), 1500);

  } catch (err) {
    toast.error(err.message || "Có lỗi xảy ra");
  } finally {
    setLoading(false);
  }
};


  return (
  <div className="auth-page">
    <div className="container-auth mx-auto p-6 md:p-8">
      <div className="nh-auth-shell">
        <div className="nh-card max-w-md mx-auto">
          <header className="form-head mb-6">
            <h2 className="text-2xl md:text-3xl form-title">
              Đặt lại mật khẩu
            </h2>
            <p className="form-subtitle mt-1">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </header>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-input w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Nhập lại mật khẩu</label>
              <input
                type="password"
                className="form-input w-full"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="nh-auth-foot mt-4">
            <Link to="/auth-page" className="nh-link">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}

export default DatLaiMatKhau;
