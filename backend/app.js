import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import {
  httpLogger,
  requestId,
  mongoErrorTranslator,
  errorHandler,
  notFound,
} from "./middleware/index.js";
import logger from "./utils/logger.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import farmRoutes from "./routes/farmRoutes.js";
import flockRoutes from "./routes/flockRoutes.js";
import shedRoutes from "./routes/shedRoutes.js";

dotenv.config(); // Load environment variables
const app = express(); // Create express app

// GLOBAL MIDDLEWARES
app.use(cookieParser()); // Parse cookies
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); // Enable CORS
app.use(requestId); // Add request ID to all requests
app.use(httpLogger); // Custom HTTP logging with Winston
app.use(express.json({ limit: "10mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// JSON parsing error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: "Invalid JSON format",
        statusCode: 400,
        code: "INVALID_JSON",
        requestId: req.requestId,
      },
    });
  }
  next(err);
});

// ROUTING MIDDLEWARES
app.get("/", (req, res) => {
  logger.info(`Home route accessed - Request ID: ${req.requestId}`);
  res.json({
    message: "Welcome to Al Ghani Farm API",
    status: "Server is running",
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
  });
});

// ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/farms", farmRoutes);
app.use("/api/v1/flocks", flockRoutes);
app.use("/api/v1/sheds", shedRoutes);

// ERROR HANDLING MIDDLEWARES
app.use(notFound);
app.use(mongoErrorTranslator);
app.use(errorHandler);

export default app;
