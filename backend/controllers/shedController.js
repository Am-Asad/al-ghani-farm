import mongoose from "mongoose";
import { ShedModel } from "../models/sheds.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { FarmModel } from "../models/farms.js";
import { LedgerModel } from "../models/ledger.js";

export const getAllSheds = asyncHandler(async (req, res) => {
  const {
    search = "",
    limit = "10",
    page = "1",
    sortBy = "createdAt",
    sortOrder = "desc",
    farmId = "",
    capacityMin = "",
    capacityMax = "",
    dateFrom = "",
    dateTo = "",
  } = req.query;

  const limitNum = Math.max(parseInt(limit, 10) || 10, 0);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const offsetNum = (pageNum - 1) * limitNum;

  // Allow a safe subset of fields for sorting
  const allowedSortFields = ["createdAt", "updatedAt", "capacity", "name"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const sortDir = sortOrder === "asc" ? 1 : -1;

  const hasFarmId = typeof farmId === "string" && farmId.trim().length > 0;
  const farmObjectId =
    hasFarmId && mongoose.Types.ObjectId.isValid(farmId)
      ? new mongoose.Types.ObjectId(farmId)
      : hasFarmId
      ? farmId
      : null;

  const searchConditions = [];
  if (search && typeof search === "string") {
    // name partial match
    searchConditions.push({ name: { $regex: search, $options: "i" } });
    // capacity exact match if numeric
    const capacityNum = parseInt(search, 10);
    if (!Number.isNaN(capacityNum))
      searchConditions.push({ capacity: capacityNum });
  }

  // capacity range filter
  const hasMin = typeof capacityMin === "string" && capacityMin.trim() !== "";
  const hasMax = typeof capacityMax === "string" && capacityMax.trim() !== "";
  const capacityRange = {};
  if (hasMin) {
    const minNum = parseInt(capacityMin, 10);
    if (!Number.isNaN(minNum)) capacityRange.$gte = minNum;
  }
  if (hasMax) {
    const maxNum = parseInt(capacityMax, 10);
    if (!Number.isNaN(maxNum)) capacityRange.$lte = maxNum;
  }

  const pipeline = [
    ...(hasFarmId
      ? [
          {
            $match: {
              farmId: farmObjectId,
            },
          },
        ]
      : []),
    ...(() => {
      const dateRange = {};
      const hasFrom = typeof dateFrom === "string" && dateFrom.trim() !== "";
      const hasTo = typeof dateTo === "string" && dateTo.trim() !== "";
      if (hasFrom) {
        const fromDate = new Date(dateFrom);
        if (!Number.isNaN(fromDate.getTime())) dateRange.$gte = fromDate;
      }
      if (hasTo) {
        const toDate = new Date(dateTo);
        if (!Number.isNaN(toDate.getTime())) dateRange.$lte = toDate;
      }
      return Object.keys(dateRange).length > 0
        ? [{ $match: { createdAt: dateRange } }]
        : [];
    })(),
    ...(Object.keys(capacityRange).length > 0
      ? [
          {
            $match: { capacity: capacityRange },
          },
        ]
      : []),
    ...(searchConditions.length > 0
      ? [
          {
            $match: {
              $or: searchConditions,
            },
          },
        ]
      : []),
    // Populate farmId similar to Mongoose populate with only required fields
    {
      $lookup: {
        from: "farms",
        let: { fid: "$farmId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$fid"] } } },
          { $project: { _id: 1, name: 1, supervisor: 1 } },
        ],
        as: "farmId",
      },
    },
    { $unwind: { path: "$farmId", preserveNullAndEmptyArrays: true } },
    { $sort: { [sortField]: sortDir } },
    {
      $facet: {
        items: [
          ...(offsetNum > 0 ? [{ $skip: offsetNum }] : []),
          { $limit: Math.max(limitNum, 0) },
        ],
        total: [{ $count: "count" }],
      },
    },
    {
      $project: {
        items: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
      },
    },
  ];

  const result = await ShedModel.aggregate(pipeline).then(
    (resAgg) => resAgg[0] || { items: [], total: 0 }
  );

  const { items, total } = result;

  res.status(200).json({
    status: "success",
    message: "Sheds fetched successfully",
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount: total,
      hasMore: offsetNum + items.length < total,
    },
  });
});

