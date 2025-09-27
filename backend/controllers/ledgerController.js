import { asyncHandler } from "../middleware/asyncHandler.js";
import { BuyerModel } from "../models/buyer.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";
import mongoose from "mongoose";

// Helper function to validate entity relationships
const validateEntityRelationships = async (
  farmId,
  flockId,
  shedId,
  buyerId
) => {
  // Validate that all entities exist
  const [farm, flock, shed, buyer] = await Promise.all([
    FarmModel.findById(farmId),
    FlockModel.findById(flockId),
    ShedModel.findById(shedId),
    BuyerModel.findById(buyerId),
  ]);

  if (!farm) {
    throw new AppError("Farm not found", 404, "FARM_NOT_FOUND", true);
  }
  if (!flock) {
    throw new AppError("Flock not found", 404, "FLOCK_NOT_FOUND", true);
  }
  if (!shed) {
    throw new AppError("Shed not found", 404, "SHED_NOT_FOUND", true);
  }
  if (!buyer) {
    throw new AppError("Buyer not found", 404, "BUYER_NOT_FOUND", true);
  }

  // Validate that flock belongs to the farm
  if (flock.farmId.toString() !== farmId) {
    throw new AppError(
      "Flock does not belong to the specified farm",
      400,
      "INVALID_FLOCK_FARM_RELATIONSHIP",
      true
    );
  }

  // Validate that shed belongs to the farm
  if (shed.farmId.toString() !== farmId) {
    throw new AppError(
      "Shed does not belong to the specified farm",
      400,
      "INVALID_SHED_FARM_RELATIONSHIP",
      true
    );
  }

  // Validate that flock has an allocation to the shed
  const hasAllocation = flock.allocations.some(
    (allocation) => allocation.shedId.toString() === shedId
  );
  if (!hasAllocation) {
    throw new AppError(
      "Flock does not have an allocation to the specified shed",
      400,
      "INVALID_FLOCK_SHED_ALLOCATION",
      true
    );
  }

  return { farm, flock, shed, buyer };
};

export const getAllLedgers = asyncHandler(async (req, res) => {
  const {
    search = "",
    limit = "10",
    page = "1",
    sortBy = "createdAt",
    sortOrder = "desc",
    farmId = "",
    flockId = "",
    shedId = "",
    buyerId = "",
    dateFrom = "",
    dateTo = "",
    paymentStatus = "",
    totalAmountMin = "",
    totalAmountMax = "",
    amountPaidMin = "",
    amountPaidMax = "",
    balanceMin = "",
    balanceMax = "",
    netWeightMin = "",
    netWeightMax = "",
  } = req.query;

  const limitNum = Math.max(parseInt(limit, 10) || 10, 0);
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const offsetNum = (pageNum - 1) * limitNum;

  const { items, total } = await LedgerModel.getAllLedgersPaginated({
    search,
    limit: limitNum,
    offset: offsetNum,
    sortBy,
    sortOrder,
    farmId,
    flockId,
    shedId,
    buyerId,
    dateFrom,
    dateTo,
    paymentStatus,
    totalAmountMin,
    totalAmountMax,
    amountPaidMin,
    amountPaidMax,
    balanceMin,
    balanceMax,
    netWeightMin,
    netWeightMax,
  });

  res.status(200).json({
    status: "success",
    message: "Ledgers fetched successfully",
    data: items,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount: total,
      hasMore: offsetNum + items.length < total,
    },
  });
});

export const getLedgerById = asyncHandler(async (req, res) => {
  const { ledgerId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    throw new AppError(
      "Invalid ledger ID format",
      400,
      "INVALID_LEDGER_ID",
      true
    );
  }

  const ledger = await LedgerModel.findById(ledgerId)
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber address");

  if (!ledger) {
    throw new AppError("Ledger not found", 404, "LEDGER_NOT_FOUND", true);
  }

  const ledgerObj = ledger.toObject();
  // Calculate balance for the ledger
  ledgerObj.balance = ledgerObj.totalAmount - ledgerObj.amountPaid;

  res.status(200).json({
    status: "success",
    message: "Ledger fetched successfully",
    data: ledgerObj,
  });
});

