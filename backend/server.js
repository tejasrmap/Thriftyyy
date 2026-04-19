const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Required Environment Variables Validation
const REQUIRED_ENV_VARS = [
  "MONGODB_URI",
  "JWT_SECRET",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

const missingVars = REQUIRED_ENV_VARS.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`❌ CRITICAL ERROR: Missing Environment Variables: ${missingVars.join(", ")}`);
  if (process.env.NODE_ENV === "production") {
    // We don't exit in production to allow the logs to reach the dashboard
    console.warn("⚠️ Continuing without critical variables. This will cause 500 errors on API routes.");
  }
}

// Database Connection Middleware for Serverless Stability
const dbMiddleware = async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error in middleware:", error.message);
    res.status(500).json({ 
      message: "Database connection failed", 
      error: process.env.NODE_ENV === "production" ? "Backend Configuration Issue" : error.message 
    });
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
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));

console.log("Routes mounted. Admin routes at /api/admin");

// Vercel Serverless Export
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;
