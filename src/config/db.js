const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env.local from the project root
dotenv.config({
    path: path.join(__dirname, "../../.env.local")
});

async function connectDB() {
    try {
        const host = process.env.MONGO_HOST;
        const port = process.env.MONGO_PORT;
        const database = process.env.MONGO_DATABASE;
        const username = encodeURIComponent(process.env.MONGO_USERNAME);
        const password = encodeURIComponent(process.env.MONGO_PASSWORD);

        const mongoURI =
            `mongodb://${username}:${password}@${host}:${port}/${database}`;

        await mongoose.connect(mongoURI);

        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;