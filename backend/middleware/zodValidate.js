import { AppError } from "../utils/AppError.js";

export const zodValidate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const validation = result.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    const err = new AppError(
      "Validation failed",
      400,
      "VALIDATION_ERROR",
      true
    );
    err.meta.validation = validation;
    // throw so asyncHandler or Express forwards it to errorHandler
    throw err;
  }

  // Replace raw input with parsed/coerced data
  const { body, query, params } = result.data;

  // Only modify req.body (which is writable)
  req.body = body;

  // Store validated query and params in custom properties
  req.validatedQuery = query;
  req.validatedParams = params;

  next();
};