export const getShedsForDropdown = asyncHandler(async (req, res) => {
  const { search = "", farmId = "", shedIds = "" } = req.query;

  let selectedShedIds = [];

  // Parse selected shed IDs
  if (typeof shedIds === "string" && shedIds.trim()) {
    selectedShedIds = shedIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
  }

  // Build farm filter conditions first
  const farmConditions = [];
  if (typeof farmId === "string" && farmId.trim()) {
    const farmIds = farmId
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (farmIds.length === 1) {
      farmConditions.push({ farmId: farmIds[0] });
    } else if (farmIds.length > 1) {
      farmConditions.push({ farmId: { $in: farmIds } });
    }
  }

  let sheds = [];
  let selectedSheds = [];

  // Always fetch selected sheds first if they exist
  // But only include them if they belong to the filtered farms (if farm filter is applied)
  if (selectedShedIds.length > 0) {
    const selectedShedQuery = { _id: { $in: selectedShedIds } };

    // If farm filter is applied, only include selected sheds that belong to those farms
    if (farmConditions.length > 0) {
      selectedSheds = await ShedModel.find({
        $and: [selectedShedQuery, ...farmConditions],
      })
        .select("_id name")
        .populate("farmId", "name");
    } else {
      // If no farm filter, include all selected sheds
      selectedSheds = await ShedModel.find(selectedShedQuery)
        .select("_id name")
        .populate("farmId", "name");
    }
  }

  // If there's a search query, get search results
  if (typeof search === "string" && search.trim()) {
    const searchQuery = { name: { $regex: search.trim(), $options: "i" } };
    const finalQuery =
      farmConditions.length > 0
        ? { $and: [searchQuery, ...farmConditions] }
        : searchQuery;

    sheds = await ShedModel.find(finalQuery)
      .select("_id name")
      .populate("farmId", "name")
      .sort({ name: 1 })
      .limit(10);
  } else {
    // If no search query, get default sheds
    // We need to account for selected sheds, so we might need more than 10
    const limitForDefault = selectedShedIds.length > 0 ? 15 : 10;
    const finalQuery =
      farmConditions.length > 0 ? { $and: farmConditions } : {};

    sheds = await ShedModel.find(finalQuery)
      .select("_id name")
      .populate("farmId", "name")
      .sort({ name: 1 })
      .limit(limitForDefault);
  }

  // Combine selected sheds with search/default results
  const combinedSheds = [...selectedSheds, ...sheds];

  // Remove duplicates and sort
  const uniqueSheds = combinedSheds.filter(
    (shed, index, self) =>
      index === self.findIndex((s) => s._id.toString() === shed._id.toString())
  );

  // Sort by name and limit to 10, but ensure selected sheds are included
  const sortedSheds = uniqueSheds.sort((a, b) => a.name.localeCompare(b.name));

  // If we have selected sheds, prioritize them and fill the rest with other sheds
  let finalSheds = [];
  if (selectedShedIds.length > 0) {
    // Add selected sheds first
    const selectedShedsInResults = sortedSheds.filter((shed) =>
      selectedShedIds.includes(shed._id.toString())
    );
    // Add non-selected sheds to fill up to 10
    const otherSheds = sortedSheds.filter(
      (shed) => !selectedShedIds.includes(shed._id.toString())
    );
    finalSheds = [...selectedShedsInResults, ...otherSheds].slice(0, 10);
  } else {
    finalSheds = sortedSheds.slice(0, 10);
  }

  res.status(200).json({
    status: "success",
    message: "Sheds fetched successfully",
    data: finalSheds,
  });
});

