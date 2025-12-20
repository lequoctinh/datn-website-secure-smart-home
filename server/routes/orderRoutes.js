const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const orderController = require("../controllers/orderController");

// Tạo đơn
router.post("/create", orderController.createOrder);

// Lấy lịch sử của user
router.get("/user/:userId", orderController.getOrdersByUser);

// Routes
router.post("/create", orderController.createOrder); // Tạo đơn (thường không cần protect nếu user chưa login vẫn mua đc, tùy logic)
router.get("/my-orders", protect, orderController.getMyOrders); // Lấy đơn của tôi (CẦN protect)
router.get("/user/:userId", protect, orderController.getOrdersByUser);
router.get("/:id", protect, orderController.getOrderById);
router.post("/checkout", auth, orderController.checkout);

// Lấy chi tiết
router.get("/:id", orderController.getOrderById);

// Cập nhật trạng thái (admin)
router.put("/:id/status", orderController.updateOrderStatus);

// Lấy chi tiết đơn hàng
router.get("/:id",orderController.getOrderById);

// Quan lý đơn hàng (admin)
router.get("/admin/orders", orderController.getAllOrders);
router.get("/admin/orders/:id", orderController.getOrderById);


module.exports = router;