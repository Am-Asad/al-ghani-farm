import mongoose from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";

export const getAllFlocks = asyncHandler(async (req, res) => {
  const {
    search = "",
    limit = "10",
    page = "1",
    sortBy = "createdAt",
    sortOrder = "desc",
    farmId = "",
    status = "",
    capacityMin = "",
    capacityMax = "",
    dateFrom = "",
    dateTo = "",
  } = req.query;

  const limitNum = Math.max(parseInt(limit, 10) || 10, 0);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const offsetNum = (pageNum - 1) * limitNum;

  // Allow a safe subset of fields for sorting
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "totalChicks",
    "name",
    "startDate",
    "endDate",
  ];
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
    // totalChicks exact match if numeric
    const totalChicksNum = parseInt(search, 10);
    if (!Number.isNaN(totalChicksNum))
      searchConditions.push({ totalChicks: totalChicksNum });
  }

  // capacity range filter (using totalChicks)
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
    ...(status && typeof status === "string" && status.trim() !== ""
      ? [
          {
            $match: {
              status: status.trim(),
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
        ? [{ $match: { startDate: dateRange } }]
        : [];
    })(),
    ...(Object.keys(capacityRange).length > 0
      ? [
          {
            $match: { totalChicks: capacityRange },
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
    // Populate allocations.shedId
    {
      $lookup: {
        from: "sheds",
        let: { shedIds: "$allocations.shedId" },
        pipeline: [
          { $match: { $expr: { $in: ["$_id", "$$shedIds"] } } },
          { $project: { _id: 1, name: 1, capacity: 1 } },
        ],
        as: "shedDetails",
      },
    },
    {
      $addFields: {
        allocations: {
          $map: {
            input: "$allocations",
            as: "allocation",
            in: {
              chicks: "$$allocation.chicks",
              shedId: {
                $let: {
                  vars: {
                    shedDetail: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$shedDetails",
                            cond: {
                              $eq: ["$$this._id", "$$allocation.shedId"],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    _id: "$$shedDetail._id",
                    name: "$$shedDetail.name",
                    capacity: "$$shedDetail.capacity",
                  },
                },
              },
            },
          },
        },
      },
    },
    { $project: { shedDetails: 0 } },
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

  const result = await FlockModel.aggregate(pipeline).then(
    (resAgg) => resAgg[0] || { items: [], total: 0 }
  );

  const { items, total } = result;

  res.status(200).json({
    status: "success",
    message: "Flocks fetched successfully",
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount: total,
      hasMore: offsetNum + items.length < total,
    },
  });
});

export const getFlockById = asyncHandler(async (req, res, next) => {
  const { flockId } = req.params;
  const flock = await FlockModel.findById(flockId)
    .populate("farmId", "name supervisor")
    .populate("allocations.shedId", "name capacity");

  if (!flock) {
    const error = new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
    return next(error);
  }

  res.status(200).json({
    status: "success",
    message: "Flock fetched successfully",
    data: flock,
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

export const createDummyFlocks = asyncHandler(async (req, res, next) => {
  const { count = 10 } = req.query;
  const countNum = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50); // Limit between 1-50

  // Get existing farms and sheds
  const farms = await FarmModel.find({}).select("_id name");
  const sheds = await ShedModel.find({}).select("_id name farmId");

  if (farms.length === 0) {
    const error = new AppError(
      "No farms found. Please create farms first.",
      400,
      "NO_FARMS_FOUND",
      true
    );
    return next(error);
  }

  if (sheds.length === 0) {
    const error = new AppError(
      "No sheds found. Please create sheds first.",
      400,
      "NO_SHEDS_FOUND",
      true
    );
    return next(error);
  }

  const dummyFlocks = [];
  const flockNames = [
    "Batch A-001",
    "Batch B-002",
    "Batch C-003",
    "Batch D-004",
    "Batch E-005",
    "Batch F-006",
    "Batch G-007",
    "Batch H-008",
    "Batch I-009",
    "Batch J-010",
    "Batch K-011",
    "Batch L-012",
    "Batch M-013",
    "Batch N-014",
    "Batch O-015",
    "Batch P-016",
    "Batch Q-017",
    "Batch R-018",
    "Batch S-019",
    "Batch T-020",
  ];

  const statuses = ["active", "completed"];
  const totalChicksOptions = [
    1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000,
  ];

  for (let i = 0; i < countNum; i++) {
    const farm = farms[i % farms.length];
    const farmSheds = sheds.filter(
      (shed) => shed.farmId.toString() === farm._id.toString()
    );

    if (farmSheds.length === 0) {
      continue; // Skip if no sheds for this farm
    }

    const flockName = flockNames[i % flockNames.length];
    const uniqueSuffix =
      i >= flockNames.length ? `-${Math.floor(i / flockNames.length) + 1}` : "";
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const totalChicks =
      totalChicksOptions[Math.floor(Math.random() * totalChicksOptions.length)];

    // Create allocations for this flock
    const allocations = [];
    let remainingChicks = totalChicks;
    const numSheds = Math.min(
      farmSheds.length,
      Math.floor(Math.random() * 3) + 1
    ); // 1-3 sheds

    for (let j = 0; j < numSheds && remainingChicks > 0; j++) {
      const shed = farmSheds[j];
      const chicksForShed =
        j === numSheds - 1
          ? remainingChicks
          : Math.floor(Math.random() * remainingChicks) + 1;

      allocations.push({
        shedId: shed._id,
        chicks: chicksForShed,
      });

      remainingChicks -= chicksForShed;
    }

    // Generate dates between 2020 and 2025
    const startYear = 2020;
    const endYear = 2025;
    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    const startDate = new Date(randomYear, randomMonth, randomDay);

    let endDate = null;
    if (status === "completed") {
      // End date should be after start date, within the same year or next year
      const endYear = startDate.getFullYear() + (Math.random() > 0.7 ? 1 : 0); // 30% chance to go to next year
      const endMonth = Math.floor(Math.random() * 12);
      const endDay = Math.floor(Math.random() * 28) + 1;
      endDate = new Date(endYear, endMonth, endDay);

      // Ensure end date is after start date
      if (endDate <= startDate) {
        endDate = new Date(startDate);
        endDate.setDate(
          endDate.getDate() + Math.floor(Math.random() * 100) + 30
        ); // 30-130 days later
      }
    }

    dummyFlocks.push({
      name: `${flockName}${uniqueSuffix}`,
      status: status,
      startDate: startDate,
      endDate: endDate,
      totalChicks: totalChicks,
      allocations: allocations,
      farmId: farm._id,
      createdAt: startDate,
      updatedAt: startDate,
    });
  }

  if (dummyFlocks.length === 0) {
    const error = new AppError(
      "No valid flocks could be created. Ensure farms have associated sheds.",
      400,
      "NO_VALID_FLOCKS",
      true
    );
    return next(error);
  }

  const flocks = await FlockModel.insertMany(dummyFlocks);

  res.status(201).json({
    status: "success",
    message: `${flocks.length} dummy flocks created successfully`,
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

  // Delete all ledgers associated with these flocks
  await LedgerModel.deleteMany({
    flockId: { $in: deletedFlocksIds },
  });

  // Finally delete all flocks
  const deletedFlocks = await FlockModel.deleteMany(query);

  if (deletedFlocks.deletedCount === 0) {
    throw new AppError("No flocks deleted", 400, "NO_FLOCKS_DELETED", true);
  }

  const message = query.farmId
    ? `All flocks and their associated ledgers deleted successfully for farm ${query.farmId}`
    : `All flocks and their associated ledgers deleted successfully`;

  res.status(200).json({
    status: "success",
    message: message,
    data: {
      deletedFlocks: deletedFlocks.deletedCount,
      deletedLedgers: "All related ledgers",
    },
  });
});

export const deleteBulkFlocks = asyncHandler(async (req, res, next) => {
  const flockIds = req.body;

  // Validate input
  if (!Array.isArray(flockIds) || flockIds.length === 0) {
    throw new AppError(
      "Flock IDs array is required",
      400,
      "INVALID_FLOCK_IDS",
      true
    );
  }

  // Validate that all flockIds are valid ObjectIds
  const validFlockIds = flockIds.filter(
    (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
  );

  if (validFlockIds.length === 0) {
    throw new AppError(
      "No valid flock IDs provided",
      400,
      "INVALID_FLOCK_IDS",
      true
    );
  }

  // Check if flocks exist
  const existingFlocks = await FlockModel.find({ _id: { $in: validFlockIds } });
  if (existingFlocks.length === 0) {
    throw new AppError(
      "No flocks found with provided IDs",
      404,
      "FLOCKS_NOT_FOUND",
      true
    );
  }

  // Delete all ledgers associated with these flocks
  const deletedLedgers = await LedgerModel.deleteMany({
    flockId: { $in: validFlockIds },
  });

  // Finally delete the flocks themselves
  const deletedFlocks = await FlockModel.deleteMany({
    _id: { $in: validFlockIds },
  });

  res.status(200).json({
    status: "success",
    message: `Successfully deleted ${validFlockIds.length} flocks and their associated data`,
    data: {
      deletedFlocks: deletedFlocks.deletedCount,
      deletedLedgers: deletedLedgers.deletedCount,
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

  // Delete all ledgers associated with this flock
  await LedgerModel.deleteMany({ flockId: flockId });

  // Finally delete the flock
  await FlockModel.findByIdAndDelete(flockId);

  res.status(200).json({
    status: "success",
    message: `Flock with id ${flockId} and all related ledgers deleted successfully`,
    data: undefined,
  });
});

export const getFlocksForDropdown = asyncHandler(async (req, res) => {
  const { search = "", farmId = "", flockId = "", shedId = "" } = req.query;

  const andConditions = [];

  if (typeof farmId === "string" && farmId.trim()) {
    andConditions.push({ farmId });
  }

  if (typeof flockId === "string" && flockId.trim()) {
    andConditions.push({ _id: flockId });
  }

  if (typeof shedId === "string" && shedId.trim()) {
    // Flock allocations contain shedId; ensure at least one allocation with this shed
    andConditions.push({ "allocations.shedId": shedId });
  }

  if (typeof search === "string" && search.trim()) {
    andConditions.push({ name: { $regex: search.trim(), $options: "i" } });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const flocks = await FlockModel.find(query)
    .select("_id name")
    .populate("farmId", "name")
    .sort({ name: 1 })
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "Flocks fetched successfully",
    data: flocks,
  });
});
