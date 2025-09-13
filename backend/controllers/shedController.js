import { ShedModel } from "../models/sheds.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { FlockModel } from "../models/flocks.js";

export const getAllSheds = asyncHandler(async (req, res) => {
  const sheds = await ShedModel.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Sheds fetched successfully",
    data: sheds,
  });
});

export const getShedById = asyncHandler(async (req, res, next) => {
  const shed = await ShedModel.findById(req.params.shedId);

  if (!shed) {
    const error = new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Shed fetched successfully",
    data: shed,
  });
});

export const createBulkSheds = asyncHandler(async (req, res, next) => {
  const shedsData = req.body;

  // Validate that all flockIds exist
  const shedIds = [...new Set(shedsData.map((shed) => shed.flockId))];
  const existingFlocks = await FlockModel.find({ _id: { $in: shedIds } });
  const existingFlockIds = existingFlocks.map((flock) => flock._id.toString());

  const invalidFlockIds = shedIds.filter(
    (flockId) => !existingFlockIds.includes(flockId)
  );
  if (invalidFlockIds.length > 0) {
    const error = new AppError(
      `Invalid flock IDs: ${invalidFlockIds.join(", ")}`,
      400,
      "INVALID_FLOCK_IDS",
      true
    );
    return next(error);
  }

  const sheds = await ShedModel.insertMany(shedsData);
  if (sheds.length === 0) {
    throw new AppError("No sheds created", 400, "NO_SHEDS_CREATED", true);
  }
  res.status(201).json({
    status: "success",
    message: "Sheds created successfully",
    data: sheds,
  });
});

export const createShed = asyncHandler(async (req, res, next) => {
  const { flockId } = req.body;

  const flock = await FlockModel.findById(flockId);
  if (!flock) {
    const error = new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
    return next(error);
  }

  const newShed = await ShedModel.create({
    ...req.body,
  });
  res.status(201).json({
    status: "success",
    message: "Shed created successfully",
    data: newShed,
  });
});

export const updateShedById = asyncHandler(async (req, res, next) => {
  const { shedId } = req.params;

  const shed = await ShedModel.findById(shedId);
  if (!shed) {
    const error = new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
    return next(error);
  }

  const newShed = await ShedModel.findByIdAndUpdate(
    shedId,
    {
      ...req.body,
    },
    { new: true }
  );
  if (!newShed) {
    const error = new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Shed updated successfully",
    data: newShed,
  });
});

export const deleteAllSheds = asyncHandler(async (req, res) => {
  const { flockId } = req.query;

  if (flockId) {
    const deletedSheds = await ShedModel.deleteMany({ flockId });
    if (!deletedSheds) {
      throw new AppError("No sheds deleted", 400, "NO_SHEDS_DELETED", true);
    }
  } else {
    const deletedSheds = await ShedModel.deleteMany({});
    if (!deletedSheds) {
      throw new AppError("No sheds deleted", 400, "NO_SHEDS_DELETED", true);
    }
  }
  res.status(200).json({
    status: "success",
    message: "All sheds deleted successfully",
    data: [],
  });
});

export const deleteShedById = asyncHandler(async (req, res, next) => {
  const shed = await ShedModel.findByIdAndDelete(req.params.shedId);
  if (!shed) {
    const error = new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Shed deleted successfully",
    data: {
      _id: shed._id,
    },
  });
});
