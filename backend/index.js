require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dbconnect = require("./config/db");


const connectionroute = require("./routes/Coneectionroutes");
const userroute = require("./routes/userroutes");
const authroute = require("./routes/authroutes");
const postroutes = require("./routes/Postroutes");
const airoutes = require("./routes/AIroutes");

const app = express();

const PORT = process.env.PORT || 5000;

const publicPath = path.join(__dirname, "public");
const indexPath = path.join(publicPath, "index.html");


const corsOptions = {
  origin: (origin, callback) => {
    
    if (!origin) return callback(null, true);

  
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

app.use(express.static(publicPath));

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

app.get("/api/health", async (req, res) => {
  try {
    await connectDatabase();

    res.status(200).json({
      success: true,
      message: "Server and database connected successfully!",
    });
  } catch (error) {
    console.error("Health check error:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api", async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use("/api/connections", connectionroute);
app.use("/api", userroute);
app.use("/api", authroute);
app.use("/api", postroutes);
app.use("/api", airoutes);


app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

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


if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;