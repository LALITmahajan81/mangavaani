const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware
 * Verifies JWT token and adds user to request object
 */
exports.protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token",
        });
    }
};
