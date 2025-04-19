const express = require("express");
const router = express.Router();

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
router.post("/login", (req, res) => {
    res.json({
        success: true,
        message: "Login successful",
        token: "mock-jwt-token",
        user: {
            id: "user123",
            name: "Test User",
            email: "user@example.com",
        },
    });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register user (mock implementation)
 * @access  Public
 */
router.post("/register", (req, res) => {
    res.json({
        success: true,
        message: "Registration successful",
        user: {
            id: "user123",
            name: req.body.name || "New User",
            email: req.body.email || "new@example.com",
        },
    });
});

module.exports = router;
