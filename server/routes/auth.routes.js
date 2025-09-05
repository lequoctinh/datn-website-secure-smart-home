const express = require("express");
const router = express.Router();
const { register, login, logout, me, updateProfile, changePassword } = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", requireAuth, me);
router.put("/profile", requireAuth, updateProfile);
router.put("/password", requireAuth, changePassword);

module.exports = router;
