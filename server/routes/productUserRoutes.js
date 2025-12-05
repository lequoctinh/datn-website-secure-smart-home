const express = require("express");
const router = express.Router();
const productCtrl = require("../controllers/productController");

// PUBLIC ROUTES — không yêu cầu đăng nhập
router.get("/top-selling", productCtrl.getTopSellingProducts);
router.get("/slug/:slug", productCtrl.getProductBySlug);
router.get("/slug/:slug/related", productCtrl.getRelatedProducts);

module.exports = router;
