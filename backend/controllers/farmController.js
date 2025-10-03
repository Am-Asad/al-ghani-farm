import mongoose from "mongoose";
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
  const { search = "", farmIds = "" } = req.query;

  let selectedFarmIds = [];

  // Parse selected farm IDs
  if (typeof farmIds === "string" && farmIds.trim()) {
    selectedFarmIds = farmIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  let farms = [];
  let selectedFarms = [];

  // Always fetch selected farms first if they exist
  if (selectedFarmIds.length > 0) {
    selectedFarms = await FarmModel.find({
      _id: { $in: selectedFarmIds },
    }).select("_id name");
  }

  // If there's a search query, get search results
  if (typeof search === "string" && search.trim()) {
    farms = await FarmModel.find({
      name: { $regex: search.trim(), $options: "i" },
    })
      .select("_id name")
      .sort({ name: 1 })
      .limit(10);
  } else {
    // If no search query, get default farms
    // We need to account for selected farms, so we might need more than 10
    const limitForDefault = selectedFarmIds.length > 0 ? 15 : 10;
    farms = await FarmModel.find({})
      .select("_id name")
      .sort({ name: 1 })
      .limit(limitForDefault);
  }

  // Combine selected farms with search/default results
  const combinedFarms = [...selectedFarms, ...farms];

  // Remove duplicates and sort
  const uniqueFarms = combinedFarms.filter(
    (farm, index, self) =>
      index === self.findIndex((f) => f._id.toString() === farm._id.toString())
  );

  // Sort by name and limit to 10, but ensure selected farms are included
  const sortedFarms = uniqueFarms.sort((a, b) => a.name.localeCompare(b.name));

  // If we have selected farms, prioritize them and fill the rest with other farms
  let finalFarms = [];
  if (selectedFarmIds.length > 0) {
    // Add selected farms first
    const selectedFarmsInResults = sortedFarms.filter((farm) =>
      selectedFarmIds.includes(farm._id.toString())
    );
    // Add non-selected farms to fill up to 10
    const otherFarms = sortedFarms.filter(
      (farm) => !selectedFarmIds.includes(farm._id.toString())
    );
    finalFarms = [...selectedFarmsInResults, ...otherFarms].slice(0, 10);
  } else {
    finalFarms = sortedFarms.slice(0, 10);
  }

  res.status(200).json({
    status: "success",
    message: "Farms fetched successfully",
    data: finalFarms,
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

export const createDummyFarms = asyncHandler(async (req, res) => {
  const { count = 10 } = req.query;
  const countNum = Math.min(Math.max(parseInt(count, 10) || 10, 1), 100); // Limit between 1-100

  const dummyFarms = [];
  const farmNames = [
    "Green Valley Farm",
    "Sunrise Poultry Farm",
    "Golden Harvest Farm",
    "Blue Sky Farm",
    "Mountain View Farm",
    "River Side Farm",
    "Sunset Farm",
    "Eagle's Nest Farm",
    "Prairie Farm",
    "Oak Tree Farm",
    "Crystal Lake Farm",
    "Windmill Farm",
    "Rose Garden Farm",
    "Maple Leaf Farm",
    "Silver Creek Farm",
    "Pine Ridge Farm",
    "Diamond Farm",
    "Emerald Valley Farm",
    "Ruby Ranch",
    "Sapphire Farm",
  ];

  const supervisorNames = [
    "Ahmed Hassan",
    "Muhammad Ali",
    "Fatima Khan",
    "Ali Raza",
    "Aisha Malik",
    "Omar Sheikh",
    "Zainab Ahmed",
    "Hassan Rizvi",
    "Maryam Khan",
    "Usman Ali",
    "Khadija Sheikh",
    "Ibrahim Malik",
    "Amina Hassan",
    "Yusuf Khan",
    "Hafsa Ali",
    "Tariq Raza",
    "Nadia Sheikh",
    "Saad Malik",
    "Layla Khan",
    "Hamza Ali",
  ];

  for (let i = 0; i < countNum; i++) {
    const farmName = farmNames[i % farmNames.length];
    const supervisorName = supervisorNames[i % supervisorNames.length];

    // Add unique suffix if we need more farms than available names
    const uniqueSuffix =
      i >= farmNames.length ? ` ${Math.floor(i / farmNames.length) + 1}` : "";

    // Generate random date between 2020 and 2025
    const startYear = 2020;
    const endYear = 2025;
    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    const randomDate = new Date(randomYear, randomMonth, randomDay);

    dummyFarms.push({
      name: `${farmName}${uniqueSuffix}`,
      supervisor: supervisorName,
      createdAt: randomDate,
      updatedAt: randomDate,
    });
  }

  const farms = await FarmModel.insertMany(dummyFarms);

  res.status(201).json({
    status: "success",
    message: `${farms.length} dummy farms created successfully`,
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

export const deleteBulkFarms = asyncHandler(async (req, res) => {
  const farmIds = req.body;

  // Validate input
  if (!Array.isArray(farmIds) || farmIds.length === 0) {
    throw new AppError(
      "Farm IDs array is required",
      400,
      "INVALID_FARM_IDS",
      true
    );
  }

  // Validate that all farmIds are valid ObjectIds
  const validFarmIds = farmIds.filter(
    (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
  );

  if (validFarmIds.length === 0) {
    throw new AppError(
      "No valid farm IDs provided",
      400,
      "INVALID_FARM_IDS",
      true
    );
  }

  // Check if farms exist
  const existingFarms = await FarmModel.find({ _id: { $in: validFarmIds } });
  if (existingFarms.length === 0) {
    throw new AppError(
      "No farms found with provided IDs",
      404,
      "FARMS_NOT_FOUND",
      true
    );
  }

  // 1. Delete all ledgers associated with these farms
  const deletedLedgers = await LedgerModel.deleteMany({
    farmId: { $in: validFarmIds },
  });

  // 2. Delete all flocks associated with these farms
  const deletedFlocks = await FlockModel.deleteMany({
    farmId: { $in: validFarmIds },
  });

  // 3. Delete all sheds associated with these farms
  const deletedSheds = await ShedModel.deleteMany({
    farmId: { $in: validFarmIds },
  });

  // 4. Finally delete the farms themselves
  const deletedFarms = await FarmModel.deleteMany({
    _id: { $in: validFarmIds },
  });

  res.status(200).json({
    status: "success",
    message: `Successfully deleted ${validFarmIds.length} farms and their associated data`,
    data: {
      deletedFarms: deletedFarms.deletedCount,
      deletedFlocks: deletedFlocks.deletedCount,
      deletedSheds: deletedSheds.deletedCount,
      deletedLedgers: deletedLedgers.deletedCount,
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