// Create single ledger
export const createLedger = asyncHandler(async (req, res) => {
  const { farmId, flockId, shedId, buyerId } = req.body;

  // Validate entity relationships
  await validateEntityRelationships(farmId, flockId, shedId, buyerId);

  // Additional business logic validation
  const { emptyVehicleWeight, grossWeight, netWeight } = req.body;

  // Validate weight logic
  if (grossWeight <= emptyVehicleWeight) {
    throw new AppError(
      "Gross weight must be greater than empty vehicle weight",
      400,
      "INVALID_WEIGHT_LOGIC",
      true
    );
  }

  if (netWeight !== grossWeight - emptyVehicleWeight) {
    throw new AppError(
      "Net weight must be equal to gross weight minus empty vehicle weight",
      400,
      "INVALID_NET_WEIGHT_CALCULATION",
      true
    );
  }

  // Validate total amount calculation
  const { rate, totalAmount } = req.body;
  const calculatedTotal = netWeight * rate;
  if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
    // Allow for small floating point differences
    throw new AppError(
      "Total amount does not match calculated amount (net weight × rate)",
      400,
      "INVALID_TOTAL_AMOUNT_CALCULATION",
      true
    );
  }

  const ledger = await LedgerModel.create(req.body);

  // Populate the created ledger for response
  const populatedLedger = await LedgerModel.findById(ledger._id)
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber");

  res.status(201).json({
    status: "success",
    message: "Ledger created successfully",
    data: populatedLedger.toObject(),
  });
});

// Create bulk ledgers
export const createBulkLedgers = asyncHandler(async (req, res) => {
  const ledgersData = req.body;

  if (!Array.isArray(ledgersData) || ledgersData.length === 0) {
    throw new AppError(
      "Ledgers data must be a non-empty array",
      400,
      "INVALID_BULK_DATA",
      true
    );
  }

  // Validate each ledger entry
  for (let i = 0; i < ledgersData.length; i++) {
    const ledgerData = ledgersData[i];
    const {
      farmId,
      flockId,
      shedId,
      buyerId,
      emptyVehicleWeight,
      grossWeight,
      netWeight,
      rate,
      totalAmount,
    } = ledgerData;

    // Validate entity relationships for each entry
    await validateEntityRelationships(farmId, flockId, shedId, buyerId);

    // Validate weight logic
    if (grossWeight <= emptyVehicleWeight) {
      throw new AppError(
        `Ledger entry ${
          i + 1
        }: Gross weight must be greater than empty vehicle weight`,
        400,
        "INVALID_WEIGHT_LOGIC",
        true
      );
    }

    if (netWeight !== grossWeight - emptyVehicleWeight) {
      throw new AppError(
        `Ledger entry ${
          i + 1
        }: Net weight must equal gross weight minus empty vehicle weight`,
        400,
        "INVALID_NET_WEIGHT_CALCULATION",
        true
      );
    }

    // Validate total amount calculation
    const calculatedTotal = netWeight * rate;
    if (Math.abs(totalAmount - calculatedTotal) > 0.01) {
      throw new AppError(
        `Ledger entry ${
          i + 1
        }: Total amount does not match calculated amount (net weight × rate)`,
        400,
        "INVALID_TOTAL_AMOUNT_CALCULATION",
        true
      );
    }
  }

  const ledgers = await LedgerModel.insertMany(ledgersData);

  // Populate the created ledgers for response
  const populatedLedgers = await LedgerModel.find({
    _id: { $in: ledgers.map((ledger) => ledger._id) },
  })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber");

  res.status(201).json({
    status: "success",
    message: `${ledgers.length} ledgers created successfully`,
    data: populatedLedgers.map((ledger) => ledger.toObject()),
  });
});

