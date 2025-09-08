import logger from "../utils/logger.js";

export const httpLogger = (req, res, next) => {
  const start = Date.now();

  // Log the incoming request
  logger.http(`${req.method} ${req.originalUrl} - ${req.ip}`);

  // Log request body for POST/PUT requests
  if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
    logger.debug(`Request Body: ${JSON.stringify(req.body)}`);
  }

  // Log request headers (excluding sensitive ones)
  const headers = { ...req.headers };
  delete headers.authorization;
  delete headers.cookie;
  logger.debug(`Request Headers: ${JSON.stringify(headers)}`);

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Determine log level based on status code
    let logLevel = "info";
    if (statusCode >= 400) logLevel = "warn";
    if (statusCode >= 500) logLevel = "error";

    // Log the response
    logger[logLevel](
      `${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`
    );

    // Log response body for errors
    if (statusCode >= 400 && chunk) {
      try {
        const responseBody = JSON.parse(chunk.toString());
        logger.debug(`Response Body: ${JSON.stringify(responseBody)}`);
      } catch (e) {
        logger.debug(`Response Body: ${chunk.toString()}`);
      }
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};
