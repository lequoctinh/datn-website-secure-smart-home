import React, { useState } from "react";
import { api } from "../../../lib/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // const submit = async (e) => {
  //   e.preventDefault();
  //   if (!email) {
  //     toast.error("Vui lòng nhập email");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     const res = await api.post("/auth/forgot-password", { email });
  //     toast.success(res.data.message);
  //     setEmail("");
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || "Có lỗi xảy ra");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const submit = async (e) => {
  e.preventDefault();

  if (!email) {
    toast.error("Vui lòng nhập email");
    return;
  }

  try {
    setLoading(true);

    const res = await api("/auth/forgot-password", {
      method: "POST",
      body: { email },
      withCred: false   // RẤT QUAN TRỌNG
    });

    toast.success(res.message);
    setEmail("");

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
              Quên mật khẩu
            </h2>
            <p className="form-subtitle mt-1">
              Nhập email đã đăng ký để nhận link đặt lại mật khẩu
            </p>
          </header>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input w-full"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </form>

          <div className="nh-auth-foot mt-4">
            <Link to="/dang-nhap" className="nh-link">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);


}

export default QuenMatKhau;
