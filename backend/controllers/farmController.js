import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { AppError } from "../utils/AppError.js";

export const getAllFarms = asyncHandler(async (req, res) => {
  const farms = await FarmModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    message: "Farms fetched successfully",
    data: farms,
  });
});

export const getSingleFarm = asyncHandler(async (req, res) => {
  const { farmId } = req.params;
  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "Farm fetched successfully",
    data: farm,
  });
});

export const getAllFlocksByFarmId = asyncHandler(async (req, res, next) => {
  const { farmId } = req.params;

  // First check if the farm exists
  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    const error = new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
    return next(error);
  }

  // Get all flocks for this farm
  const flocks = await FlockModel.find({ farmId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Flocks fetched successfully",
    data: {
      ...farm.toObject(),
      flocks,
    },
  });
});

// Post
export const createFarm = asyncHandler(async (req, res) => {
  const farm = await FarmModel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Farm created successfully",
    data: farm,
  });
});

export const createBulkFarms = asyncHandler(async (req, res) => {
  const farms = await FarmModel.insertMany(req.body);
  if (farms.length === 0) {
    throw new AppError("No farms created", 400, "NO_FARMS_CREATED", true);
  }
  res.status(201).json({
    status: "success",
    message: "Farms created successfully",
    data: farms,
  });
});

// Update
export const updateSingleFarm = asyncHandler(async (req, res) => {
  const { farmId } = req.params;

  const farm = await FarmModel.findByIdAndUpdate(farmId, req.body, {
    new: true,
    runValidators: true, // Ensure validation runs on update
  });

  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }

  res.status(200).json({
    status: "success",
    message: "Farm updated successfully",
    data: farm,
  });
});

// Delete
export const deleteSingleFarm = asyncHandler(async (req, res) => {
  const { farmId } = req.params;
  const farm = await FarmModel.findByIdAndDelete(farmId);
  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "Farm deleted successfully",
    data: {
      _id: farm._id,
    },
  });
});

export const deleteAllFarms = asyncHandler(async (req, res) => {
  await FarmModel.deleteMany({});
  res.status(200).json({
    status: "success",
    message: "All farms deleted successfully",
    data: [],
  });
});
