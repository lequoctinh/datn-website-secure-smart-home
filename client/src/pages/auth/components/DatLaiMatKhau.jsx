import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { toast } from "react-toastify";

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
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      toast.success(res.data.message);
      setTimeout(() => navigate("/dang-nhap"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Đặt lại mật khẩu</h2>

      <form onSubmit={submit} className="auth-form">
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
        </button>
      </form>
    </div>
  );
}

export default DatLaiMatKhau;
