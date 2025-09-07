import React, { useEffect, useRef, useState } from "react";
import "./css/AuthOverlay.css";

function AuthOverlay({ open, onClose, defaultMode = "login" }) {
const modalRef = useRef(null);
const [mode, setMode] = useState(defaultMode);
const [showPw, setShowPw] = useState(false);

useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => {
    window.removeEventListener("keydown", onKey);
    document.body.style.overflow = "";
    };
}, [open, onClose]);

const onBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) onClose?.();
};

if (!open) return null;

return (
<div className="auth-overlay is-open" role="dialog" aria-modal="true" aria-label={mode === "login" ? "Đăng nhập" : "Đăng ký"} onMouseDown={onBackdropClick}>
    <div className="auth-modal" ref={modalRef}>
        <button className="auth-close" aria-label="Đóng" onClick={onClose} type="button">&times;</button>
        <div className="auth-tabs" role="tablist">
            <button role="tab" aria-selected={mode === "login"} className={`auth-tab ${mode === "login" ? "is-active" : ""}`} onClick={() => setMode("login")} type="button">Đăng nhập</button>
            <button role="tab" aria-selected={mode === "register"} className={`auth-tab ${mode === "register" ? "is-active" : ""}`} onClick={() => setMode("register")} type="button">Đăng ký</button>
        </div>

        {mode === "login" ? (
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="auth-field"><label>Email</label><input type="email" placeholder="you@gmail.com" required /></div>
                <div className="auth-field">
                <label>Mật khẩu</label>
                <div className="auth-pw">
                    <input type={showPw ? "text" : "password"} placeholder="••••••••" required />
                    <button className="auth-pw-toggle" type="button" onClick={() => setShowPw((s) => !s)}>{showPw ? "Ẩn" : "Hiện"}</button>
                </div>
            </div>
            <div className="auth-actions">
                <button className="auth-submit" type="submit">Đăng nhập</button>
                <button className="auth-link" type="button" onClick={() => setMode("register")}>Chưa có tài khoản? Đăng ký</button>
            </div>
        </form>
        ) : (
        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); }}>
                <div className="auth-field">
                    <label>Email</label><input type="email" placeholder="you@gmail.com" required />
                </div>
                <div className="auth-field">
                    <label>Mật khẩu</label>
                    <div className="auth-pw">
                        <input type={showPw ? "text" : "password"} placeholder="Tối thiểu 8 ký tự" required minLength={8} />
                        <button className="auth-pw-toggle" type="button" onClick={() => setShowPw((s) => !s)}>{showPw ? "Ẩn" : "Hiện"}</button>
                    </div>
                </div>
                <div className="auth-actions">
                <button className="auth-submit" type="submit">Tạo tài khoản</button>
                <button className="auth-link" type="button" onClick={() => setMode("login")}>Đã có tài khoản? Đăng nhập</button>
            </div>
        </form>
        )}
    </div>
</div>
);
}

export default AuthOverlay;