import { AppError } from "../utils/AppError.js";

export const mongoErrorTranslator = (err, req, res, next) => {
  // 1) Duplicate key (single write or bulk write)

  // Check for duplicate key error in multiple possible locations
  const isDupKey =
    err?.code === 11000 ||
    err?.cause?.code === 11000 ||
    (err?.name === "MongoServerError" && err?.code === 11000) ||
    (err?.name === "MongoBulkWriteError" && err?.code === 11000) ||
    (err?.name === "MongooseError" && err?.cause?.code === 11000);

  if (isDupKey) {
    // Try to get field/value from the most reliable place available
    const keyValue =
      err?.keyValue ||
      err?.cause?.keyValue ||
      err?.writeErrors?.[0]?.err?.keyValue ||
      err?.writeErrors?.[0]?.keyValue ||
      null;

    const field = keyValue ? Object.keys(keyValue)[0] : "unique_field";
    const value = keyValue ? keyValue[field] : "duplicate";

    const message = `${field} "${value}" already exists`;
    const appErr = new AppError(message, 409, "DUPLICATE_KEY", true);
    appErr.meta = {
      keyValue: keyValue || undefined,
      index: err?.index || err?.cause?.index,
      nInserted:
        err?.result?.nInserted ?? err?.cause?.result?.nInserted ?? undefined,
    };
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
