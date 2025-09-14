import { asyncHandler } from "../middleware/asyncHandler.js";
import { BuyerModel } from "../models/buyer.js";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";
import { parseDateToISO } from "../utils/dateUtils.js";
import mongoose from "mongoose";

// ==================== BUYER REPORTS ====================

// Get buyer daily report
export const getBuyerDailyReport = asyncHandler(async (req, res) => {
  const { buyerId, date } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(buyerId)) {
    throw new AppError(
      "Invalid buyer ID format",
      400,
      "INVALID_BUYER_ID",
      true
    );
  }

  // Parse and validate date using date-fns utility
  let parsedDate;
  try {
    parsedDate = parseDateToISO(date);
  } catch (error) {
    throw new AppError(error.message, 400, "INVALID_DATE_FORMAT", true);
  }

  const {
    startOfDay: startOfDayISO,
    endOfDay: endOfDayISO,
    date: formattedDate,
  } = parsedDate;
  const startOfDay = new Date(startOfDayISO);
  const endOfDay = new Date(endOfDayISO);

  // Use aggregation to get summary and transactions in one query
  const result = await LedgerModel.aggregate([
    // Match ledgers for specific buyer and date
    {
      $match: {
        buyerId: new mongoose.Types.ObjectId(buyerId),
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    // Lookup buyer details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [
          {
            $project: {
              name: 1,
              contactNumber: 1,
              address: 1,
            },
          },
        ],
      },
    },
    // Lookup farm details
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [
          {
            $project: {
              name: 1,
              supervisor: 1,
            },
          },
        ],
      },
    },
    // Lookup flock details
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [
          {
            $project: {
              name: 1,
              status: 1,
            },
          },
        ],
      },
    },
    // Lookup shed details
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [
          {
            $project: {
              name: 1,
              capacity: 1,
            },
          },
        ],
      },
    },
    // Add calculated fields
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group to calculate summary statistics
    {
      $group: {
        _id: null,
        buyer: { $first: "$buyerId" },
        transactions: { $push: "$$ROOT" },
        totalTransactions: { $sum: 1 },
        totalEmptyVehicleWeight: { $sum: "$emptyVehicleWeight" },
        totalGrossWeight: { $sum: "$grossWeight" },
        totalNetWeight: { $sum: "$netWeight" },
        totalBirds: { $sum: "$numberOfBirds" },
        totalRate: { $sum: "$rate" },
        totalAmount: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$amountPaid" },
        totalBalance: { $sum: "$balance" },
      },
    },
    // Project final structure
    {
      $project: {
        _id: 0,
        buyer: 1,
        summary: {
          totalTransactions: "$totalTransactions",
          totalEmptyVehicleWeight: "$totalEmptyVehicleWeight",
          totalGrossWeight: "$totalGrossWeight",
          totalNetWeight: "$totalNetWeight",
          totalBirds: "$totalBirds",
          totalRate: "$totalRate",
          totalAmount: "$totalAmount",
          totalPaid: "$totalPaid",
          totalBalance: "$totalBalance",
        },
        transactions: {
          $map: {
            input: "$transactions",
            as: "transaction",
            in: {
              _id: "$$transaction._id",
              date: "$$transaction.date",
              vehicleNumber: "$$transaction.vehicleNumber",
              driverName: "$$transaction.driverName",
              driverContact: "$$transaction.driverContact",
              accountantName: "$$transaction.accountantName",
              emptyVehicleWeight: "$$transaction.emptyVehicleWeight",
              grossWeight: "$$transaction.grossWeight",
              netWeight: "$$transaction.netWeight",
              numberOfBirds: "$$transaction.numberOfBirds",
              rate: "$$transaction.rate",
              totalAmount: "$$transaction.totalAmount",
              amountPaid: "$$transaction.amountPaid",
              balance: "$$transaction.balance",
              farmId: "$$transaction.farmId",
              flockId: "$$transaction.flockId",
              shedId: "$$transaction.shedId",
              buyerId: "$$transaction.buyerId",
              createdAt: "$$transaction.createdAt",
              updatedAt: "$$transaction.updatedAt",
            },
          },
        },
      },
    },
  ]);

  // Handle case when no transactions found
  if (result.length === 0) {
    const buyer = await BuyerModel.findById(buyerId).select(
      "name contactNumber address"
    );
    return res.status(200).json({
      status: "success",
      message: "Buyer daily report fetched successfully",
      data: {
        buyer: buyer ? buyer.toObject() : null,
        date: formattedDate,
        summary: {
          totalTransactions: 0,
          totalEmptyVehicleWeight: 0,
          totalGrossWeight: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalRate: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
        },
        transactions: [],
      },
    });
  }

  const reportData = result[0];

  res.status(200).json({
    status: "success",
    message: "Buyer daily report fetched successfully",
    data: {
      buyer: reportData.buyer,
      date: formattedDate,
      summary: reportData.summary,
      transactions: reportData.transactions,
    },
  });
});

