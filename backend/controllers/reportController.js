import { asyncHandler } from "../middleware/asyncHandler.js";
import { BuyerModel } from "../models/buyer.js";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";
import { parseDateToISO } from "../utils/dateUtils.js";
import mongoose from "mongoose";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  format,
  parseISO,
  isValid,
} from "date-fns";

// ==================== UNIVERSAL REPORTS ====================

/**
 * Universal Reports API - The most powerful and flexible reporting endpoint
 *
 * This endpoint can generate reports for any combination of:
 * - Entity levels: buyers, farms, flocks, sheds (or any combination)
 * - Time durations: daily, weekly, monthly, yearly, custom ranges, periods
 * - Custom filters: any combination of entities, payment status, amounts, weights, etc.
 *
 * Query Parameters:
 *
 * TIME DURATION:
 * - duration: 'daily', 'weekly', 'monthly', 'yearly', 'custom', 'period'
 * - date: Specific date for daily/weekly/monthly/yearly reports
 * - startDate: Start date for custom range
 * - endDate: End date for custom range
 * - period: Number of days to go back (for period duration)
 *
 * ENTITY FILTERS (can use any combination):
 * - buyerIds: Comma-separated list of buyer IDs
 * - farmIds: Comma-separated list of farm IDs
 * - flockIds: Comma-separated list of flock IDs
 * - shedIds: Comma-separated list of shed IDs
 *
 * ADVANCED FILTERS:
 * - paymentStatus: 'paid', 'partial', 'unpaid'
 * - minAmount, maxAmount: Amount range filters
 * - minNetWeight, maxNetWeight: Weight range filters
 * - minBirds, maxBirds: Bird count range filters
 * - minRate, maxRate: Rate range filters
 * - vehicleNumbers: Comma-separated list of vehicle numbers
 * - driverNames: Comma-separated list of driver names
 * - accountantNames: Comma-separated list of accountant names
 *
 * SORTING & PAGINATION:
 * - sortBy: Field to sort by
 * - sortOrder: 'asc' or 'desc'
 * - limit: Number of transactions to return (max: 1000)
 * - offset: Number of transactions to skip
 *
 * GROUPING & AGGREGATION:
 * - groupBy: 'buyer', 'farm', 'flock', 'shed', 'date', 'none'
 * - includeDetails: true/false (include individual transactions)
 *
 * Examples:
 * - All transactions for specific buyers: ?buyerIds=id1,id2&duration=monthly
 * - All transactions for specific sheds across different farms: ?shedIds=id1,id2,id3&duration=custom&startDate=2024-01-01&endDate=2024-01-31
 * - All transactions for specific flocks with payment filters: ?flockIds=id1,id2&paymentStatus=unpaid&minAmount=1000
 * - Farm-level report with custom date range: ?farmIds=id1&duration=custom&startDate=2024-01-01&endDate=2024-01-31&groupBy=farm
 */
