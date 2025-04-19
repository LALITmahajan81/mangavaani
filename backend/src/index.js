<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

=======
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const mangaRoutes = require("./routes/mangaRoutes");

const app = express();

// Connect to MongoDB (will handle gracefully if not configured)
connectDB();

>>>>>>> 1ab9da46adc9fd285298c102d4830e826ef5764c
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/manga", mangaRoutes);

<<<<<<< HEAD
// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
=======
// Basic route for testing
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MangaVaani API" });
});
>>>>>>> 1ab9da46adc9fd285298c102d4830e826ef5764c

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
<<<<<<< HEAD
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 
=======
    res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: process.env.NODE_ENV === "production" ? null : err.message,
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`- For MangaVaani API: http://localhost:${PORT}/api/manga`);
});
>>>>>>> 1ab9da46adc9fd285298c102d4830e826ef5764c
