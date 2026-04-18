const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Database Connection Middleware for Serverless Stability
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
};

app.use(dbMiddleware);

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clothes", require("./routes/clothRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

// Vercel Serverless Export
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
