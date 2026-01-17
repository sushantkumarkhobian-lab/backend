const express = require("express");
const router = express.Router();
const { register, verifyEmail, login } = require("../controllers/authController");

// Auth routes
router.post("/register", register);
router.get("/verify", verifyEmail);
router.post("/login", login);

module.exports = router;
