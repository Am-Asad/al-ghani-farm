import { AppError } from "../utils/AppError.js";

export const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      const error = new AppError(
        "User does not have the required role to access this resource",
        401,
        "UNAUTHORIZED",
        true
      );
      return next(error);
    }
    next();
  };
};
