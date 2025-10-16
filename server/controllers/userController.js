const bcrypt = require("bcryptjs");
const pool = require("../config/db");
function isValidVNPhone(s) {
    return /^0\d{9,10}$/.test(String(s || "").trim());
}
function isValidGender(g) {
    if (g == null || g === "") return true; 
    const v = String(g).toLowerCase();
    return ["nam", "nu", "khac"].includes(v);
}
function normalizeGender(g) {
    if (!g && g !== "") return null;
    const v = String(g).trim().toLowerCase();
    return v ? v : null;
}
function isValidDateYYYYMMDD(d) {
    if (!d) return true;
    const s = String(d).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    const dt = new Date(s + "T00:00:00Z");
    if (Number.isNaN(dt.getTime())) return false;
    const today = new Date(); today.setHours(0,0,0,0);
    return dt.getTime() <= today.getTime();
}
function normalizeDate(d) {
    if (!d) return null;
    return String(d).trim() || null; 
}

// GET /users/me
exports.me = async (req, res) => {
try {
    if (!req.user) return res.status(401).json({ ok: false, message: "Chưa đăng nhập" });

    const [rows] = await pool.query(
    `SELECT id, ho_ten, email, sdt,
            gioi_tinh, ngay_sinh,
            avatar_url, google_avatar_url,
            vai_tro, trang_thai, email_da_xac_minh
    FROM nguoi_dung
    WHERE id=? LIMIT 1`,
    [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, message: "Không tìm thấy người dùng" });

    return res.json({ ok: true, data: { user: rows[0] } });
} catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
}
};

// PUT /users/me
exports.updateMe = async (req, res) => {
try {
    if (!req.user) return res.status(401).json({ ok: false, message: "Chưa đăng nhập" });

    let { ho_ten, sdt, gioi_tinh, ngay_sinh } = req.body || {};
    ho_ten = (ho_ten ?? "").toString().trim();
    sdt = (sdt ?? "").toString().trim();
    gioi_tinh = normalizeGender(gioi_tinh);
    ngay_sinh = normalizeDate(ngay_sinh);

    if (sdt && !isValidVNPhone(sdt)) {
    return res.status(400).json({ ok: false, message: "Số điện thoại không hợp lệ" });
    }
    if (!isValidGender(gioi_tinh)) {
    return res.status(400).json({ ok: false, message: "Giới tính không hợp lệ (nam|nu|khac)" });
    }
    if (!isValidDateYYYYMMDD(ngay_sinh)) {
    return res.status(400).json({ ok: false, message: "Ngày sinh không hợp lệ (YYYY-MM-DD, không vượt quá hôm nay)" });
    }

    await pool.query(
    `UPDATE nguoi_dung
    SET ho_ten=?, sdt=?, gioi_tinh=?, ngay_sinh=?
    WHERE id=?`,
    [ho_ten || null, sdt || null, gioi_tinh, ngay_sinh, req.user.id]
    );

    return res.json({ ok: true, message: "Đã cập nhật hồ sơ" });
} catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
}
};

// PUT /users/me/password
exports.changePassword = async (req, res) => {
try {
    if (!req.user) return res.status(401).json({ ok: false, message: "Chưa đăng nhập" });

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword)
    return res.status(400).json({ ok: false, message: "Thiếu thông tin" });
    if (String(newPassword).length < 6)
    return res.status(400).json({ ok: false, message: "Mật khẩu mới tối thiểu 6 ký tự" });

    const [rows] = await pool.query(
    "SELECT mat_khau_hash FROM nguoi_dung WHERE id=? LIMIT 1",
    [req.user.id]
    );
    if (!rows.length)
    return res.status(404).json({ ok: false, message: "Không tìm thấy người dùng" });

    const existingHash = rows[0].mat_khau_hash || "";
    if (!existingHash) {
    return res.status(400).json({
        ok: false,
        message: "Tài khoản Google-only chưa có mật khẩu. Vui lòng dùng chức năng 'Đặt mật khẩu lần đầu'."
    });
    }

    const ok = await bcrypt.compare(currentPassword, existingHash);
    if (!ok) return res.status(400).json({ ok: false, message: "Mật khẩu hiện tại không đúng" });

    const hash = await bcrypt.hash(String(newPassword), 10);
    await pool.query("UPDATE nguoi_dung SET mat_khau_hash=? WHERE id=?", [hash, req.user.id]);

    return res.json({ ok: true, message: "Đổi mật khẩu thành công" });
} catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
}
};