// Get buyer overall report
export const getBuyerOverallReport = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(buyerId)) {
    throw new AppError(
      "Invalid buyer ID format",
      400,
      "INVALID_BUYER_ID",
      true
    );
  }

  // Use aggregation to get summary and transactions in one query
  const result = await LedgerModel.aggregate([
    // Match ledgers for specific buyer
    {
      $match: {
        buyerId: new mongoose.Types.ObjectId(buyerId),
      },
    },
    // Lookup buyer details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [
          {
            $project: {
              name: 1,
              contactNumber: 1,
              address: 1,
            },
          },
        ],
      },
    },
    // Lookup farm details
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [
          {
            $project: {
              name: 1,
              supervisor: 1,
            },
          },
        ],
      },
    },
    // Lookup flock details
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [
          {
            $project: {
              name: 1,
              status: 1,
            },
          },
        ],
      },
    },
    // Lookup shed details
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [
          {
            $project: {
              name: 1,
              capacity: 1,
            },
          },
        ],
      },
    },
    // Add calculated fields
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group to calculate summary statistics
    {
      $group: {
        _id: null,
        buyer: { $first: "$buyerId" },
        transactions: { $push: "$$ROOT" },
        totalTransactions: { $sum: 1 },
        totalEmptyVehicleWeight: { $sum: "$emptyVehicleWeight" },
        totalGrossWeight: { $sum: "$grossWeight" },
        totalNetWeight: { $sum: "$netWeight" },
        totalBirds: { $sum: "$numberOfBirds" },
        totalRate: { $sum: "$rate" },
        totalAmount: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$amountPaid" },
        totalBalance: { $sum: "$balance" },
        earliestDate: { $min: "$date" },
        latestDate: { $max: "$date" },
      },
    },
    // Project final structure
    {
      $project: {
        _id: 0,
        buyer: 1,
        summary: {
          totalTransactions: "$totalTransactions",
          totalEmptyVehicleWeight: "$totalEmptyVehicleWeight",
          totalGrossWeight: "$totalGrossWeight",
          totalNetWeight: "$totalNetWeight",
          totalBirds: "$totalBirds",
          totalRate: "$totalRate",
          totalAmount: "$totalAmount",
          totalPaid: "$totalPaid",
          totalBalance: "$totalBalance",
          dateRange: {
            from: {
              $dateToString: { format: "%Y-%m-%d", date: "$earliestDate" },
            },
            to: { $dateToString: { format: "%Y-%m-%d", date: "$latestDate" } },
          },
        },
        transactions: {
          $map: {
            input: "$transactions",
            as: "transaction",
            in: {
              _id: "$$transaction._id",
              date: "$$transaction.date",
              vehicleNumber: "$$transaction.vehicleNumber",
              driverName: "$$transaction.driverName",
              driverContact: "$$transaction.driverContact",
              accountantName: "$$transaction.accountantName",
              emptyVehicleWeight: "$$transaction.emptyVehicleWeight",
              grossWeight: "$$transaction.grossWeight",
              netWeight: "$$transaction.netWeight",
              numberOfBirds: "$$transaction.numberOfBirds",
              rate: "$$transaction.rate",
              totalAmount: "$$transaction.totalAmount",
              amountPaid: "$$transaction.amountPaid",
              balance: "$$transaction.balance",
              farmId: "$$transaction.farmId",
              flockId: "$$transaction.flockId",
              shedId: "$$transaction.shedId",
              buyerId: "$$transaction.buyerId",
              createdAt: "$$transaction.createdAt",
              updatedAt: "$$transaction.updatedAt",
            },
          },
        },
      },
    },
  ]);

  // Handle case when no transactions found
  if (result.length === 0) {
    const buyer = await BuyerModel.findById(buyerId).select(
      "name contactNumber address"
    );
    return res.status(200).json({
      status: "success",
      message: "Buyer overall report fetched successfully",
      data: {
        buyer: buyer ? buyer.toObject() : null,
        summary: {
          totalTransactions: 0,
          totalEmptyVehicleWeight: 0,
          totalGrossWeight: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalRate: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          dateRange: null,
        },
        transactions: [],
      },
    });
  }

  const reportData = result[0];

  res.status(200).json({
    status: "success",
    message: "Buyer overall report fetched successfully",
    data: {
      buyer: reportData.buyer,
      summary: reportData.summary,
      transactions: reportData.transactions,
    },
  });
});