export const createDummyLedgers = asyncHandler(async (req, res) => {
  const { count = 10 } = req.query;
  const countNum = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50); // Limit between 1-50

  // Get existing entities
  const farms = await FarmModel.find({}).select("_id name");
  const flocks = await FlockModel.find({}).select("_id name farmId");
  const sheds = await ShedModel.find({}).select("_id name farmId");
  const buyers = await BuyerModel.find({}).select("_id name");

  if (
    farms.length === 0 ||
    flocks.length === 0 ||
    sheds.length === 0 ||
    buyers.length === 0
  ) {
    throw new AppError(
      "Missing required entities. Please ensure farms, flocks, sheds, and buyers exist.",
      400,
      "MISSING_ENTITIES",
      true
    );
  }

  const dummyLedgers = [];
  const vehicleNumbers = [
    "ABC-123",
    "XYZ-456",
    "DEF-789",
    "GHI-012",
    "JKL-345",
    "MNO-678",
    "PQR-901",
    "STU-234",
    "VWX-567",
    "YZA-890",
    "BCD-123",
    "EFG-456",
    "HIJ-789",
    "KLM-012",
    "NOP-345",
    "QRS-678",
  ];

  const driverNames = [
    "Muhammad Ali",
    "Ahmed Hassan",
    "Fatima Khan",
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

  const accountantNames = [
    "Accountant Ali",
    "Accountant Khan",
    "Accountant Malik",
    "Accountant Sheikh",
    "Accountant Ahmed",
    "Accountant Hassan",
    "Accountant Rizvi",
    "Accountant Fatima",
    "Accountant Aisha",
    "Accountant Omar",
  ];

  const rateOptions = [150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250];

  // Generate Pakistani phone numbers for drivers
  const generatePhoneNumber = (index) => {
    const prefixes = [
      "0300",
      "0301",
      "0302",
      "0303",
      "0304",
      "0305",
      "0306",
      "0307",
      "0308",
      "0309",
    ];
    const prefix = prefixes[index % prefixes.length];
    const suffix = String(Math.floor(Math.random() * 10000000)).padStart(
      7,
      "0"
    );
    return `${prefix}${suffix}`;
  };

  for (let i = 0; i < countNum; i++) {
    const farm = farms[i % farms.length];
    const buyer = buyers[i % buyers.length];

    // Find flocks and sheds for this farm
    const farmFlocks = flocks.filter(
      (flock) => flock.farmId.toString() === farm._id.toString()
    );
    const farmSheds = sheds.filter(
      (shed) => shed.farmId.toString() === farm._id.toString()
    );

    if (farmFlocks.length === 0 || farmSheds.length === 0) {
      continue; // Skip if no flocks or sheds for this farm
    }

    const flock = farmFlocks[Math.floor(Math.random() * farmFlocks.length)];
    const shed = farmSheds[Math.floor(Math.random() * farmSheds.length)];

    const vehicleNumber = vehicleNumbers[i % vehicleNumbers.length];
    const driverName = driverNames[i % driverNames.length];
    const driverContact = generatePhoneNumber(i);
    const accountantName = accountantNames[i % accountantNames.length];

    // Generate weights
    const emptyVehicleWeight = Math.floor(Math.random() * 2000) + 1000; // 1000-3000 kg
    const netWeight = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 kg
    const grossWeight = emptyVehicleWeight + netWeight;

    // Generate number of birds (roughly 1 bird per 2-3 kg)
    const numberOfBirds = Math.floor(netWeight / (2 + Math.random()));

    const rate = rateOptions[Math.floor(Math.random() * rateOptions.length)];
    const totalAmount = netWeight * rate;

    // Generate amount paid (0 to total amount)
    const amountPaid = Math.floor(Math.random() * (totalAmount + 1));

    // Generate random date between 2020 and 2025
    const startYear = 2020;
    const endYear = 2025;
    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    const date = new Date(randomYear, randomMonth, randomDay);

    dummyLedgers.push({
      farmId: farm._id,
      flockId: flock._id,
      shedId: shed._id,
      buyerId: buyer._id,
      vehicleNumber: vehicleNumber,
      driverName: driverName,
      driverContact: driverContact,
      accountantName: accountantName,
      emptyVehicleWeight: emptyVehicleWeight,
      grossWeight: grossWeight,
      netWeight: netWeight,
      numberOfBirds: numberOfBirds,
      rate: rate,
      totalAmount: totalAmount,
      amountPaid: amountPaid,
      date: date,
      createdAt: date,
      updatedAt: date,
    });
  }

  if (dummyLedgers.length === 0) {
    throw new AppError(
      "No valid ledgers could be created. Ensure farms have associated flocks and sheds.",
      400,
      "NO_VALID_LEDGERS",
      true
    );
  }

  const ledgers = await LedgerModel.insertMany(dummyLedgers);

  // Populate the created ledgers for response
  const populatedLedgers = await LedgerModel.find({
    _id: { $in: ledgers.map((ledger) => ledger._id) },
  })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber");

  res.status(201).json({
    status: "success",
    message: `${ledgers.length} dummy ledgers created successfully`,
    data: populatedLedgers.map((ledger) => ledger.toObject()),
  });
});

