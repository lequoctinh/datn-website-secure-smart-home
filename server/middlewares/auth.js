const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ thongbao: "Ban chua dang nhap" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.nguoidung = decode; // lưu thông tin user vào request
    next();
  } catch (err) {
    return res.status(403).json({ thongbao: "Token khong hop le" });
  }
};
