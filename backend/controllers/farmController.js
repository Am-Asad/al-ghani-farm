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

export const getFarmById = asyncHandler(async (req, res) => {
  const { farmId } = req.params;
  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }
  const flocks = await FlockModel.getAllFlocksWithTotalChicksForFarm(farmId);
  res.status(200).json({
    status: "success",
    message: "Farm fetched successfully",
    data: {
      ...farm.toObject(),
      flocks: [...flocks],
    },
  });
});

// Post
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

export const createFarm = asyncHandler(async (req, res) => {
  const farm = await FarmModel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Farm created successfully",
    data: farm,
  });
});

// Update
export const updateFarmById = asyncHandler(async (req, res) => {
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
export const deleteAllFarms = asyncHandler(async (req, res) => {
  const farms = await FarmModel.deleteMany({});
  if (!farms) {
    throw new AppError("No farms deleted", 400, "NO_FARMS_DELETED", true);
  }
  res.status(200).json({
    status: "success",
    message:
      "All farms and their associated flocks and sheds deleted successfully",
    data: [],
  });
});

export const deleteFarmById = asyncHandler(async (req, res) => {
  const { farmId } = req.params;

  const farm = await FarmModel.findByIdAndDelete(farmId);
  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }

  res.status(200).json({
    status: "success",
    message: `Farm with id ${farmId} and all its associated flocks and sheds deleted successfully`,
    data: {
      farmId: farm._id,
    },
  });
});