// Update ledger
export const updateLedgerById = asyncHandler(async (req, res) => {
  const { ledgerId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    throw new AppError(
      "Invalid ledger ID format",
      400,
      "INVALID_LEDGER_ID",
      true
    );
  }

  // Check if ledger exists
  const existingLedger = await LedgerModel.findById(ledgerId);
  if (!existingLedger) {
    throw new AppError("Ledger not found", 404, "LEDGER_NOT_FOUND", true);
  }

  // If updating entity relationships, validate them
  const { farmId, flockId, shedId, buyerId } = req.body;
  if (farmId || flockId || shedId || buyerId) {
    const finalFarmId = farmId || existingLedger.farmId;
    const finalFlockId = flockId || existingLedger.flockId;
    const finalShedId = shedId || existingLedger.shedId;
    const finalBuyerId = buyerId || existingLedger.buyerId;

    await validateEntityRelationships(
      finalFarmId,
      finalFlockId,
      finalShedId,
      finalBuyerId
    );
  }

  // If updating weights or amounts, validate business logic
  const { emptyVehicleWeight, grossWeight, netWeight, rate, totalAmount } =
    req.body;

  if (
    emptyVehicleWeight !== undefined ||
    grossWeight !== undefined ||
    netWeight !== undefined
  ) {
    const finalEmptyWeight =
      emptyVehicleWeight !== undefined
        ? emptyVehicleWeight
        : existingLedger.emptyVehicleWeight;
    const finalGrossWeight =
      grossWeight !== undefined ? grossWeight : existingLedger.grossWeight;
    const finalNetWeight =
      netWeight !== undefined ? netWeight : existingLedger.netWeight;

    if (finalGrossWeight <= finalEmptyWeight) {
      throw new AppError(
        "Gross weight must be greater than empty vehicle weight",
        400,
        "INVALID_WEIGHT_LOGIC",
        true
      );
    }

    if (finalNetWeight !== finalGrossWeight - finalEmptyWeight) {
      throw new AppError(
        "Net weight must equal gross weight minus empty vehicle weight",
        400,
        "INVALID_NET_WEIGHT_CALCULATION",
        true
      );
    }
  }

  if (rate !== undefined || totalAmount !== undefined) {
    const finalNetWeight =
      netWeight !== undefined ? netWeight : existingLedger.netWeight;
    const finalRate = rate !== undefined ? rate : existingLedger.rate;
    const finalTotalAmount =
      totalAmount !== undefined ? totalAmount : existingLedger.totalAmount;

    const calculatedTotal = finalNetWeight * finalRate;
    if (Math.abs(finalTotalAmount - calculatedTotal) > 0.01) {
      throw new AppError(
        "Total amount does not match calculated amount (net weight × rate)",
        400,
        "INVALID_TOTAL_AMOUNT_CALCULATION",
        true
      );
    }
  }

  const ledger = await LedgerModel.findByIdAndUpdate(
    ledgerId,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber");

  res.status(200).json({
    status: "success",
    message: "Ledger updated successfully",
    data: ledger.toObject(),
  });
});

// Delete ledger
export const deleteLedgerById = asyncHandler(async (req, res, next) => {
  const { ledgerId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(ledgerId)) {
    const error = new AppError(
      "Invalid ledger ID format",
      400,
      "INVALID_LEDGER_ID",
      true
    );
    return next(error);
  }

  // Delete the ledger
  const deletedLedger = await LedgerModel.findByIdAndDelete(ledgerId);

  res.status(200).json({
    status: "success",
    message: `Ledger with id ${ledgerId} deleted successfully`,
    data: deletedLedger ? deletedLedger.toObject() : null,
  });
});

// Delete all ledgers
export const deleteAllLedgers = asyncHandler(async (req, res, next) => {
  const { farmId, flockId, shedId, buyerId } = req.query;

  // Build query object based on provided parameters
  const query = {};
  if (farmId) query.farmId = farmId;
  if (flockId) query.flockId = flockId;
  if (shedId) query.shedId = shedId;
  if (buyerId) query.buyerId = buyerId;

  // Find ledgers that match the query
  const ledgers = await LedgerModel.find(query);

  if (ledgers.length === 0) {
    const error = new AppError(
      "No ledgers found to delete",
      404,
      "NO_LEDGERS_FOUND",
      true
    );
    return next(error);
  }

  // Delete all ledgers matching the query
  const result = await LedgerModel.deleteMany(query);

  if (result.deletedCount === 0) {
    throw new AppError("No ledgers deleted", 400, "NO_LEDGERS_DELETED", true);
  }

  // Generate appropriate message based on query parameters
  let message = `${result.deletedCount} ledgers deleted successfully`;
  const queryParams = [];
  if (farmId) queryParams.push(`farm ${farmId}`);
  if (flockId) queryParams.push(`flock ${flockId}`);
  if (shedId) queryParams.push(`shed ${shedId}`);
  if (buyerId) queryParams.push(`buyer ${buyerId}`);

  if (queryParams.length > 0) {
    message = `${
      result.deletedCount
    } ledgers deleted successfully for ${queryParams.join(", ")}`;
  }

  res.status(200).json({
    status: "success",
    message: message,
    data: {
      deletedCount: result.deletedCount,
      queryParams: queryParams.length > 0 ? queryParams : "All ledgers",
    },
  });
});

export const deleteBulkLedgers = asyncHandler(async (req, res, next) => {
  const ledgerIds = req.body;

  // Validate input
  if (!Array.isArray(ledgerIds) || ledgerIds.length === 0) {
    throw new AppError(
      "Ledger IDs array is required",
      400,
      "INVALID_LEDGER_IDS",
      true
    );
  }

  // Validate that all ledgerIds are valid ObjectIds
  const validLedgerIds = ledgerIds.filter(
    (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
  );

  if (validLedgerIds.length === 0) {
    throw new AppError(
      "No valid ledger IDs provided",
      400,
      "INVALID_LEDGER_IDS",
      true
    );
  }

  // Check if ledgers exist
  const existingLedgers = await LedgerModel.find({
    _id: { $in: validLedgerIds },
  });
  if (existingLedgers.length === 0) {
    throw new AppError(
      "No ledgers found with provided IDs",
      404,
      "LEDGERS_NOT_FOUND",
      true
    );
  }

  // Delete the ledgers themselves
  const deletedLedgers = await LedgerModel.deleteMany({
    _id: { $in: validLedgerIds },
  });

  res.status(200).json({
    status: "success",
    message: `Successfully deleted ${validLedgerIds.length} ledgers`,
    data: {
      deletedLedgers: deletedLedgers.deletedCount,
    },
  });
});
