// server/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra header Authorization có dạng "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      
      // Thay chuỗi bí mật này bằng chuỗi bạn dùng trong authController
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key_tam_thoi");

      req.user = decoded; // Gán user vào request
      next();
    } catch (error) {
      console.error("Token error:", error);
      res.status(401).json({ message: "Token không hợp lệ, vui lòng đăng nhập lại." });
    }
  } else {
    res.status(401).json({ message: "Không tìm thấy Token xác thực." });
  }
};

// QUAN TRỌNG: Phải export dạng object { protect }
module.exports = { protect };