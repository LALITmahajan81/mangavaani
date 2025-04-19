const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration } = require('../middleware/validateInput');

// POST /api/auth/register - Register a new user
router.post('/register', validateRegistration, authController.register);

module.exports = router; 