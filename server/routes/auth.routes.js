const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

// Auth
router.post("/dangky", authController.dangky);
router.post("/dangnhap", authController.dangnhap);
router.post("/dangxuat", authController.dangxuat);
// Profile
router.get("/thongtin", auth, authController.laythongtin);
router.put("/capnhat", auth, authController.capnhat_hoso);

module.exports = router;
