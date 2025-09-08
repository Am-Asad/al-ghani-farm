import app from "./app.js";
import connectDB from "./database/database.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || "development";

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running in ${NODE_ENV} mode on port ${PORT}`);
      logger.info(`📱 API available at http://localhost:${PORT}`);
      logger.info(`🔐 Auth endpoints at http://localhost:${PORT}/api/v1/auth`);
    });

    // Graceful shutdown for HTTP server
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully");
      server.close(() => {
        logger.info("HTTP server closed");
        process.exit(0);
      });
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Promise Rejection:", err);
      server.close(() => {
        logger.info("HTTP server closed due to unhandled rejection");
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err);
      server.close(() => {
        logger.info("HTTP server closed due to uncaught exception");
        process.exit(1);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
