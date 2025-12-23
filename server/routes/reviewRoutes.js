const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middlewares/auth");

router.get("/my", auth, reviewController.getMyReviews);

router.post("/", auth, reviewController.addReview);
router.get("/:productId", reviewController.getReviews);
router.put("/danh-gia/:id", auth, reviewController.updateReview);



module.exports = router;
