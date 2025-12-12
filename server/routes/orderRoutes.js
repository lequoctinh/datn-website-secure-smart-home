const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ✅ Đảm bảo đường dẫn đúng thư mục 'middlewares' và file 'authMiddleware'
const { protect } = require("../middlewares/authMiddleware"); 

// --- DEBUG: Bỏ comment dòng dưới để kiểm tra nếu server vẫn lỗi ---
// console.log("Check protect function:", protect); 

// Routes
router.post("/create", orderController.createOrder); // Tạo đơn (thường không cần protect nếu user chưa login vẫn mua đc, tùy logic)
router.get("/my-orders", protect, orderController.getMyOrders); // Lấy đơn của tôi (CẦN protect)
router.get("/user/:userId", protect, orderController.getOrdersByUser);
router.get("/:id", protect, orderController.getOrderById);

// Admin routes
router.get("/admin/orders", protect, orderController.getAllOrders);
router.put("/:id/status", protect, orderController.updateOrderStatus);

router.delete('/:id', orderController.deleteOrder); // Xóa đơn hàng
module.exports = router;