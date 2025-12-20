const express = require("express");
const router = express.Router();

const addressController = require("../controllers/addressController");
const auth = require("../middlewares/auth");

// tất cả routes đều cần đăng nhập
router.get("/addresses", auth, addressController.list);
router.post("/addresses", auth, addressController.create);
router.put("/addresses/:id", auth, addressController.update);
router.delete("/addresses/:id", auth, addressController.remove);
router.patch("/addresses/:id/default", auth, addressController.setDefault);

module.exports = router;
