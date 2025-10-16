const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require ("../config/db");
const { sendVerifyEmail } = require("../utils/mailer");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES = "7d";

function signToken(payload) {
return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

//ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
        return res.status(400).json({ ok: false, message: "Thiếu dữ liệu" });
        }
        if (password.length < 6) {
        return res.status(400).json({ ok: false, message: "Mật khẩu tối thiểu 6 ký tự" });
        }
        const [dup] = await pool.query(
        "SELECT id FROM nguoi_dung WHERE email=? LIMIT 1",
        [email]
        );
        if (dup.length) return res.status(409).json({ ok: false, message: "Email đã tồn tại" });

        const hash = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
        `INSERT INTO nguoi_dung (vai_tro, ho_ten, email, mat_khau_hash, trang_thai, email_da_xac_minh)
        VALUES ('customer', ?, ?, ?, 'pending', 0)`,
        [fullName, email, hash]
        );

        const userId = result.insertId;
        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await pool.query(
        "INSERT INTO email_xac_minh (nguoi_dung_id, token, het_han_luc) VALUES (?, ?, ?)",
        [userId, token, expires]
        );

        const verifyUrl = `${process.env.API_BASE_URL || "http://localhost:5000"}/auth/verify-email?token=${token}`;
        await sendVerifyEmail(email, verifyUrl);

        return res.status(201).json({
        ok: true,
        message: "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Lỗi máy chủ" });
    }
};

// XÁC MINH EMAIL
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) return res.status(400).send("Thiếu token");
        const [rows] = await pool.query(
        `SELECT ev.id, ev.nguoi_dung_id, ev.het_han_luc, ev.xac_minh_luc
        FROM email_xac_minh ev WHERE ev.token=? LIMIT 1`, [token]
        );
        if (!rows.length) return res.status(400).send("Token không hợp lệ");

        const rec = rows[0];
        if (rec.xac_minh_luc) return res.status(400).send("Token đã được sử dụng");
        if (new Date(rec.het_han_luc).getTime() < Date.now()) return res.status(400).send("Token đã hết hạn");

        await pool.query(
        "UPDATE nguoi_dung SET email_da_xac_minh=1, trang_thai='active' WHERE id=?",
        [rec.nguoi_dung_id]
        );
        await pool.query("UPDATE email_xac_minh SET xac_minh_luc=NOW() WHERE id=?", [rec.id]);

        const tokenJwt = signToken({ id: rec.nguoi_dung_id });
        res.cookie("token", tokenJwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const redirectTo = `${process.env.WEB_BASE_URL || "http://localhost:5173"}/dang-nhap?verified=1`;
        return res.redirect(302, redirectTo);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Lỗi máy chủ");
    }
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
try {
    const { email, password } = req.body;
    const [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE email=? LIMIT 1", [email]);
    if (!rows.length) return res.status(400).json({ ok: false, message: "Sai email hoặc mật khẩu" });

    const user = rows[0];

    if (!user.email_da_xac_minh || user.trang_thai !== "active") {
    return res.status(403).json({ ok: false, message: "Tài khoản chưa xác minh email" });
    }

    if (!user.mat_khau_hash) {
    return res.status(400).json({ ok: false, message: "Tài khoản này không có mật khẩu (Google-only)" });
    }

    const ok = await bcrypt.compare(password, user.mat_khau_hash);
    if (!ok) return res.status(400).json({ ok: false, message: "Sai email hoặc mật khẩu" });

    await pool.query("UPDATE nguoi_dung SET lan_dang_nhap_cuoi=NOW() WHERE id=?", [user.id]);

    const token = signToken({ id: user.id, email: user.email });
    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, message: "Đăng nhập thành công", data: { token, user: { id: user.id, email: user.email, ho_ten: user.ho_ten } } });
} catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: err.message });
}
};

//ME / LOGOUT 
exports.me = async (req, res) => {
if (!req.user) return res.status(401).json({ ok: false, message: "Chưa đăng nhập" });
const [rows] = await pool.query(
    "SELECT id, ho_ten, email, vai_tro, trang_thai, email_da_xac_minh, google_avatar_url FROM nguoi_dung WHERE id=? LIMIT 1",
    [req.user.id]
);
if (!rows.length) return res.status(404).json({ ok: false, message: "Không tìm thấy người dùng" });
return res.json({ ok: true, data: { user: rows[0] } });
};

exports.logout = async (_req, res) => {
res.clearCookie("token");
return res.json({ ok: true, message: "Đã đăng xuất" });
};

// GOOGLE LOGIN 
exports.googleLogin = async (req, res) => {
try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const email = payload.email;
    const sub = payload.sub;
    const name = payload.name || "";
    const picture = payload.picture || "";

    let [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE google_sub=? LIMIT 1", [sub]);
    let user;
    if (rows.length) {
    user = rows[0];
    } else {
    [rows] = await pool.query("SELECT * FROM nguoi_dung WHERE email=? LIMIT 1", [email]);
    if (rows.length) {
        user = rows[0];
        await pool.query(
        "UPDATE nguoi_dung SET google_sub=?, google_avatar_url=?, email_da_xac_minh=1, trang_thai='active' WHERE id=?",
        [sub, picture, user.id]
        );
    } else {
        const [r] = await pool.query(
        "INSERT INTO nguoi_dung (vai_tro, ho_ten, email, mat_khau_hash, trang_thai, email_da_xac_minh, google_sub, google_avatar_url) VALUES ('customer', ?, ?, NULL, 'active', 1, ?, ?)",
        [name, email, sub, picture]
        );
        user = { id: r.insertId, email, ho_ten: name };
    }
    }

    const token = signToken({ id: user.id, email: user.email });
    res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, message: "Đăng nhập Google thành công", data: { token, user } });
} catch (err) {
    console.error(err);
    res.status(401).json({ ok: false, message: "Xác thực Google thất bại" });
}
};
