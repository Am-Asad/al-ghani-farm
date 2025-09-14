import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { LedgerModel } from "../models/ledger.js";
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

  // Find all flocks based on query (if farmId is provided, filter by farmId)
  const flocks = await FlockModel.find(query);

  if (flocks.length === 0) {
    const error = new AppError(
      "No flocks found to delete",
      404,
      "NO_FLOCKS_FOUND",
      true
    );
    return next(error);
  }

  const deletedFlocksIds = flocks.map((flock) => flock._id);

  // Get all sheds for these flocks
  const sheds = await ShedModel.find({
    flockId: { $in: deletedFlocksIds },
  });
  const shedIds = sheds.map((shed) => shed._id);

  // Delete all ledgers associated with these flocks and their sheds
  if (shedIds.length > 0) {
    await LedgerModel.deleteMany({
      $or: [
        { flockId: { $in: deletedFlocksIds } },
        { shedId: { $in: shedIds } },
      ],
    });
  } else {
    // Delete ledgers only for the flocks if no sheds exist
    await LedgerModel.deleteMany({
      flockId: { $in: deletedFlocksIds },
    });
  }

  // Delete all sheds for these flocks
  await ShedModel.deleteMany({
    flockId: { $in: deletedFlocksIds },
  });

  // Finally delete all flocks
  const deletedFlocks = await FlockModel.deleteMany(query);

  if (deletedFlocks.deletedCount === 0) {
    throw new AppError("No flocks deleted", 400, "NO_FLOCKS_DELETED", true);
  }

  const message = query.farmId
    ? `All flocks and their associated sheds and ledgers deleted successfully for farm ${query.farmId}`
    : `All flocks and their associated sheds and ledgers deleted successfully`;

  res.status(200).json({
    status: "success",
    message: message,
    data: {
      deletedFlocks: deletedFlocks.deletedCount,
      deletedSheds: sheds.length,
      deletedLedgers:
        shedIds.length > 0 ? "All related ledgers" : "All related ledgers",
    },
  });
});

export const deleteFlockById = asyncHandler(async (req, res, next) => {
  const { flockId } = req.params;

  // Check if flock exists
  const flock = await FlockModel.findById(flockId);
  if (!flock) {
    const error = new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
    return next(error);
  }

  // Get all sheds for this flock
  const sheds = await ShedModel.find({ flockId });
  const shedIds = sheds.map((shed) => shed._id);

  // Delete all ledgers associated with this flock and its sheds
  if (shedIds.length > 0) {
    await LedgerModel.deleteMany({
      $or: [{ flockId: flockId }, { shedId: { $in: shedIds } }],
    });
  } else {
    // Delete ledgers only for the flock if no sheds exist
    await LedgerModel.deleteMany({ flockId: flockId });
  }

  // Delete all sheds for this flock
  await ShedModel.deleteMany({ flockId });

  // Finally delete the flock
  await FlockModel.findByIdAndDelete(flockId);

  res.status(200).json({
    status: "success",
    message: `Flock with id ${flockId}, all its associated sheds, and all related ledgers deleted successfully`,
    data: undefined,
  });
});