export const getShedById = asyncHandler(async (req, res, next) => {
  const shed = await ShedModel.findById(req.params.shedId).populate(
    "farmId",
    "name supervisor"
  );

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

  // Validate that all farmIds exist
  const farmIds = [...new Set(shedsData.map((shed) => shed.farmId))];
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

export const createDummySheds = asyncHandler(async (req, res, next) => {
  const { count = 10 } = req.query;
  const countNum = Math.min(Math.max(parseInt(count, 10) || 10, 1), 100); // Limit between 1-100

  // Get existing farms
  const farms = await FarmModel.find({}).select("_id name");

  if (farms.length === 0) {
    const error = new AppError(
      "No farms found. Please create farms first.",
      400,
      "NO_FARMS_FOUND",
      true
    );
    return next(error);
  }

  const dummySheds = [];
  const shedNames = [
    "Shed A",
    "Shed B",
    "Shed C",
    "Shed D",
    "Shed E",
    "Shed F",
    "Shed G",
    "Shed H",
    "Shed I",
    "Shed J",
    "Shed K",
    "Shed L",
    "Shed M",
    "Shed N",
    "Shed O",
    "Shed P",
    "Shed Q",
    "Shed R",
    "Shed S",
    "Shed T",
    "Shed U",
    "Shed V",
    "Shed W",
    "Shed X",
    "Shed Y",
    "Shed Z",
    "North Shed",
    "South Shed",
    "East Shed",
    "West Shed",
  ];

  const capacityOptions = [
    500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000,
  ];

  for (let i = 0; i < countNum; i++) {
    const farm = farms[i % farms.length];
    const shedName = shedNames[i % shedNames.length];
    const capacity =
      capacityOptions[Math.floor(Math.random() * capacityOptions.length)];

    // Add unique suffix if we need more sheds than available names
    const uniqueSuffix =
      i >= shedNames.length ? ` ${Math.floor(i / shedNames.length) + 1}` : "";

    // Generate random date between 2020 and 2025
    const startYear = 2020;
    const endYear = 2025;
    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    const randomDate = new Date(randomYear, randomMonth, randomDay);

    dummySheds.push({
      name: `${shedName}${uniqueSuffix}`,
      capacity: capacity,
      farmId: farm._id,
      createdAt: randomDate,
      updatedAt: randomDate,
    });
  }

  const sheds = await ShedModel.insertMany(dummySheds);

  res.status(201).json({
    status: "success",
    message: `${sheds.length} dummy sheds created successfully`,
    data: sheds,
  });
});

export const createShed = asyncHandler(async (req, res, next) => {
  const { farmId } = req.body;

  const farm = await FarmModel.findById(farmId);
  if (!farm) {
    const error = new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
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

export const deleteAllSheds = asyncHandler(async (req, res, next) => {
  const query = req.query;

  // Find all sheds based on query (if flockId is provided, filter by flockId)
  const sheds = await ShedModel.find(query);

  if (sheds.length === 0) {
    const error = new AppError(
      "No sheds found to delete",
      404,
      "NO_SHEDS_FOUND",
      true
    );
    return next(error);
  }

  const deletedShedsIds = sheds.map((shed) => shed._id);

  // Delete all ledgers associated with these sheds
  await LedgerModel.deleteMany({
    shedId: { $in: deletedShedsIds },
  });

  // Finally delete all sheds
  const deletedSheds = await ShedModel.deleteMany(query);

  if (deletedSheds.deletedCount === 0) {
    throw new AppError("No sheds deleted", 400, "NO_SHEDS_DELETED", true);
  }

  const message = query.farmId
    ? `All sheds and their associated ledgers deleted successfully for farm ${query.farmId}`
    : `All sheds and their associated ledgers deleted successfully`;

  res.status(200).json({
    status: "success",
    message: message,
    data: {
      deletedSheds: deletedSheds.deletedCount,
      deletedLedgers: "All related ledgers",
    },
  });
});

export const deleteBulkSheds = asyncHandler(async (req, res, next) => {
  const shedIds = req.body;

  // Validate input
  if (!Array.isArray(shedIds) || shedIds.length === 0) {
    throw new AppError(
      "Shed IDs array is required",
      400,
      "INVALID_SHED_IDS",
      true
    );
  }

  // Validate that all shedIds are valid ObjectIds
  const validShedIds = shedIds.filter(
    (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
  );

  if (validShedIds.length === 0) {
    throw new AppError(
      "No valid shed IDs provided",
      400,
      "INVALID_SHED_IDS",
      true
    );
  }

  // Check if sheds exist
  const existingSheds = await ShedModel.find({ _id: { $in: validShedIds } });
  if (existingSheds.length === 0) {
    throw new AppError(
      "No sheds found with provided IDs",
      404,
      "SHEDS_NOT_FOUND",
      true
    );
  }

  // Delete all ledgers associated with these sheds
  const deletedLedgers = await LedgerModel.deleteMany({
    shedId: { $in: validShedIds },
  });

  // Finally delete the sheds themselves
  const deletedSheds = await ShedModel.deleteMany({
    _id: { $in: validShedIds },
  });

  res.status(200).json({
    status: "success",
    message: `Successfully deleted ${validShedIds.length} sheds and their associated data`,
    data: {
      deletedSheds: deletedSheds.deletedCount,
      deletedLedgers: deletedLedgers.deletedCount,
    },
  });
});

export const deleteShedById = asyncHandler(async (req, res, next) => {
  const { shedId } = req.params;

  // Check if shed exists
  const shed = await ShedModel.findById(shedId);
  if (!shed) {
    const error = new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
    return next(error);
  }

  // Delete all ledgers associated with this shed
  await LedgerModel.deleteMany({ shedId: shedId });

  // Finally delete the shed
  await ShedModel.findByIdAndDelete(shedId);

  res.status(200).json({
    status: "success",
    message: `Shed with id ${shedId} and all its associated ledgers deleted successfully`,
    data: {
      _id: shed._id,
    },
  });
});
