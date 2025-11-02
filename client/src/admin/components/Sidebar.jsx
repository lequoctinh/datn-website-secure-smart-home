import React from "react";
import { NavLink } from "react-router-dom";

const itemCls = ({ isActive }) =>
[
    "group flex items-center gap-3 px-4 py-2 rounded-xl transition-colors",
    "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
    isActive && "bg-orange-100 text-orange-800 border-l-4 border-orange-600",
]
    .filter(Boolean)
    .join(" ");

function IconProducts() {
return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 7l-8-4-8 4 8 4 8-4z" />
    <path d="M4 7v10l8 4 8-4V7" />
    </svg>
);
}
function IconDashboard() {
return (
    <svg viewBox="0 0 24 24" className="w-5 h-5"
    fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 13h8V3H3v10Z" />
    <path d="M13 21h8V3h-8v18Z" />
    </svg>
);
}

function IconUsers() {
return (
    <svg viewBox="0 0 24 24" className="w-5 h-5"
    fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
}

function Sidebar({ open, onToggle }) {
return (
    <aside
    className={[
        "bg-white/95 backdrop-blur border-r shadow-sm z-30",
        "fixed inset-y-0 left-0 lg:sticky lg:top-0",
        "transition-all duration-200",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        open ? "w-72" : "w-20",
        "flex flex-col  h-screen",
    ].join(" ")}
    >
    <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 grid place-items-center text-white font-bold shadow">
            N
        </div>
        {open && (
            <div className="leading-tight">
            <div className="font-extrabold text-slate-800">Nexa Admin</div>
            <div className="text-xs text-slate-500">Quản trị hệ thống</div>
            </div>
        )}
        </div>

        <button
        onClick={onToggle}
        className="rounded-lg px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        aria-label="Thu gọn / Mở rộng"
        title={open ? "Thu gọn" : "Mở rộng"}
        >
        {open ? "«" : "»"}
        </button>
    </div>

    <nav className="px-3 space-y-1">
        <NavLink to="/admin" end className={itemCls}>
        <IconDashboard />
        {open && <span>Tổng quan</span>}
        </NavLink>

        <NavLink to="/admin/users" className={itemCls}>
        <IconUsers />
        {open && <span>Người dùng</span>}
        </NavLink>
        <NavLink to="/admin/products" className={itemCls}>
            <IconProducts />
            {open && <span>Sản phẩm</span>}
        </NavLink>
    </nav>

    <div className="mt-auto p-3">
        <div className="rounded-xl bg-orange-50 border border-orange-100 p-3 text-xs text-orange-800">
        {open ? (
            <>
            <div className="font-semibold mb-0.5">Mẹo</div>
            Nhấn “«” để thu gọn sidebar
            </>
        ) : (
            <span className="block text-center">Mẹo</span>
        )}
        </div>
    </div>
    </aside>
);
}
export default Sidebar;