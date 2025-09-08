import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  // Normalize: if it's not AppError, keep original
  const isAppError = err instanceof Error && err.name === "AppError";
  const statusCode = err.statusCode || (isAppError ? 500 : 500);
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const isOperational =
    typeof err.isOperational === "boolean" ? err.isOperational : false;

  // Log full server-side details (stack, metadata), including requestId
  logger.error("Unhandled error", {
    requestId: req.requestId,
    name: err.name,
    message: err.message,
    stack: err.stack,
    code,
    isOperational,
    meta: err.meta || null,
  });

  // Client-facing payload: safe and stable
  const payload = {
    success: false,
    error: {
      message: isOperational ? err.message : "Internal server error",
      statusCode,
      code,
      requestId: req.requestId,
    },
  };

  if (err.meta && err.meta.validation)
    payload.error.validation = err.meta.validation;

  res.status(statusCode).json(payload);
};
