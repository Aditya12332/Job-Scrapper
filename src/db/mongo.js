const mongoose = require("mongoose");

async function connectDB() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is missing in .env");
    }

    try {
        await mongoose.connect(uri);

        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Failed");
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;