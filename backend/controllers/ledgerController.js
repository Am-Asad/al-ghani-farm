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

  // Validate that shed belongs to the flock
  if (shed.flockId.toString() !== flockId) {
    throw new AppError(
      "Shed does not belong to the specified flock",
      400,
      "INVALID_SHED_FLOCK_RELATIONSHIP",
      true
    );
  }

  return { farm, flock, shed, buyer };
};

export const getAllLedgers = asyncHandler(async (req, res) => {
  const { farmId, flockId, shedId, buyerId } = req.query;
  const query = {};
  if (farmId) query.farmId = farmId;
  if (flockId) query.flockId = flockId;
  if (shedId) query.shedId = shedId;
  if (buyerId) query.buyerId = buyerId;

  // Get ledgers with populated references for better data
  const ledgers = await LedgerModel.find(query)
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    message: "Ledgers fetched successfully",
    data: ledgers.map((ledger) => {
      const ledgerObj = ledger.toObject();
      // Calculate balance for each ledger
      ledgerObj.balance = ledgerObj.totalAmount - ledgerObj.amountPaid;
      return ledgerObj;
    }),
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
  await LedgerModel.findByIdAndDelete(ledgerId);

  res.status(200).json({
    status: "success",
    message: `Ledger with id ${ledgerId} deleted successfully`,
    data: ledger.toObject(),
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
