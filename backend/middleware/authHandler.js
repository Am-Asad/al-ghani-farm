import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const authHandler = (req, res, next) => {
  const access_token = req.cookies.access_token;
  const refresh_token = req.cookies.refresh_token;

  if (!access_token || !refresh_token) {
    const err = new AppError(
      "Authentication required. Please sign in to access this resource.",
      401,
      "NO_TOKEN_PROVIDED",
      true
    );
    return next(err);
  }

  // Verify access token with proper error handling
  let decodedAccessToken;
  try {
    decodedAccessToken = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET
    );
  } catch (accessTokenError) {
    // Convert JWT errors to user-friendly messages
    let message, code;

    if (accessTokenError.name === "TokenExpiredError") {
      message = "Your session has expired. Please sign in again.";
      code = "TOKEN_EXPIRED";
    } else if (accessTokenError.name === "JsonWebTokenError") {
      if (accessTokenError.message.includes("jwt malformed")) {
        message = "Invalid authentication token format. Please sign in again.";
        code = "MALFORMED_TOKEN";
      } else if (accessTokenError.message.includes("invalid signature")) {
        message = "Invalid authentication token. Please sign in again.";
        code = "INVALID_SIGNATURE";
      } else {
        message = "Invalid authentication token. Please sign in again.";
        code = "INVALID_TOKEN";
      }
    } else {
      message = "Authentication error. Please sign in again.";
      code = "AUTH_ERROR";
    }

    const err = new AppError(message, 401, code, true);
    return next(err);
  }

  // Verify refresh token with proper error handling
  let decodedRefreshToken;
  try {
    decodedRefreshToken = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (refreshTokenError) {
    // Convert JWT errors to user-friendly messages
    let message, code;

    if (refreshTokenError.name === "TokenExpiredError") {
      message = "Your refresh token has expired. Please sign in again.";
      code = "REFRESH_TOKEN_EXPIRED";
    } else if (refreshTokenError.name === "JsonWebTokenError") {
      if (refreshTokenError.message.includes("jwt malformed")) {
        message = "Invalid refresh token format. Please sign in again.";
        code = "MALFORMED_REFRESH_TOKEN";
      } else if (refreshTokenError.message.includes("invalid signature")) {
        message = "Invalid refresh token. Please sign in again.";
        code = "INVALID_REFRESH_SIGNATURE";
      } else {
        message = "Invalid refresh token. Please sign in again.";
        code = "INVALID_REFRESH_TOKEN";
      }
    } else {
      message = "Refresh token error. Please sign in again.";
      code = "REFRESH_TOKEN_ERROR";
    }

    const err = new AppError(message, 401, code, true);
    return next(err);
  }

  req.user = decodedAccessToken;
  next();
};
