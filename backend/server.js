// server.js
require("dotenv").config(); // MUST be first line
const app = require("./app");
const connectDB = require("./config/db");
const { PORT } = require("./config/env");
const { initializeOlympiadModule } = require("./modules/olympiad");

const startServer = async () => {
  try {
    await connectDB();

    // Initialize Olympiad Module (Loads, validates, and caches questions)
    initializeOlympiadModule();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err);
    process.exit(1);
  }
};

startServer();