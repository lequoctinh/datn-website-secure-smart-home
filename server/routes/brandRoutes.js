// server/routes/brandRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const auth = require("../middlewares/auth");
const { ensureAuth, requireRole } = require("../middlewares/authorize");

router.use(auth, ensureAuth, requireRole("admin", "nhan_vien"));

router.get("/", async (req, res, next) => {
try {
    const [rows] = await pool.query(
    "SELECT id, ten_thuong_hieu FROM thuong_hieu ORDER BY ten_thuong_hieu ASC"
    );
    res.json({ items: rows });
} catch (e) { next(e); }
});

module.exports = router;
