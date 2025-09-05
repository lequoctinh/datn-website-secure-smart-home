// server/controllers/auth.controller.js
const bcrypt = require("bcryptjs");            // nhẹ, không cần build native
const pool = require("../config/db");
const { signToken, setAuthCookie, clearAuthCookie } = require("../middlewares/auth");

const SALT_ROUNDS = 10;

// Lấy user + hồ sơ 
async function fetchUserWithProfile(userId) {
const [rows] = await pool.query(
    `SELECT u.id, u.email, u.vaitro, u.trang_thai, u.ngay_tao, u.ngay_capnhat,
            h.ho_ten, h.sdt, h.ngay_sinh, h.gioi_tinh, h.avatar_url, h.ghi_chu, h.ngay_capnhat AS hoso_capnhat,
            h.dia_chi_1, h.dia_chi_2, h.phuong_xa, h.quan_huyen, h.tinh_thanh, h.ma_buu_chinh
    FROM nguoidung u
    LEFT JOIN hoso_nguoidung h ON h.nguoidung_id = u.id
    WHERE u.id = ? LIMIT 1`,
    [userId]
);
return rows[0] || null;
}

// POST /api/auth/register 
async function register(req, res) {
const { email, password, ho_ten } = req.body || {};
if (!email || !password) return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });

const [exist] = await pool.query("SELECT id FROM nguoidung WHERE email = ?", [email]);
if (exist.length) return res.status(409).json({ error: "Email đã được sử dụng" });

const hash = await bcrypt.hash(password, SALT_ROUNDS);

const conn = await pool.getConnection();
try {
    await conn.beginTransaction();

    const [ins] = await conn.query(
    "INSERT INTO nguoidung (email, matkhau_hash, vaitro, trang_thai) VALUES (?, ?, 'khachhang', 1)",
    [email, hash]
    );
    const userId = ins.insertId;

    await conn.query(
    "INSERT INTO hoso_nguoidung (nguoidung_id, ho_ten) VALUES (?, ?)",
    [userId, ho_ten || null]
    );

    await conn.commit();

    const token = signToken({ id: userId, role: "khachhang" });
    setAuthCookie(res, token);

    const me = await fetchUserWithProfile(userId);
    return res.status(201).json({ message: "Đăng ký thành công", user: me });
} catch (e) {
    await conn.rollback();
    console.error(e);
    return res.status(500).json({ error: "Lỗi server khi đăng ký" });
} finally {
    conn.release();
}
}

// POST /api/auth/login 
async function login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });

    const [rows] = await pool.query(
        "SELECT id, email, matkhau_hash, vaitro, trang_thai FROM nguoidung WHERE email = ? LIMIT 1",
        [email]
    );
    if (!rows.length) return res.status(401).json({ error: "Sai thông tin đăng nhập" });

    const user = rows[0];
    if (!user.trang_thai) return res.status(403).json({ error: "Tài khoản đang bị khóa" });

    const ok = await bcrypt.compare(password, user.matkhau_hash);
    if (!ok) return res.status(401).json({ error: "Sai thông tin đăng nhập" });

    const token = signToken({ id: user.id, role: user.vaitro });
    setAuthCookie(res, token);

    const me = await fetchUserWithProfile(user.id);
    return res.json({ message: "Đăng nhập thành công", user: me });
}

// POST /api/auth/logout
async function logout(req, res) {
clearAuthCookie(res);
return res.json({ message: "Đã đăng xuất" });
}

// GET /api/auth/me
async function me(req, res) {
const meData = await fetchUserWithProfile(req.user.id);
if (!meData) return res.status(404).json({ error: "Không tìm thấy người dùng" });
return res.json({ user: meData });
}

// PUT /api/auth/profile  
async function updateProfile(req, res) {
const userId = req.user.id;
const {
    ho_ten, sdt, ngay_sinh, gioi_tinh, avatar_url, ghi_chu,
    dia_chi_1, dia_chi_2, phuong_xa, quan_huyen, tinh_thanh, ma_buu_chinh
} = req.body || {};

await pool.query(
    `INSERT INTO hoso_nguoidung
    (nguoidung_id, ho_ten, sdt, ngay_sinh, gioi_tinh, avatar_url, ghi_chu,
    dia_chi_1, dia_chi_2, phuong_xa, quan_huyen, tinh_thanh, ma_buu_chinh)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
    ho_ten=VALUES(ho_ten),
    sdt=VALUES(sdt),
    ngay_sinh=VALUES(ngay_sinh),
    gioi_tinh=VALUES(gioi_tinh),
    avatar_url=VALUES(avatar_url),
    ghi_chu=VALUES(ghi_chu),
    dia_chi_1=VALUES(dia_chi_1),
    dia_chi_2=VALUES(dia_chi_2),
    phuong_xa=VALUES(phuong_xa),
    quan_huyen=VALUES(quan_huyen),
    tinh_thanh=VALUES(tinh_thanh),
    ma_buu_chinh=VALUES(ma_buu_chinh)`,
    [
    userId,
    ho_ten || null, sdt || null, ngay_sinh || null, gioi_tinh || "khong_tiet_lo",
    avatar_url || null, ghi_chu || null,
    dia_chi_1 || null, dia_chi_2 || null, phuong_xa || null,
    quan_huyen || null, tinh_thanh || null, ma_buu_chinh || null
    ]
);

const meData = await fetchUserWithProfile(userId);
return res.json({ message: "Cập nhật hồ sơ thành công", user: meData });
}

// PUT /api/auth/password  
async function changePassword(req, res) {
    const userId = req.user.id;
    const { old_password, new_password } = req.body || {};
    if (!old_password || !new_password) return res.status(400).json({ error: "Thiếu mật khẩu" });

    const [rows] = await pool.query("SELECT matkhau_hash FROM nguoidung WHERE id = ?", [userId]);
    if (!rows.length) return res.status(404).json({ error: "Không tìm thấy người dùng" });

    const ok = await bcrypt.compare(old_password, rows[0].matkhau_hash);
    if (!ok) return res.status(401).json({ error: "Mật khẩu cũ không đúng" });

    const hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    await pool.query("UPDATE nguoidung SET matkhau_hash = ? WHERE id = ?", [hash, userId]);

    return res.json({ message: "Đổi mật khẩu thành công" });
}

module.exports = { register, login, logout, me, updateProfile, changePassword };