export const getUniversalReport = asyncHandler(async (req, res) => {
  const {
    // Time duration parameters
    duration = "daily",
    date,
    startDate,
    endDate,
    period,

    // Entity filters (comma-separated lists)
    buyerIds,
    farmIds,
    flockIds,
    shedIds,

    // Advanced filters
    paymentStatus,
    minAmount,
    maxAmount,
    minNetWeight,
    maxNetWeight,
    minBirds,
    maxBirds,
    minRate,
    maxRate,
    vehicleNumbers,
    driverNames,
    accountantNames,

    // Search
    search,

    // Sorting and pagination
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,

    // Aggregation
    includeDetails = true,
  } = req.query;

  // Validate pagination
  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const parsedLimit = Math.min(parseInt(limit) || 10, 1000);
  const parsedOffset = (parsedPage - 1) * parsedLimit;

  // Build date range based on duration
  let dateRange = {};
  let reportTitle = "";

  try {
    switch (duration) {
      case "daily":
        if (!date) {
          throw new AppError(
            "Date is required for daily reports",
            400,
            "MISSING_DATE",
            true
          );
        }
        const parsedDate = parseDateToISO(date);
        dateRange = {
          $gte: new Date(parsedDate.startOfDay),
          $lte: new Date(parsedDate.endOfDay),
        };
        reportTitle = `Daily Report for ${parsedDate.date}`;
        break;

      case "weekly":
        const weekDate = date ? parseISO(date) : new Date();
        if (!isValid(weekDate)) {
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        }
        const weekStart = startOfWeek(weekDate);
        const weekEnd = endOfWeek(weekDate);
        dateRange = {
          $gte: weekStart,
          $lte: weekEnd,
        };
        reportTitle = `Weekly Report (${format(weekStart, "MMM dd")} - ${format(
          weekEnd,
          "MMM dd, yyyy"
        )})`;
        break;

      case "monthly":
        const monthDate = date ? parseISO(date) : new Date();
        if (!isValid(monthDate)) {
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        }
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        dateRange = {
          $gte: monthStart,
          $lte: monthEnd,
        };
        reportTitle = `Monthly Report for ${format(monthDate, "MMMM yyyy")}`;
        break;

      case "yearly":
        const yearDate = date ? parseISO(date) : new Date();
        if (!isValid(yearDate)) {
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        }
        const yearStart = startOfYear(yearDate);
        const yearEnd = endOfYear(yearDate);
        dateRange = {
          $gte: yearStart,
          $lte: yearEnd,
        };
        reportTitle = `Yearly Report for ${format(yearDate, "yyyy")}`;
        break;

      case "custom":
        if (!startDate || !endDate) {
          throw new AppError(
            "Start date and end date are required for custom range",
            400,
            "MISSING_DATE_RANGE",
            true
          );
        }
        const start = parseDateToISO(startDate);
        const end = parseDateToISO(endDate);
        dateRange = {
          $gte: new Date(start.startOfDay),
          $lte: new Date(end.endOfDay),
        };
        reportTitle = `Custom Report (${start.date} - ${end.date})`;
        break;

      case "period":
        if (!period || isNaN(parseInt(period))) {
          throw new AppError(
            "Valid period number is required",
            400,
            "INVALID_PERIOD",
            true
          );
        }
        const periodNum = parseInt(period);
        const periodEnd = new Date();
        const periodStart = subDays(periodEnd, periodNum - 1);
        dateRange = {
          $gte: startOfDay(periodStart),
          $lte: endOfDay(periodEnd),
        };
        reportTitle = `Last ${periodNum} Days Report`;
        break;

      default:
        throw new AppError(
          "Invalid duration. Supported: daily, weekly, monthly, yearly, custom, period",
          400,
          "INVALID_DURATION",
          true
        );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      `Date parsing error: ${error.message}`,
      400,
      "DATE_PARSING_ERROR",
      true
    );
  }

  // Build match conditions
  const matchConditions = [{ date: dateRange }];

  // Helper function to parse comma-separated IDs
  const parseIdList = (idString) => {
    if (!idString) return [];
    return idString
      .split(",")
      .map((id) => id.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));
  };

  // Helper function to parse comma-separated strings
  const parseStringList = (stringValue) => {
    if (!stringValue) return [];
    return stringValue
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str.length > 0);
  };

  // Add entity filters
  const buyerIdList = parseIdList(buyerIds);
  const farmIdList = parseIdList(farmIds);
  const flockIdList = parseIdList(flockIds);
  const shedIdList = parseIdList(shedIds);

  if (buyerIdList.length > 0) {
    matchConditions.push({ buyerId: { $in: buyerIdList } });
  }
  if (farmIdList.length > 0) {
    matchConditions.push({ farmId: { $in: farmIdList } });
  }
  if (flockIdList.length > 0) {
    matchConditions.push({ flockId: { $in: flockIdList } });
  }
  if (shedIdList.length > 0) {
    matchConditions.push({ shedId: { $in: shedIdList } });
  }

  // Add payment status filter
  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
        matchConditions.push({
          $expr: { $eq: ["$amountPaid", "$totalAmount"] },
        });
        break;
      case "partial":
        matchConditions.push({
          $expr: {
            $and: [
              { $gt: ["$amountPaid", 0] },
              { $lt: ["$amountPaid", "$totalAmount"] },
            ],
          },
        });
        break;
      case "unpaid":
        matchConditions.push({ $expr: { $eq: ["$amountPaid", 0] } });
        break;
    }
  }

  // Add amount range filters
  if (minAmount || maxAmount) {
    const amountRange = {};
    if (minAmount) amountRange.$gte = parseFloat(minAmount);
    if (maxAmount) amountRange.$lte = parseFloat(maxAmount);
    matchConditions.push({ totalAmount: amountRange });
  }

  // Add net weight range filters
  if (minNetWeight || maxNetWeight) {
    const weightRange = {};
    if (minNetWeight) weightRange.$gte = parseFloat(minNetWeight);
    if (maxNetWeight) weightRange.$lte = parseFloat(maxNetWeight);
    matchConditions.push({ netWeight: weightRange });
  }

  // Add bird count range filters
  if (minBirds || maxBirds) {
    const birdRange = {};
    if (minBirds) birdRange.$gte = parseInt(minBirds);
    if (maxBirds) birdRange.$lte = parseInt(maxBirds);
    matchConditions.push({ numberOfBirds: birdRange });
  }

  // Add rate range filters
  if (minRate || maxRate) {
    const rateRange = {};
    if (minRate) rateRange.$gte = parseFloat(minRate);
    if (maxRate) rateRange.$lte = parseFloat(maxRate);
    matchConditions.push({ rate: rateRange });
  }

  // Add vehicle number filters
  const vehicleNumberList = parseStringList(vehicleNumbers);
  if (vehicleNumberList.length > 0) {
    matchConditions.push({ vehicleNumber: { $in: vehicleNumberList } });
  }

  // Add driver name filters
  const driverNameList = parseStringList(driverNames);
  if (driverNameList.length > 0) {
    matchConditions.push({ driverName: { $in: driverNameList } });
  }

  // Add accountant name filters
  const accountantNameList = parseStringList(accountantNames);
  if (accountantNameList.length > 0) {
    matchConditions.push({ accountantName: { $in: accountantNameList } });
  }

  // Add search filter (will be applied after lookups)
  // Note: Search for related entities will be handled after $addFields stage

  // Validate sort parameters
  const allowedSortFields = [
    "date",
    "totalAmount",
    "amountPaid",
    "netWeight",
    "numberOfBirds",
    "rate",
    "vehicleNumber",
    "driverName",
    "createdAt",
    "updatedAt",
  ];
  const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "date";
  const sortDirection = sortOrder === "asc" ? 1 : -1;

  // Parse includeDetails as boolean
  const parsedIncludeDetails =
    includeDetails === "true" || includeDetails === true;

  // Build aggregation pipeline
  const pipeline = [
    // Match conditions
    {
      $match: {
        $and: matchConditions,
      },
    },
    // Lookup related entities
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
        buyerInfo: { $arrayElemAt: ["$buyer", 0] },
        farmInfo: { $arrayElemAt: ["$farm", 0] },
        flockInfo: { $arrayElemAt: ["$flock", 0] },
        shedInfo: { $arrayElemAt: ["$shed", 0] },
      },
    },
  ];

  // Add search filter after lookups (to search across related entities)
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    pipeline.push({
      $match: {
        $or: [
          { vehicleNumber: searchRegex },
          { driverName: searchRegex },
          { driverContact: searchRegex },
          { accountantName: searchRegex },
          { "buyerInfo.name": searchRegex },
          { "buyerInfo.contactNumber": searchRegex },
          { "farmInfo.name": searchRegex },
          { "farmInfo.supervisor": searchRegex },
          { "flockInfo.name": searchRegex },
          { "shedInfo.name": searchRegex },
        ],
      },
    });
  }

  // Add aggregation pipeline for summary and transactions
  pipeline.push(
    {
      $group: {
        _id: null,
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
        averageRate: { $avg: "$rate" },
        averageNetWeight: { $avg: "$netWeight" },
        averageBirdsPerTransaction: { $avg: "$numberOfBirds" },
        earliestDate: { $min: "$date" },
        latestDate: { $max: "$date" },
      },
    },
    {
      $project: {
        _id: 0,
        reportTitle: reportTitle,
        dateRange: {
          from: {
            $dateToString: { format: "%Y-%m-%d", date: "$earliestDate" },
          },
          to: { $dateToString: { format: "%Y-%m-%d", date: "$latestDate" } },
        },
        summary: {
          totalTransactions: "$totalTransactions",
          totalEmptyVehicleWeight: {
            $round: ["$totalEmptyVehicleWeight", 2],
          },
          totalGrossWeight: { $round: ["$totalGrossWeight", 2] },
          totalNetWeight: { $round: ["$totalNetWeight", 2] },
          totalBirds: "$totalBirds",
          totalRate: { $round: ["$totalRate", 2] },
          totalAmount: { $round: ["$totalAmount", 2] },
          totalPaid: { $round: ["$totalPaid", 2] },
          totalBalance: { $round: ["$totalBalance", 2] },
          averageRate: { $round: ["$averageRate", 2] },
          averageNetWeight: { $round: ["$averageNetWeight", 2] },
          averageBirdsPerTransaction: {
            $round: ["$averageBirdsPerTransaction", 2],
          },
        },
        transactions: parsedIncludeDetails
          ? {
              $slice: [
                {
                  $map: {
                    input: {
                      $sortArray: {
                        input: "$transactions",
                        sortBy: { [validSortBy]: sortDirection },
                      },
                    },
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
                      buyerInfo: "$$transaction.buyerInfo",
                      farmInfo: "$$transaction.farmInfo",
                      flockInfo: "$$transaction.flockInfo",
                      shedInfo: "$$transaction.shedInfo",
                      createdAt: "$$transaction.createdAt",
                      updatedAt: "$$transaction.updatedAt",
                    },
                  },
                },
                parsedOffset,
                parsedLimit,
              ],
            }
          : [],
        pagination: {
          totalCount: "$totalTransactions",
          hasMore: {
            $gt: ["$totalTransactions", { $add: [parsedOffset, parsedLimit] }],
          },
        },
      },
    }
  );

  // Execute aggregation
  const result = await LedgerModel.aggregate(pipeline);

  // Handle case when no transactions found
  if (result.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "Universal report fetched successfully",
      data: {
        reportTitle: reportTitle,
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
          averageRate: 0,
          averageNetWeight: 0,
          averageBirdsPerTransaction: 0,
        },
        transactions: [],
        pagination: {
          page: parsedPage,
          limit: parsedLimit,
          totalCount: 0,
          hasMore: false,
        },
      },
    });
  }

  const reportData = result[0];

  // Add proper pagination values
  if (reportData.pagination) {
    reportData.pagination.page = parsedPage;
    reportData.pagination.limit = parsedLimit;
  }

  res.status(200).json({
    status: "success",
    message: "Universal report fetched successfully",
    data: reportData,
  });
});
