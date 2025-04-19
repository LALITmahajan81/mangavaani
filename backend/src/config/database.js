const mongoose = require("mongoose");

/**
 * Function to connect to MongoDB
 * With graceful handling for missing connection strings
 */
const connectDB = async () => {
    try {
        // Check if MONGODB_URI is provided in the environment
        if (!process.env.MONGODB_URI) {
            console.warn("⚠️ MongoDB connection URL not provided. Continuing without database connection.");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.warn("⚠️ Continuing without database connection");
        // Not exiting the process so the app can still run without DB
    }
};

module.exports = connectDB;
