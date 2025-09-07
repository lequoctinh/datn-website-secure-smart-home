const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Đăng ký
// POST http://localhost:5000/api/auth/dangky
exports.dangky = async (req, res) => {
try {
    const { email, matkhau } = req.body;

    const [check] = await pool.query("SELECT * FROM nguoidung WHERE email = ?", [email]);
    if (check.length > 0) {
    return res.status(400).json({ thongbao: "Email da ton tai" });
    }

    const matkhau_hash = await bcrypt.hash(matkhau, 10);

    const [ketqua] = await pool.query(
    "INSERT INTO nguoidung (email, matkhau_hash) VALUES (?, ?)",
    [email, matkhau_hash]
    );

    await pool.query("INSERT INTO hoso_nguoidung (nguoidung_id) VALUES (?)", [ketqua.insertId]);

    res.json({ thongbao: "Dang ky thanh cong" });
} catch (err) {
    console.error(err);
    res.status(500).json({ thongbao: "Loi server" });
}
};

// Đăng nhập
// POST http://localhost:5000/api/auth/dangnhap
exports.dangnhap = async (req, res) => {
try {
    const { email, matkhau } = req.body;

    const [rows] = await pool.query("SELECT * FROM nguoidung WHERE email = ?", [email]);
    if (rows.length === 0) {
    return res.status(400).json({ thongbao: "Sai email hoac mat khau" });
    }

    const nguoidung = rows[0];

    const dungmatkhau = await bcrypt.compare(matkhau, nguoidung.matkhau_hash);
    if (!dungmatkhau) {
    return res.status(400).json({ thongbao: "Sai email hoac mat khau" });
    }

    const token = jwt.sign(
    { id: nguoidung.id, email: nguoidung.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
    );

    res.json({ thongbao: "Dang nhap thanh cong", token });
} catch (err) {
    console.error(err);
    res.status(500).json({ thongbao: "Loi server" });
}
};
// Đăng xuất 
// POST http://localhost:5000/api/auth/dangxuat
exports.dangxuat = async (req, res) => {
  // Chỉ trả về thông báo, client sẽ xóa token (localStorage / sessionStorage).
    return res.json({ thongbao: "Dang xuat thanh cong. Hay xoa token o client" });
};


// Lấy thông tin tài khoản (JOIN 2 bảng)
// GET http://localhost:5000/api/auth/thongtin
exports.laythongtin = async (req, res) => {
try {
    const [rows] = await pool.query(
    `SELECT u.id, u.email, u.vaitro, u.trang_thai,
            h.ho_ten, h.sdt, h.ngay_sinh, h.gioi_tinh,
            h.avatar_url, h.dia_chi_1, h.dia_chi_2,
            h.phuong_xa, h.quan_huyen, h.tinh_thanh,
            h.ma_buu_chinh, h.ghi_chu
    FROM nguoidung u
    LEFT JOIN hoso_nguoidung h ON u.id = h.nguoidung_id
    WHERE u.id = ?`,
    [req.nguoidung.id]
    );

    res.json(rows[0]);
} catch (err) {
    console.error(err);
    res.status(500).json({ thongbao: "Loi server" });
}
};

// Cập nhật hồ sơ
// PUT http://localhost:5000/api/auth/capnhat
exports.capnhat_hoso = async (req, res) => {
try {
    const {
    ho_ten, sdt, ngay_sinh, gioi_tinh,
    avatar_url, dia_chi_1, dia_chi_2,
    phuong_xa, quan_huyen, tinh_thanh,
    ma_buu_chinh, ghi_chu
    } = req.body;

    await pool.query(
    `UPDATE hoso_nguoidung 
    SET ho_ten=?, sdt=?, ngay_sinh=?, gioi_tinh=?, avatar_url=?, 
        dia_chi_1=?, dia_chi_2=?, phuong_xa=?, quan_huyen=?, tinh_thanh=?, 
        ma_buu_chinh=?, ghi_chu=? 
    WHERE nguoidung_id=?`,
    [
        ho_ten, sdt, ngay_sinh, gioi_tinh, avatar_url,
        dia_chi_1, dia_chi_2, phuong_xa, quan_huyen, tinh_thanh,
        ma_buu_chinh, ghi_chu, req.nguoidung.id
    ]
    );

    res.json({ thongbao: "Cap nhat ho so thanh cong" });
} catch (err) {
    console.error(err);
    res.status(500).json({ thongbao: "Loi server" });
}
};
