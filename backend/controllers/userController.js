import { asyncHandler } from "../middleware/asyncHandler.js";
import { UserModel } from "../models/users.js";
import { AppError } from "../utils/AppError.js";
import { updatePermissions } from "../utils/updatePermissions.js";
import bcrypt from "bcryptjs";

// Get
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    message: "Users fetched successfully",
    data: users,
  });
});

export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id).select("-password");
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: user,
  });
});

export const getMeUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  console.log("req.user", req.user);
  const user = await UserModel.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: user,
  });
});

// Post
export const createUser = asyncHandler(async (req, res) => {
  const user = await UserModel.create(req.body);
  user.password = undefined;
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    data: user,
  });
});

export const createUserBulk = asyncHandler(async (req, res, next) => {
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

// Update
export const updateSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password, role, ...updateData } = req.body;

  // Only include fields that are actually provided in the request
  const fieldsToUpdate = { ...updateData };

  // Handle password separately - only hash and include if provided and not empty
  if (password && password.trim() !== "") {
    fieldsToUpdate.password = await bcrypt.hash(password, 10);
  }

  // Handle permissions separately - only include if role is provided and not empty
  if (role && role.trim() !== "") {
    fieldsToUpdate.permissions = updatePermissions(role);
    fieldsToUpdate.role = role;
  }

  const user = await UserModel.findByIdAndUpdate(
    id,
    { ...fieldsToUpdate },
    {
      new: true,
      runValidators: true, // Ensure validation runs on update
    }
  ).select("-password"); // Exclude password from response

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND", true);
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: user,
  });
});

// Delete
export const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "User deleted successfully",
    data: user,
  });
});

export const deleteAllUsers = asyncHandler(async (req, res) => {
  await UserModel.deleteMany({});
  res.status(200).json({
    status: "success",
    message: "All users deleted successfully",
    data: [],
  });
});
