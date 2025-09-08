import { AppError } from "../utils/AppError.js";

export const notFound = (req, res, next) => {
  // Create a consistent error for unknown routes
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "NOT_FOUND"
  );
  next(error); // Pass to global error handler
};
