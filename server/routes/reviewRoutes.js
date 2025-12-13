const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middlewares/auth.js");

router.post("/", authMiddleware, reviewController.addReview);
router.get("/:productId", reviewController.getReviews);

module.exports = router;
