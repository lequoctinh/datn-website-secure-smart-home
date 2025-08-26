const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * - Tạo record trong `nguoidung` (email, matkhau_hash)
 * - Tạo record trong `hoso_nguoidung` (nguoidung_id, ho_ten)
 */
exports.register = async (req, res) => {
const { name, email, password } = req.body || {};

try {
    // Validate cơ bản
    if (!email || !password) {
    return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
    }
    if (password.length < 8) {
    return res.status(400).json({ error: "Mật khẩu tối thiểu 8 ký tự" });
    }

    // Email đã tồn tại?
    const [dup] = await pool.query(
    "SELECT id FROM nguoidung WHERE email = ? LIMIT 1",
    [email]
    );
    if (dup.length > 0) {
    return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const hash = await bcrypt.hash(password, 10);

    // Transaction: tạo nguoidung -> tạo hoso_nguoidung
    const conn = await pool.getConnection();
    try {
    await conn.beginTransaction();

    // 1) bảng `nguoidung`
    const [r1] = await conn.query(
        "INSERT INTO nguoidung (email, matkhau_hash) VALUES (?, ?)",
        [email, hash]
    );
    const userId = r1.insertId;

    // 2) bảng `hoso_nguoidung`
    await conn.query(
        "INSERT INTO hoso_nguoidung (nguoidung_id, ho_ten) VALUES (?, ?)",
        [userId, name || null]
    );

    await conn.commit();
    conn.release();

    return res.status(201).json({
        message: "Đăng ký thành công",
        userId,
    });
    } catch (txErr) {
    await conn.rollback();
    conn.release();
    console.error("REGISTER TX ERR:", txErr);
    return res.status(500).json({ error: "Lỗi server" });
    }
} catch (err) {
    console.error("REGISTER ERR:", err);
    return res.status(500).json({ error: "Lỗi server" });
}
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * - Kiểm tra `nguoidung` (email, matkhau_hash, vaitro, trang_thai)
 * - Trả JWT + thông tin cơ bản (có `ho_ten` từ `hoso_nguoidung`)
 */
exports.login = async (req, res) => {
const { email, password } = req.body || {};

try {
    if (!email || !password) {
    return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
    }

    const [rows] = await pool.query(
    "SELECT id, email, vaitro, trang_thai, matkhau_hash FROM nguoidung WHERE email = ? LIMIT 1",
    [email]
    );
    if (rows.length === 0) {
    return res.status(400).json({ error: "Sai email hoặc mật khẩu" });
    }

    const user = rows[0];

    if (user.trang_thai === 0) {
    return res.status(403).json({ error: "Tài khoản đã bị khoá" });
    }

    const ok = await bcrypt.compare(password, user.matkhau_hash);
    if (!ok) {
    return res.status(400).json({ error: "Sai email hoặc mật khẩu" });
    }

    // Lấy họ tên từ `hoso_nguoidung`
    const [profileRows] = await pool.query(
    "SELECT ho_ten FROM hoso_nguoidung WHERE nguoidung_id = ? LIMIT 1",
    [user.id]
    );
    const ho_ten = profileRows.length ? profileRows[0].ho_ten : null;

    // Tạo JWT
    const token = jwt.sign(
    { id: user.id, role: user.vaitro },
    JWT_SECRET,
    { expiresIn: "7d" }
    );

    return res.json({
    message: "Đăng nhập thành công",
    token,
    user: {
        id: user.id,
        email: user.email,
        role: user.vaitro,
        ho_ten,
    },
    });
} catch (err) {
    console.error("LOGIN ERR:", err);
    return res.status(500).json({ error: "Lỗi server" });
}
};

/**
 * GET /api/auth/me
 * - Cần middleware auth để set req.user { id, role } từ JWT
 * - Trả thông tin account + profile (đúng tên cột)
 */
exports.me = async (req, res) => {
try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Chưa đăng nhập" });
        const [accRows] = await pool.query(
        "SELECT id, email, vaitro, trang_thai, ngay_tao, ngay_capnhat FROM nguoidung WHERE id = ? LIMIT 1",
        [userId]
    );
    if (accRows.length === 0) {
    return res.status(404).json({ error: "Không tìm thấy user" });
    }
    const [pfRows] = await pool.query(
    "SELECT ho_ten, sdt, ngay_sinh, gioi_tinh, avatar_url, ghi_chu, ngay_tao, ngay_capnhat FROM hoso_nguoidung WHERE nguoidung_id = ? LIMIT 1",
    [userId]
    );

    return res.json({
    account: accRows[0],
    profile: pfRows.length ? pfRows[0] : null,
    });
} catch (err) {
    console.error("ME ERR:", err);
    return res.status(500).json({ error: "Lỗi server" });
}
};
