import React, { useState } from "react";
import { api } from "../../../lib/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function QuenMatKhau() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Quên mật khẩu</h2>

      <form onSubmit={submit} className="auth-form">
        <input
          type="email"
          placeholder="Nhập email đăng ký"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button disabled={loading} >
          {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
        </button>
      </form>

      <div className="auth-links">
        <Link to="/dang-nhap">← Quay lại đăng nhập</Link>
      </div>
    </div>
  );
}

export default QuenMatKhau;
