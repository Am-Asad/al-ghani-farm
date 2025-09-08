import { AppError } from "../utils/AppError.js";

export const mongoErrorTranslator = (err, req, res, next) => {
  // 1. Duplicate key
  if (err.name === "MongoServerError" && err.code === 11000) {
    // err.keyValue like { email: "a@b.com" }
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field} "${value}" already exists`;
    const appErr = new AppError(message, 409, "DUPLICATE_KEY", true);
    appErr.meta = { keyValue: err.keyValue };
    return next(appErr);
  }

  // 2. Mongoose validation error
  if (err.name === "ValidationError") {
    // err.errors is an object of { path: ValidatorError }
    const validation = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    const appErr = new AppError(
      "Data validation failed",
      400,
      "MONGO_VALIDATION_ERROR",
      true
    );
    appErr.meta = { validation };
    return next(appErr);
  }

  // 3. CastError (invalid ObjectId)
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    const appErr = new AppError(message, 400, "INVALID_ID", true);
    return next(appErr);
  }

  // Not a recognized mongoose error -> pass through
  return next(err);
};
