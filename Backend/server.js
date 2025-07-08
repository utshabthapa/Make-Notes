require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js"); // Changed to require

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
// app.use("/api/notes", noteRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Make Notes API is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS solution");
    res.json({
      status: "success",
      message: "Database connected",
      solution: rows[0].solution,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      error: "Database connection failed",
      details: err.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);

  res.status(err.statusCode || 500).json({
    status: "error",
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    error: "Endpoint not found",
  });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
  console.log(`CORS configured for: ${process.env.FRONTEND_URL}`);
});
