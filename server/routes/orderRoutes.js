const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// =========================
// ADMIN ROUTES
// =========================

// Lấy tất cả đơn hàng
router.get("/admin/orders", orderController.getAllOrders);

// Lấy chi tiết đơn hàng cho admin
router.get("/admin/orders/:id", orderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/admin/orders/:id/status", orderController.updateOrderStatus);

// =========================
// USER ROUTES
// =========================

// Tạo đơn hàng
router.post("/create", orderController.createOrder);

// Lấy lịch sử đơn hàng của user
router.get("/user/:userId", orderController.getOrdersByUser);

// Lấy chi tiết đơn hàng
router.get("/:id", orderController.getOrderById);

module.exports = router;