// ==================== FARM REPORTS ====================

// Get farm daily report
export const getFarmDailyReport = asyncHandler(async (req, res) => {
  const { farmId, date } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(farmId)) {
    throw new AppError("Invalid farm ID format", 400, "INVALID_FARM_ID", true);
  }

  // Parse and validate date using date-fns utility
  let parsedDate;
  try {
    parsedDate = parseDateToISO(date);
  } catch (error) {
    throw new AppError(error.message, 400, "INVALID_DATE_FORMAT", true);
  }

  const {
    startOfDay: startOfDayISO,
    endOfDay: endOfDayISO,
    date: formattedDate,
  } = parsedDate;
  const startOfDay = new Date(startOfDayISO);
  const endOfDay = new Date(endOfDayISO);

  // Get ledgers for the specific farm and date
  const ledgers = await LedgerModel.find({
    farmId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber address")
    .sort({ date: -1 });

  // Calculate summary statistics
  const summary = {
    totalTransactions: ledgers.length,
    totalNetWeight: ledgers.reduce((sum, ledger) => sum + ledger.netWeight, 0),
    totalBirds: ledgers.reduce((sum, ledger) => sum + ledger.numberOfBirds, 0),
    totalAmount: ledgers.reduce((sum, ledger) => sum + ledger.totalAmount, 0),
    totalPaid: ledgers.reduce((sum, ledger) => sum + ledger.amountPaid, 0),
    totalBalance: ledgers.reduce(
      (sum, ledger) => sum + (ledger.totalAmount - ledger.amountPaid),
      0
    ),
    averageRate:
      ledgers.length > 0
        ? ledgers.reduce((sum, ledger) => sum + ledger.rate, 0) / ledgers.length
        : 0,
    averageNetWeight:
      ledgers.length > 0
        ? ledgers.reduce((sum, ledger) => sum + ledger.netWeight, 0) /
          ledgers.length
        : 0,
  };

  res.status(200).json({
    status: "success",
    message: "Farm daily report fetched successfully",
    data: {
      farm: ledgers.length > 0 ? ledgers[0].farmId : null,
      date: formattedDate,
      summary,
      transactions: ledgers.map((ledger) => ledger.toObject()),
    },
  });
});

// Get farm overall report
export const getFarmOverallReport = asyncHandler(async (req, res) => {
  const { farmId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(farmId)) {
    throw new AppError("Invalid farm ID format", 400, "INVALID_FARM_ID", true);
  }

  // Get all ledgers for the specific farm
  const ledgers = await LedgerModel.find({ farmId })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber address")
    .sort({ date: -1 });

  if (ledgers.length === 0) {
    // Return empty report if no transactions
    const { FarmModel } = await import("../models/farms.js");
    const farm = await FarmModel.findById(farmId);
    return res.status(200).json({
      status: "success",
      message: "Farm overall report fetched successfully",
      data: {
        farm: farm ? farm.toObject() : null,
        summary: {
          totalTransactions: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          averageRate: 0,
          averageNetWeight: 0,
          dateRange: null,
        },
        transactions: [],
      },
    });
  }

  // Calculate summary statistics
  const totalNetWeight = ledgers.reduce(
    (sum, ledger) => sum + ledger.netWeight,
    0
  );
  const totalBirds = ledgers.reduce(
    (sum, ledger) => sum + ledger.numberOfBirds,
    0
  );
  const totalAmount = ledgers.reduce(
    (sum, ledger) => sum + ledger.totalAmount,
    0
  );
  const totalPaid = ledgers.reduce((sum, ledger) => sum + ledger.amountPaid, 0);
  const totalBalance = totalAmount - totalPaid;
  const averageRate = totalAmount / totalNetWeight || 0;
  const averageNetWeight = totalNetWeight / ledgers.length;

  // Get date range
  const dates = ledgers.map((ledger) => new Date(ledger.date));
  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));

  const summary = {
    totalTransactions: ledgers.length,
    totalNetWeight,
    totalBirds,
    totalAmount,
    totalPaid,
    totalBalance,
    averageRate,
    averageNetWeight,
    dateRange: {
      from: earliestDate.toISOString().split("T")[0],
      to: latestDate.toISOString().split("T")[0],
    },
  };

  res.status(200).json({
    status: "success",
    message: "Farm overall report fetched successfully",
    data: {
      farm: ledgers[0].farmId,
      summary,
      transactions: ledgers.map((ledger) => ledger.toObject()),
    },
  });
});

