export class AppError extends Error {
  /**
   * @param {string} message - human-friendly message
   * @param {number} statusCode - HTTP status to send
   * @param {string} code - machine-readable error code (e.g., "USER_NOT_FOUND")
   * @param {boolean} isOperational - true for expected errors vs programming errors
   */
  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    isOperational = true
  ) {
    super(message);

    // sets the error 'name' to the class name (AppError)
    this.name = this.constructor.name;

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // attach timestamp for easier debugging
    this.timestamp = new Date().toISOString();

    // Optional: place to attach extra metadata (validation details, DB info)
    this.meta = {};

    // Capture stack trace (exclude constructor frame)
    Error.captureStackTrace(this, this.constructor);
  }
}
