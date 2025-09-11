import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { UserModel } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";

export const userSignup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const user = await UserModel.create({
    username,
    email,
    password,
  });
  user.password = undefined;
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user.toObject(),
  });
});

export const userSignupBulk = asyncHandler(async (req, res, next) => {
  // Hash the password for each user
  const usersWithHashedPassword = await Promise.all(
    req.body.map(async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
      return user;
    })
  );

  // Insert the users into the database
  const users = await UserModel.insertMany(usersWithHashedPassword);

  // Check if no users were created
  if (users.length === 0) {
    const error = new AppError(
      "No users created",
      400,
      "NO_USERS_CREATED",
      true
    );
    return next(error);
  }

  // Remove the password from the users
  users.forEach((user) => {
    user.password = undefined;
  });

  // Return the users
  res.status(201).json({
    status: "success",
    message: "Users created successfully",
    data: users.map((user) => user.toObject()),
  });
});

export const userSignin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError(
      "User with this email does not exist",
      404,
      "USER_NOT_FOUND",
      true
    );
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("Invalid password", 400, "INVALID_PASSWORD", true);
  }

  const access_token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" } // Change it when finishing the working session to 15m
  );
  const refresh_token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Enhanced cookie security settings
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  };

  res.cookie("access_token", access_token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.cookie("refresh_token", refresh_token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  user.password = undefined;
  res.status(200).json({
    status: "success",
    message: "User signed in successfully",
    data: user.toObject(),
  });
});

export const userLogout = asyncHandler(async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    maxAge: 0,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  };

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);

  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
    data: {}, // empty object
  });
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    const err = new AppError(
      "Refresh token not provided",
      401,
      "NO_REFRESH_TOKEN",
      true
    );
    return next(err);
  }

  let decodedRefreshToken = null;
  try {
    decodedRefreshToken = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    const err = new AppError(
      "Invalid or expired refresh token",
      401,
      "INVALID_REFRESH_TOKEN",
      true
    );
    return next(err);
  }

  const user = await UserModel.findById(decodedRefreshToken.id);
  if (!user) {
    const err = new AppError("User not found", 404, "USER_NOT_FOUND", true);
    return next(err);
  }

  // Create new access token
  const access_token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Enhanced cookie security settings
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.COOKIE_DOMAIN
        : undefined,
  };

  res.cookie("access_token", access_token, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: "success",
    message: "Token refreshed successfully",
    access_token,
  });
});
