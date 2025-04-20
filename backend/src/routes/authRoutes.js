const express = require("express");
const router = express.Router();
const { register, login, getProfile } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

/**
 * @route   GET /api/auth/test
 * @desc    Test auth route
 * @access  Public
 */
router.get("/test", (req, res) => {
    res.json({ message: "Auth route is working" });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user (mock implementation)
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /api/auth/register
 * @desc    Register user (mock implementation)
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get("/profile", protect, getProfile);

module.exports = router;
