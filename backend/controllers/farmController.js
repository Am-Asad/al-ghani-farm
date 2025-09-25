import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { AppError } from "../utils/AppError.js";
import { LedgerModel } from "../models/ledger.js";

export const getAllFarms = asyncHandler(async (req, res) => {
  const {
    search = "",
    limit = "10",
    page = "1",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const limitNum = Math.max(parseInt(limit, 10) || 10, 0);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const offsetNum = (pageNum - 1) * limitNum;
  const sortField = ["createdAt", "updatedAt"].includes(sortBy)
    ? sortBy
    : "createdAt";
  const sortDir = sortOrder === "asc" ? "asc" : "desc";

  const { items, total } = await FarmModel.getAllFarmsWithShedsAndFlocksCount({
    search,
    limit: limitNum,
    offset: offsetNum,
    sortBy: sortField,
    sortOrder: sortDir,
  });

  res.status(200).json({
    status: "success",
    message: "Farms fetched successfully",
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount: total,
      hasMore: offsetNum + items.length < total,
    },
  });
});

export const getFarmsForDropdown = asyncHandler(async (req, res) => {
  const { search = "", farmId = "" } = req.query;

  const conditions = [];
  if (farmId) conditions.push({ _id: farmId });
  if (search.trim())
    conditions.push({ name: { $regex: search.trim(), $options: "i" } });

  const query = conditions.length > 0 ? { $or: conditions } : {};

  const farms = await FarmModel.find(query)
    .select("_id name")
    .sort({ name: 1 })
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "Farms fetched successfully",
    data: farms,
  });
});

export const getFarmById = asyncHandler(async (req, res) => {
  const { farmId } = req.params;
  const farm = await FarmModel.getFarmByIdWithFlocksAndShedsCount(farmId);
  if (!farm || farm.length === 0) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }
  const flocks = await FlockModel.find({ farmId }).populate(
    "allocations.shedId",
    "name capacity"
  );
  res.status(200).json({
    status: "success",
    message: "Farm fetched successfully",
    data: {
      ...farm[0],
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
  // Delete all sheds, flocks, and ledgers first
  await ShedModel.deleteMany({});
  await FlockModel.deleteMany({});
  await LedgerModel.deleteMany({});

  // Finally delete all farms
  const farms = await FarmModel.deleteMany({});
  if (farms.deletedCount === 0) {
    throw new AppError("No farms deleted", 400, "NO_FARMS_DELETED", true);
  }

  res.status(200).json({
    status: "success",
    message:
      "All farms and their associated sheds, flocks, and ledgers deleted successfully",
    data: {
      deletedFarms: farms.deletedCount,
    },
  });
});

export const deleteFarmById = asyncHandler(async (req, res) => {
  const { farmId } = req.params;

  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }

  // Delete all the sheds, flocks, and ledgers associated with the farm
  await ShedModel.deleteMany({ farmId });
  await FlockModel.deleteMany({ farmId });
  await LedgerModel.deleteMany({ farmId });
  await FarmModel.findByIdAndDelete(farmId);

  res.status(200).json({
    status: "success",
    message: `Farm with id ${farmId} and all its associated sheds, flocks, and ledgers deleted successfully`,
    data: {
      farmId: farm._id,
    },
  });
});
