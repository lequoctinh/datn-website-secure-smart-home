const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

router.post("/register", authController.register);
router.get("/verify-email", authController.verifyEmail);
router.post("/login", authController.login);


router.post("/google", authController.googleLogin);

router.get("/me", auth, authController.me);
router.post("/logout", auth, authController.logout);

module.exports = router;
