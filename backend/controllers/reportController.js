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
  // Use aggregation to get summary and transactions across child flocks in one query
  const result = await LedgerModel.aggregate([
    // Lookup all flocks that belong to this farm
    {
      $lookup: {
        from: "flocks",
        let: { farmObjId: new mongoose.Types.ObjectId(farmId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$farmId", "$$farmObjId"] },
            },
          },
          { $project: { _id: 1, name: 1, status: 1 } },
        ],
        as: "farmFlocks",
      },
    },
    // Match ledgers whose flockId is among the farm's flocks and within date range
    {
      $match: {
        $expr: {
          $in: [
            "$flockId",
            { $map: { input: "$farmFlocks", as: "f", in: "$$f._id" } },
          ],
        },
        date: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    // Lookup buyer, farm, flock, shed details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [{ $project: { name: 1, contactNumber: 1, address: 1 } }],
      },
    },
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [{ $project: { name: 1, supervisor: 1 } }],
      },
    },
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [{ $project: { name: 1, status: 1 } }],
      },
    },
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [{ $project: { name: 1, totalChicks: 1 } }],
      },
    },
    // Add calculated fields and denormalize lookups
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group and summarize
    {
      $group: {
        _id: null,
        farm: { $first: "$farmId" },
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
    // Final projection
    {
      $project: {
        _id: 0,
        farm: 1,
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
            as: "t",
            in: {
              _id: "$$t._id",
              date: "$$t.date",
              vehicleNumber: "$$t.vehicleNumber",
              driverName: "$$t.driverName",
              driverContact: "$$t.driverContact",
              accountantName: "$$t.accountantName",
              emptyVehicleWeight: "$$t.emptyVehicleWeight",
              grossWeight: "$$t.grossWeight",
              netWeight: "$$t.netWeight",
              numberOfBirds: "$$t.numberOfBirds",
              rate: "$$t.rate",
              totalAmount: "$$t.totalAmount",
              amountPaid: "$$t.amountPaid",
              balance: "$$t.balance",
              farmId: "$$t.farmId",
              flockId: "$$t.flockId",
              shedId: "$$t.shedId",
              buyerId: "$$t.buyerId",
              createdAt: "$$t.createdAt",
              updatedAt: "$$t.updatedAt",
            },
          },
        },
      },
    },
  ]);

  if (result.length === 0) {
    const { FarmModel } = await import("../models/farms.js");
    const farm = await FarmModel.findById(farmId).select("name supervisor");
    return res.status(200).json({
      status: "success",
      message: "Farm daily report fetched successfully",
      data: {
        farm: farm ? farm.toObject() : null,
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
    message: "Farm daily report fetched successfully",
    data: {
      farm: reportData.farm,
      date: formattedDate,
      summary: reportData.summary,
      transactions: reportData.transactions,
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

  // Use aggregation to compute across child flocks
  const result = await LedgerModel.aggregate([
    // Lookup all flocks that belong to this farm
    {
      $lookup: {
        from: "flocks",
        let: { farmObjId: new mongoose.Types.ObjectId(farmId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$farmId", "$$farmObjId"] },
            },
          },
          { $project: { _id: 1, name: 1, status: 1 } },
        ],
        as: "farmFlocks",
      },
    },
    // Match ledgers whose flockId is among the farm's flocks
    {
      $match: {
        $expr: {
          $in: [
            "$flockId",
            { $map: { input: "$farmFlocks", as: "f", in: "$$f._id" } },
          ],
        },
      },
    },
    // Lookup buyer, farm, flock, shed details
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
        pipeline: [{ $project: { name: 1, contactNumber: 1, address: 1 } }],
      },
    },
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
        pipeline: [{ $project: { name: 1, supervisor: 1 } }],
      },
    },
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flock",
        pipeline: [{ $project: { name: 1, status: 1 } }],
      },
    },
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shed",
        pipeline: [{ $project: { name: 1, totalChicks: 1 } }],
      },
    },
    // Add calculated fields and denormalize lookups
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
        buyerId: { $arrayElemAt: ["$buyer", 0] },
        farmId: { $arrayElemAt: ["$farm", 0] },
        flockId: { $arrayElemAt: ["$flock", 0] },
        shedId: { $arrayElemAt: ["$shed", 0] },
      },
    },
    // Group and summarize with date range
    {
      $group: {
        _id: null,
        farm: { $first: "$farmId" },
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
    // Final projection
    {
      $project: {
        _id: 0,
        farm: 1,
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
            as: "t",
            in: {
              _id: "$$t._id",
              date: "$$t.date",
              vehicleNumber: "$$t.vehicleNumber",
              driverName: "$$t.driverName",
              driverContact: "$$t.driverContact",
              accountantName: "$$t.accountantName",
              emptyVehicleWeight: "$$t.emptyVehicleWeight",
              grossWeight: "$$t.grossWeight",
              netWeight: "$$t.netWeight",
              numberOfBirds: "$$t.numberOfBirds",
              rate: "$$t.rate",
              totalAmount: "$$t.totalAmount",
              amountPaid: "$$t.amountPaid",
              balance: "$$t.balance",
              farmId: "$$t.farmId",
              flockId: "$$t.flockId",
              shedId: "$$t.shedId",
              buyerId: "$$t.buyerId",
              createdAt: "$$t.createdAt",
              updatedAt: "$$t.updatedAt",
            },
          },
        },
      },
    },
  ]);

  if (result.length === 0) {
    const { FarmModel } = await import("../models/farms.js");
    const farm = await FarmModel.findById(farmId).select("name supervisor");
    return res.status(200).json({
      status: "success",
      message: "Farm overall report fetched successfully",
      data: {
        farm: farm ? farm.toObject() : null,
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
    message: "Farm overall report fetched successfully",
    data: {
      farm: reportData.farm,
      summary: reportData.summary,
      transactions: reportData.transactions,
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

  // Use aggregation to get summary and transactions in one query
  // First, get all sheds that belong to this flock, then get all ledgers from those sheds
  const result = await LedgerModel.aggregate([
    // First lookup to get all sheds for this flock
    {
      $lookup: {
        from: "sheds",
        let: { flockId: new mongoose.Types.ObjectId(flockId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$flockId", "$$flockId"] },
            },
          },
        ],
        as: "flockSheds",
      },
    },
    // Match ledgers that belong to sheds of this flock and are within the date range
    {
      $match: {
        $expr: {
          $in: [
            "$shedId",
            { $map: { input: "$flockSheds", as: "shed", in: "$$shed._id" } },
          ],
        },
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
              totalChicks: 1,
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
        flock: { $first: "$flockId" },
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
        flock: 1,
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
    const { FlockModel } = await import("../models/flocks.js");
    const flock = await FlockModel.findById(flockId).select("name status");
    return res.status(200).json({
      status: "success",
      message: "Flock daily report fetched successfully",
      data: {
        flock: flock ? flock.toObject() : null,
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
    message: "Flock daily report fetched successfully",
    data: {
      flock: reportData.flock,
      date: formattedDate,
      summary: reportData.summary,
      transactions: reportData.transactions,
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

  // Use aggregation to get summary and transactions in one query
  // First, get all sheds that belong to this flock, then get all ledgers from those sheds
  const result = await LedgerModel.aggregate([
    // First lookup to get all sheds for this flock
    {
      $lookup: {
        from: "sheds",
        let: { flockId: new mongoose.Types.ObjectId(flockId) },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$flockId", "$$flockId"] },
            },
          },
        ],
        as: "flockSheds",
      },
    },
    // Match ledgers that belong to sheds of this flock
    {
      $match: {
        $expr: {
          $in: [
            "$shedId",
            { $map: { input: "$flockSheds", as: "shed", in: "$$shed._id" } },
          ],
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
              totalChicks: 1,
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
        flock: { $first: "$flockId" },
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
        flock: 1,
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
    const { FlockModel } = await import("../models/flocks.js");
    const flock = await FlockModel.findById(flockId).select("name status");
    return res.status(200).json({
      status: "success",
      message: "Flock overall report fetched successfully",
      data: {
        flock: flock ? flock.toObject() : null,
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
    message: "Flock overall report fetched successfully",
    data: {
      flock: reportData.flock,
      summary: reportData.summary,
      transactions: reportData.transactions,
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
