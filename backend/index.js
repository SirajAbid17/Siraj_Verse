
require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dbconnect = require("./config/db");

// Routes
const connectionroute = require("./routes/Coneectionroutes");
const userroute = require("./routes/userroutes");
const authroute = require("./routes/authroutes");
const postroutes = require("./routes/Postroutes");

// App
const app = express();

const PORT = process.env.PORT || 5000;
const publicPath = path.join(__dirname, "public");
const indexPath = path.join(publicPath, "index.html");

// =====================================
// CORS - ALLOW ALL ORIGINS
// =====================================

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

// =====================================
// FRONTEND STATIC FILES
// =====================================

app.use(express.static(publicPath));

// =====================================
// DATABASE CONNECTION
// =====================================

let databaseConnection = null;

const connectDatabase = async () => {
  if (!databaseConnection) {
    databaseConnection = dbconnect().catch((error) => {
      databaseConnection = null;
      throw error;
    });
  }

  await databaseConnection;
};

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running!",
  });
});

// =====================================
// DATABASE MIDDLEWARE
// =====================================

app.use("/api", async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================
// API ROUTES
// =====================================

app.use("/api/connections", connectionroute);
app.use("/api", userroute);
app.use("/api", authroute);
app.use("/api", postroutes);

// =====================================
// API NOT FOUND
// =====================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================
// REACT FRONTEND ROUTING
// =====================================

app.get(/.*/, (req, res, next) => {
  if (
    req.path.startsWith("/api/") ||
    req.path === "/api" ||
    req.path.startsWith("/socket.io/")
  ) {
    return next();
  }

  res.sendFile(indexPath, (error) => {
    if (error) {
      console.error("Frontend file error:", error.message);

      res.status(404).send(
        "Frontend build not found. Check backend/public/index.html"
      );
    }
  });
});

// =====================================
// GENERAL 404
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
  });
});

// =====================================
// LOCAL SERVER
// =====================================

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// =====================================
// VERCEL EXPORT
// =====================================

module.exports = app;
