//routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/userController");


router.get("/me", auth, userCtrl.me);    
router.put("/me", auth, userCtrl.updateMe);
router.put("/me/password", auth, userCtrl.changePassword);

module.exports = router;