// ==================== FLOCK REPORTS ====================

// Get flock daily report
export const getFlockDailyReport = asyncHandler(async (req, res) => {
  const { flockId, date } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(flockId)) {
    throw new AppError(
      "Invalid flock ID format",
      400,
      "INVALID_FLOCK_ID",
      true
    );
  }

  // Parse and validate date using date-fns utility
  let parsedDate;
  try {
    parsedDate = parseDateToISO(date);
  } catch (error) {
    throw new AppError(error.message, 400, "INVALID_DATE_FORMAT", true);
  }

  const {
    startOfDay: startOfDayISO,
    endOfDay: endOfDayISO,
    date: formattedDate,
  } = parsedDate;
  const startOfDay = new Date(startOfDayISO);
  const endOfDay = new Date(endOfDayISO);

  // Get ledgers for the specific flock and date
  const ledgers = await LedgerModel.find({
    flockId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber address")
    .sort({ date: -1 });

  // Calculate summary statistics
  const summary = {
    totalTransactions: ledgers.length,
    totalNetWeight: ledgers.reduce((sum, ledger) => sum + ledger.netWeight, 0),
    totalBirds: ledgers.reduce((sum, ledger) => sum + ledger.numberOfBirds, 0),
    totalAmount: ledgers.reduce((sum, ledger) => sum + ledger.totalAmount, 0),
    totalPaid: ledgers.reduce((sum, ledger) => sum + ledger.amountPaid, 0),
    totalBalance: ledgers.reduce(
      (sum, ledger) => sum + (ledger.totalAmount - ledger.amountPaid),
      0
    ),
    averageRate:
      ledgers.length > 0
        ? ledgers.reduce((sum, ledger) => sum + ledger.rate, 0) / ledgers.length
        : 0,
    averageNetWeight:
      ledgers.length > 0
        ? ledgers.reduce((sum, ledger) => sum + ledger.netWeight, 0) /
          ledgers.length
        : 0,
  };

  res.status(200).json({
    status: "success",
    message: "Flock daily report fetched successfully",
    data: {
      flock: ledgers.length > 0 ? ledgers[0].flockId : null,
      date: formattedDate,
      summary,
      transactions: ledgers.map((ledger) => ledger.toObject()),
    },
  });
});

// Get flock overall report
export const getFlockOverallReport = asyncHandler(async (req, res) => {
  const { flockId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(flockId)) {
    throw new AppError(
      "Invalid flock ID format",
      400,
      "INVALID_FLOCK_ID",
      true
    );
  }

  // Get all ledgers for the specific flock
  const ledgers = await LedgerModel.find({ flockId })
    .populate("farmId", "name supervisor")
    .populate("flockId", "name status")
    .populate("shedId", "name capacity")
    .populate("buyerId", "name contactNumber address")
    .sort({ date: -1 });

  if (ledgers.length === 0) {
    // Return empty report if no transactions
    const { FlockModel } = await import("../models/flocks.js");
    const flock = await FlockModel.findById(flockId);
    return res.status(200).json({
      status: "success",
      message: "Flock overall report fetched successfully",
      data: {
        flock: flock ? flock.toObject() : null,
        summary: {
          totalTransactions: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          averageRate: 0,
          averageNetWeight: 0,
          dateRange: null,
        },
        transactions: [],
      },
    });
  }

  // Calculate summary statistics
  const totalNetWeight = ledgers.reduce(
    (sum, ledger) => sum + ledger.netWeight,
    0
  );
  const totalBirds = ledgers.reduce(
    (sum, ledger) => sum + ledger.numberOfBirds,
    0
  );
  const totalAmount = ledgers.reduce(
    (sum, ledger) => sum + ledger.totalAmount,
    0
  );
  const totalPaid = ledgers.reduce((sum, ledger) => sum + ledger.amountPaid, 0);
  const totalBalance = totalAmount - totalPaid;
  const averageRate = totalAmount / totalNetWeight || 0;
  const averageNetWeight = totalNetWeight / ledgers.length;

  // Get date range
  const dates = ledgers.map((ledger) => new Date(ledger.date));
  const earliestDate = new Date(Math.min(...dates));
  const latestDate = new Date(Math.max(...dates));

  const summary = {
    totalTransactions: ledgers.length,
    totalNetWeight,
    totalBirds,
    totalAmount,
    totalPaid,
    totalBalance,
    averageRate,
    averageNetWeight,
    dateRange: {
      from: earliestDate.toISOString().split("T")[0],
      to: latestDate.toISOString().split("T")[0],
    },
  };

  res.status(200).json({
    status: "success",
    message: "Flock overall report fetched successfully",
    data: {
      flock: ledgers[0].flockId,
      summary,
      transactions: ledgers.map((ledger) => ledger.toObject()),
    },
  });
});

// ==================== SHED REPORTS ====================

// Get shed daily report
export const getShedDailyReport = asyncHandler(async (req, res) => {
  const { shedId, date } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(shedId)) {
    throw new AppError("Invalid shed ID format", 400, "INVALID_SHED_ID", true);
  }

  // Parse and validate date using date-fns utility
  let parsedDate;
  try {
    parsedDate = parseDateToISO(date);
  } catch (error) {
    throw new AppError(error.message, 400, "INVALID_DATE_FORMAT", true);
  }

  const {
    startOfDay: startOfDayISO,
    endOfDay: endOfDayISO,
    date: formattedDate,
  } = parsedDate;
  const startOfDay = new Date(startOfDayISO);
  const endOfDay = new Date(endOfDayISO);

  // Use aggregation to get summary and transactions in one query
  const result = await LedgerModel.aggregate([
    // Match ledgers for specific shed and date
    {
      $match: {
        shedId: new mongoose.Types.ObjectId(shedId),
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    // Lookup buyer details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [
          {
            $project: {
              name: 1,
              contactNumber: 1,
              address: 1,
            },
          },
        ],
      },
    },
    // Lookup farm details
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [
          {
            $project: {
              name: 1,
              supervisor: 1,
            },
          },
        ],
      },
    },
    // Lookup flock details
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [
          {
            $project: {
              name: 1,
              status: 1,
            },
          },
        ],
      },
    },
    // Lookup shed details
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [
          {
            $project: {
              name: 1,
              capacity: 1,
            },
          },
        ],
      },
    },
    // Add calculated fields
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group to calculate summary statistics
    {
      $group: {
        _id: null,
        shed: { $first: "$shedId" },
        transactions: { $push: "$$ROOT" },
        totalTransactions: { $sum: 1 },
        totalEmptyVehicleWeight: { $sum: "$emptyVehicleWeight" },
        totalGrossWeight: { $sum: "$grossWeight" },
        totalNetWeight: { $sum: "$netWeight" },
        totalBirds: { $sum: "$numberOfBirds" },
        totalRate: { $sum: "$rate" },
        totalAmount: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$amountPaid" },
        totalBalance: { $sum: "$balance" },
      },
    },
    // Project final structure
    {
      $project: {
        _id: 0,
        shed: 1,
        summary: {
          totalTransactions: "$totalTransactions",
          totalEmptyVehicleWeight: "$totalEmptyVehicleWeight",
          totalGrossWeight: "$totalGrossWeight",
          totalNetWeight: "$totalNetWeight",
          totalBirds: "$totalBirds",
          totalRate: "$totalRate",
          totalAmount: "$totalAmount",
          totalPaid: "$totalPaid",
          totalBalance: "$totalBalance",
        },
        transactions: {
          $map: {
            input: "$transactions",
            as: "transaction",
            in: {
              _id: "$$transaction._id",
              date: "$$transaction.date",
              vehicleNumber: "$$transaction.vehicleNumber",
              driverName: "$$transaction.driverName",
              driverContact: "$$transaction.driverContact",
              accountantName: "$$transaction.accountantName",
              emptyVehicleWeight: "$$transaction.emptyVehicleWeight",
              grossWeight: "$$transaction.grossWeight",
              netWeight: "$$transaction.netWeight",
              numberOfBirds: "$$transaction.numberOfBirds",
              rate: "$$transaction.rate",
              totalAmount: "$$transaction.totalAmount",
              amountPaid: "$$transaction.amountPaid",
              balance: "$$transaction.balance",
              farmId: "$$transaction.farmId",
              flockId: "$$transaction.flockId",
              shedId: "$$transaction.shedId",
              buyerId: "$$transaction.buyerId",
              createdAt: "$$transaction.createdAt",
              updatedAt: "$$transaction.updatedAt",
            },
          },
        },
      },
    },
  ]);

  // Handle case when no transactions found
  if (result.length === 0) {
    const { ShedModel } = await import("../models/sheds.js");
    const shed = await ShedModel.findById(shedId).select("name capacity");
    return res.status(200).json({
      status: "success",
      message: "Shed daily report fetched successfully",
      data: {
        shed: shed ? shed.toObject() : null,
        date: formattedDate,
        summary: {
          totalTransactions: 0,
          totalEmptyVehicleWeight: 0,
          totalGrossWeight: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalRate: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
        },
        transactions: [],
      },
    });
  }

  const reportData = result[0];

  res.status(200).json({
    status: "success",
    message: "Shed daily report fetched successfully",
    data: {
      shed: reportData.shed,
      date: formattedDate,
      summary: reportData.summary,
      transactions: reportData.transactions,
    },
  });
});

