import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { AppError } from "../utils/AppError.js";

export const getAllFlocks = asyncHandler(async (req, res) => {
  const flocksWithTotalChicks =
    await FlockModel.getAllFlocksWithTotalChicks().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Flocks fetched successfully",
    data: flocksWithTotalChicks,
  });
});

export const getFlockById = asyncHandler(async (req, res, next) => {
  const { flockId } = req.params;
  const flock = await FlockModel.getFlockByIdWithTotalChicks(flockId).sort({
    createdAt: -1,
  });

  if (!flock || flock.length === 0) {
    const error = new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
    return next(error);
  }

  const sheds = await ShedModel.find({ flockId }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Flock fetched successfully",
    data: {
      ...flock[0],
      sheds: [...sheds],
    },
  });
});

export const createBulkFlocks = asyncHandler(async (req, res, next) => {
  const flocksData = req.body;

  // Validate that all farmIds exist
  const farmIds = [...new Set(flocksData.map((flock) => flock.farmId))];
  const existingFarms = await FarmModel.find({ _id: { $in: farmIds } });
  const existingFarmIds = existingFarms.map((farm) => farm._id.toString());

  const invalidFarmIds = farmIds.filter(
    (farmId) => !existingFarmIds.includes(farmId)
  );
  if (invalidFarmIds.length > 0) {
    const error = new AppError(
      `Invalid farm IDs: ${invalidFarmIds.join(", ")}`,
      400,
      "INVALID_FARM_IDS",
      true
    );
    return next(error);
  }

  const flocks = await FlockModel.insertMany(flocksData);
  if (flocks.length === 0) {
    throw new AppError("No flocks created", 400, "NO_FLOCKS_CREATED", true);
  }
  res.status(201).json({
    status: "success",
    message: "Flocks created successfully",
    data: flocks,
  });
});
export const createFlock = asyncHandler(async (req, res, next) => {
  const { farmId } = req.body;

  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    const error = new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
    return next(error);
  }

  const flock = await FlockModel.create({
    ...req.body,
    endDate: req.body.endDate ? req.body.endDate : undefined,
  });
  res.status(201).json({
    status: "success",
    message: "Flock created successfully",
    data: flock,
  });
});

export const updateFlockById = asyncHandler(async (req, res, next) => {
  const { farmId } = req.body;

  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    const error = new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
    return next(error);
  }

  const flock = await FlockModel.findByIdAndUpdate(
    req.params.flockId,
    {
      ...req.body,
      endDate: req.body.endDate ? req.body.endDate : undefined,
    },
    { new: true }
  );
  if (!flock) {
    const error = new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Flock updated successfully",
    data: flock,
  });
});

export const deleteAllFlocks = asyncHandler(async (req, res, next) => {
  const query = req.query;
  const flocks = await FlockModel.find(query);
  const deletedFlocksIds = flocks.map((flock) => flock._id);
  await ShedModel.deleteMany({
    flockId: { $in: deletedFlocksIds },
  });
  const deletedFlocks = await FlockModel.deleteMany(query);
  if (!deletedFlocks) {
    throw new AppError("No flocks deleted", 400, "NO_FLOCKS_DELETED", true);
  }
  res.status(200).json({
    status: "success",
    message: `All flocks and their associated sheds deleted successfully for ${query.farmId}`,
    data: [],
  });
});

export const deleteFlockById = asyncHandler(async (req, res, next) => {
  const { flockId } = req.params;

  if (flockId) {
    await ShedModel.deleteMany({ flockId });
  }
  await FlockModel.findByIdAndDelete(flockId);

  res.status(200).json({
    status: "success",
    message: `Flock with id ${flockId} and all its associated sheds deleted successfully`,
    data: undefined,
  });
});
