require("dotenv").config();
const express = require("express");
const axios = require("axios");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const mangaRoutes = require("./routes/mangaRoutes");
const path = require("path");
const fs = require("fs");

const app = express();

// Create manga-images directory if it doesn't exist
const mangaImagesDir = path.join(__dirname, "../manga-images");
if (!fs.existsSync(mangaImagesDir)) {
    console.log(`Creating manga images directory: ${mangaImagesDir}`);
    fs.mkdirSync(mangaImagesDir, { recursive: true });
}

// Connect to MongoDB (will handle gracefully if not configured)
connectDB();

// Middleware
app.use(express.json());

// Set up static file serving for manga images
app.use("/manga-images", express.static(mangaImagesDir));
console.log(`Manga images will be served from: ${mangaImagesDir}`);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/manga", mangaRoutes);

// Basic route for testing
app.get("/", (req, res) => {
    res.json({ message: "Welcome to MangaVaani API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
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
    console.log(`- For Manga Images: http://localhost:${PORT}/manga-images`);
});