// Get shed overall report
export const getShedOverallReport = asyncHandler(async (req, res) => {
  const { shedId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(shedId)) {
    throw new AppError("Invalid shed ID format", 400, "INVALID_SHED_ID", true);
  }

  // Use aggregation to get summary and transactions in one query
  const result = await LedgerModel.aggregate([
    // Match ledgers for specific shed
    {
      $match: {
        shedId: new mongoose.Types.ObjectId(shedId),
      },
    },
    // Lookup buyer details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [
          {
            $project: {
              name: 1,
              contactNumber: 1,
              address: 1,
            },
          },
        ],
      },
    },
    // Lookup farm details
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [
          {
            $project: {
              name: 1,
              supervisor: 1,
            },
          },
        ],
      },
    },
    // Lookup flock details
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [
          {
            $project: {
              name: 1,
              status: 1,
            },
          },
        ],
      },
    },
    // Lookup shed details
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [
          {
            $project: {
              name: 1,
              capacity: 1,
            },
          },
        ],
      },
    },
    // Add calculated fields
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group to calculate summary statistics
    {
      $group: {
        _id: null,
        shed: { $first: "$shedId" },
        transactions: { $push: "$$ROOT" },
        totalTransactions: { $sum: 1 },
        totalEmptyVehicleWeight: { $sum: "$emptyVehicleWeight" },
        totalGrossWeight: { $sum: "$grossWeight" },
        totalNetWeight: { $sum: "$netWeight" },
        totalBirds: { $sum: "$numberOfBirds" },
        totalRate: { $sum: "$rate" },
        totalAmount: { $sum: "$totalAmount" },
        totalPaid: { $sum: "$amountPaid" },
        totalBalance: { $sum: "$balance" },
        earliestDate: { $min: "$date" },
        latestDate: { $max: "$date" },
      },
    },
    // Project final structure
    {
      $project: {
        _id: 0,
        shed: 1,
        summary: {
          totalTransactions: "$totalTransactions",
          totalEmptyVehicleWeight: "$totalEmptyVehicleWeight",
          totalGrossWeight: "$totalGrossWeight",
          totalNetWeight: "$totalNetWeight",
          totalBirds: "$totalBirds",
          totalRate: "$totalRate",
          totalAmount: "$totalAmount",
          totalPaid: "$totalPaid",
          totalBalance: "$totalBalance",
          dateRange: {
            from: {
              $dateToString: { format: "%Y-%m-%d", date: "$earliestDate" },
            },
            to: { $dateToString: { format: "%Y-%m-%d", date: "$latestDate" } },
          },
        },
        transactions: {
          $map: {
            input: "$transactions",
            as: "transaction",
            in: {
              _id: "$$transaction._id",
              date: "$$transaction.date",
              vehicleNumber: "$$transaction.vehicleNumber",
              driverName: "$$transaction.driverName",
              driverContact: "$$transaction.driverContact",
              accountantName: "$$transaction.accountantName",
              emptyVehicleWeight: "$$transaction.emptyVehicleWeight",
              grossWeight: "$$transaction.grossWeight",
              netWeight: "$$transaction.netWeight",
              numberOfBirds: "$$transaction.numberOfBirds",
              rate: "$$transaction.rate",
              totalAmount: "$$transaction.totalAmount",
              amountPaid: "$$transaction.amountPaid",
              balance: "$$transaction.balance",
              farmId: "$$transaction.farmId",
              flockId: "$$transaction.flockId",
              shedId: "$$transaction.shedId",
              buyerId: "$$transaction.buyerId",
              createdAt: "$$transaction.createdAt",
              updatedAt: "$$transaction.updatedAt",
            },
          },
        },
      },
    },
  ]);

  // Handle case when no transactions found
  if (result.length === 0) {
    const { ShedModel } = await import("../models/sheds.js");
    const shed = await ShedModel.findById(shedId).select("name capacity");
    return res.status(200).json({
      status: "success",
      message: "Shed overall report fetched successfully",
      data: {
        shed: shed ? shed.toObject() : null,
        summary: {
          totalTransactions: 0,
          totalEmptyVehicleWeight: 0,
          totalGrossWeight: 0,
          totalNetWeight: 0,
          totalBirds: 0,
          totalRate: 0,
          totalAmount: 0,
          totalPaid: 0,
          totalBalance: 0,
          dateRange: null,
        },
        transactions: [],
      },
    });
  }

  const reportData = result[0];

  res.status(200).json({
    status: "success",
    message: "Shed overall report fetched successfully",
    data: {
      shed: reportData.shed,
      summary: reportData.summary,
      transactions: reportData.transactions,
    },
  });
});
