import mongoose from "mongoose";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";
import { parseDateToISO } from "../utils/dateUtils.js";
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

function parseIdList(idString) {
  if (!idString) return [];
  return idString
    .split(",")
    .map((id) => id.trim())
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));
}

function parseStringList(stringValue) {
  if (!stringValue) return [];
  return stringValue
    .split(",")
    .map((str) => str.trim())
    .filter((str) => str.length > 0);
}

function buildGroupStage(groupBy) {
  let groupId = null;
  let groupInfo = null;

  switch (groupBy) {
    case "buyer":
      groupId = "$buyerInfo._id";
      groupInfo = {
        _id: "$buyerInfo._id",
        name: "$buyerInfo.name",
        contactNumber: "$buyerInfo.contactNumber",
        address: "$buyerInfo.address",
      };
      break;
    case "farm":
      groupId = "$farmInfo._id";
      groupInfo = {
        _id: "$farmInfo._id",
        name: "$farmInfo.name",
        supervisor: "$farmInfo.supervisor",
      };
      break;
    case "flock":
      groupId = "$flockInfo._id";
      groupInfo = {
        _id: "$flockInfo._id",
        name: "$flockInfo.name",
        status: "$flockInfo.status",
      };
      break;
    case "shed":
      groupId = "$shedInfo._id";
      groupInfo = {
        _id: "$shedInfo._id",
        name: "$shedInfo.name",
        capacity: "$shedInfo.capacity",
      };
      break;
    case "driver":
      groupId = "$driverName";
      groupInfo = {
        driverName: "$driverName",
        driverContact: "$driverContact",
      };
      break;
    case "accountant":
      groupId = "$accountantName";
      groupInfo = {
        accountantName: "$accountantName",
      };
      break;
    case "date":
      groupId = {
        $dateToString: { format: "%Y-%m-%d", date: "$date" },
      };
      groupInfo = {
        date: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
      };
      break;
    default:
      groupId = null;
      groupInfo = null;
      break;
  }

  return {
    $group: {
      _id: groupId,
      ...(groupInfo && { groupInfo: { $first: groupInfo } }),
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
  };
}

export async function getUniversalReportData(query) {
  const {
    duration = "daily",
    date,
    startDate,
    endDate,
    period,
    buyerIds,
    farmIds,
    flockIds,
    shedIds,
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
    search,
    sortBy = "date",
    sortOrder = "desc",
    page = 1,
    limit = 10,
    includeDetails = true,
    groupBy = "none",
    forExport = false,
  } = query;

  const parsedPage = Math.max(parseInt(page) || 1, 1);
  const parsedLimit = Math.min(parseInt(limit) || 10, 1000);
  const parsedOffset = (parsedPage - 1) * parsedLimit;

  const allowedGroupBy = [
    "buyer",
    "farm",
    "flock",
    "shed",
    "driver",
    "accountant",
    "date",
    "none",
  ];
  const validGroupBy = allowedGroupBy.includes(groupBy) ? groupBy : "none";

  let dateRange = {};
  let reportTitle = "";

  try {
    switch (duration) {
      case "daily": {
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
      }
      case "weekly": {
        const weekDate = date ? parseISO(date) : new Date();
        if (!isValid(weekDate))
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        const weekStart = startOfWeek(weekDate);
        const weekEnd = endOfWeek(weekDate);
        dateRange = { $gte: weekStart, $lte: weekEnd };
        reportTitle = `Weekly Report (${format(weekStart, "MMM dd")} - ${format(
          weekEnd,
          "MMM dd, yyyy"
        )})`;
        break;
      }
      case "monthly": {
        const monthDate = date ? parseISO(date) : new Date();
        if (!isValid(monthDate))
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        dateRange = { $gte: monthStart, $lte: monthEnd };
        reportTitle = `Monthly Report for ${format(monthDate, "MMMM yyyy")}`;
        break;
      }
      case "yearly": {
        const yearDate = date ? parseISO(date) : new Date();
        if (!isValid(yearDate))
          throw new AppError("Invalid date format", 400, "INVALID_DATE", true);
        const yearStart = startOfYear(yearDate);
        const yearEnd = endOfYear(yearDate);
        dateRange = { $gte: yearStart, $lte: yearEnd };
        reportTitle = `Yearly Report for ${format(yearDate, "yyyy")}`;
        break;
      }
      case "custom": {
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
      }
      case "period": {
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
      }
      default:
        throw new AppError(
          "Invalid duration. Supported: daily, weekly, monthly, yearly, custom, period",
          400,
          "INVALID_DURATION",
          true
        );
    }
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Date parsing error: ${error.message}`,
      400,
      "DATE_PARSING_ERROR",
      true
    );
  }

  const matchConditions = [{ date: dateRange }];

  const buyerIdList = parseIdList(buyerIds);
  const farmIdList = parseIdList(farmIds);
  const flockIdList = parseIdList(flockIds);
  const shedIdList = parseIdList(shedIds);

  if (buyerIdList.length > 0)
    matchConditions.push({ buyerId: { $in: buyerIdList } });
  if (farmIdList.length > 0)
    matchConditions.push({ farmId: { $in: farmIdList } });
  if (flockIdList.length > 0)
    matchConditions.push({ flockId: { $in: flockIdList } });
  if (shedIdList.length > 0)
    matchConditions.push({ shedId: { $in: shedIdList } });

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

  if (minAmount || maxAmount) {
    const amountRange = {};
    if (minAmount) amountRange.$gte = parseFloat(minAmount);
    if (maxAmount) amountRange.$lte = parseFloat(maxAmount);
    matchConditions.push({ totalAmount: amountRange });
  }

  if (minNetWeight || maxNetWeight) {
    const weightRange = {};
    if (minNetWeight) weightRange.$gte = parseFloat(minNetWeight);
    if (maxNetWeight) weightRange.$lte = parseFloat(maxNetWeight);
    matchConditions.push({ netWeight: weightRange });
  }

  if (minBirds || maxBirds) {
    const birdRange = {};
    if (minBirds) birdRange.$gte = parseInt(minBirds);
    if (maxBirds) birdRange.$lte = parseInt(maxBirds);
    matchConditions.push({ numberOfBirds: birdRange });
  }

  if (minRate || maxRate) {
    const rateRange = {};
    if (minRate) rateRange.$gte = parseFloat(minRate);
    if (maxRate) rateRange.$lte = parseFloat(maxRate);
    matchConditions.push({ rate: rateRange });
  }

  const vehicleNumberList = parseStringList(vehicleNumbers);
  if (vehicleNumberList.length > 0)
    matchConditions.push({ vehicleNumber: { $in: vehicleNumberList } });

  const driverNameList = parseStringList(driverNames);
  if (driverNameList.length > 0)
    matchConditions.push({ driverName: { $in: driverNameList } });

  const accountantNameList = parseStringList(accountantNames);
  if (accountantNameList.length > 0)
    matchConditions.push({ accountantName: { $in: accountantNameList } });

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

  const parsedIncludeDetails =
    includeDetails === "true" || includeDetails === true;
  const parsedForExport = forExport === "true" || forExport === true;

  const pipeline = [
    { $match: { $and: matchConditions } },
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
        pipeline: [{ $project: { name: 1, capacity: 1 } }],
      },
    },
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

  if (search && String(search).trim()) {
    const searchRegex = new RegExp(String(search).trim(), "i");
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

  pipeline.push(buildGroupStage(validGroupBy), {
    $project: {
      _id: 0,
      groupId: "$_id",
      groupInfo: "$groupInfo",
      summary: {
        totalTransactions: "$totalTransactions",
        totalEmptyVehicleWeight: { $round: ["$totalEmptyVehicleWeight", 2] },
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
        dateRange: {
          from: {
            $dateToString: { format: "%Y-%m-%d", date: "$earliestDate" },
          },
          to: { $dateToString: { format: "%Y-%m-%d", date: "$latestDate" } },
        },
      },
      transactions: parsedIncludeDetails
        ? parsedForExport
          ? {
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
            }
          : {
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
    },
  });

  const result = await LedgerModel.aggregate(pipeline);

  if (result.length === 0) {
    const emptyResponse = {
      reportTitle,
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
        dateRange: { from: null, to: null },
      },
      ...(validGroupBy === "none"
        ? {
            transactions: [],
            pagination: {
              page: parsedPage,
              limit: parsedLimit,
              totalCount: 0,
              hasMore: false,
            },
          }
        : { groupedResults: [] }),
    };
    return { data: emptyResponse, groupBy: validGroupBy, reportTitle };
  }

  if (validGroupBy === "none") {
    const overallSummary = result.reduce(
      (acc, group) => {
        acc.totalTransactions += group.summary.totalTransactions;
        acc.totalEmptyVehicleWeight += group.summary.totalEmptyVehicleWeight;
        acc.totalGrossWeight += group.summary.totalGrossWeight;
        acc.totalNetWeight += group.summary.totalNetWeight;
        acc.totalBirds += group.summary.totalBirds;
        acc.totalRate += group.summary.totalRate;
        acc.totalAmount += group.summary.totalAmount;
        acc.totalPaid += group.summary.totalPaid;
        acc.totalBalance += group.summary.totalBalance;
        return acc;
      },
      {
        totalTransactions: 0,
        totalEmptyVehicleWeight: 0,
        totalGrossWeight: 0,
        totalNetWeight: 0,
        totalBirds: 0,
        totalRate: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
      }
    );

    const totalTransactions = overallSummary.totalTransactions;
    overallSummary.averageRate =
      totalTransactions > 0 ? overallSummary.totalRate / totalTransactions : 0;
    overallSummary.averageNetWeight =
      totalTransactions > 0
        ? overallSummary.totalNetWeight / totalTransactions
        : 0;
    overallSummary.averageBirdsPerTransaction =
      totalTransactions > 0 ? overallSummary.totalBirds / totalTransactions : 0;

    Object.keys(overallSummary).forEach((key) => {
      if (
        typeof overallSummary[key] === "number" &&
        key !== "totalTransactions" &&
        key !== "totalBirds"
      ) {
        overallSummary[key] = Math.round(overallSummary[key] * 100) / 100;
      }
    });

    const allDates = result
      .flatMap((group) => [
        new Date(group.summary.dateRange.from),
        new Date(group.summary.dateRange.to),
      ])
      .filter((d) => d && !isNaN(d));

    const responseData = {
      reportTitle,
      dateRange: {
        from:
          allDates.length > 0
            ? new Date(Math.min(...allDates)).toISOString().split("T")[0]
            : null,
        to:
          allDates.length > 0
            ? new Date(Math.max(...allDates)).toISOString().split("T")[0]
            : null,
      },
      summary: {
        ...overallSummary,
        dateRange: {
          from:
            allDates.length > 0
              ? new Date(Math.min(...allDates)).toISOString().split("T")[0]
              : null,
          to:
            allDates.length > 0
              ? new Date(Math.max(...allDates)).toISOString().split("T")[0]
              : null,
        },
      },
      transactions: result.flatMap((group) => group.transactions),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        totalCount: overallSummary.totalTransactions,
        hasMore: overallSummary.totalTransactions > parsedOffset + parsedLimit,
      },
    };

    return { data: responseData, groupBy: validGroupBy, reportTitle };
  }

  const groupedResults = result.map((group) => ({
    groupId: group.groupId,
    groupInfo: group.groupInfo,
    summary: group.summary,
    transactions: group.transactions,
  }));

  const overallSummary = result.reduce(
    (acc, group) => {
      acc.totalTransactions += group.summary.totalTransactions;
      acc.totalEmptyVehicleWeight += group.summary.totalEmptyVehicleWeight;
      acc.totalGrossWeight += group.summary.totalGrossWeight;
      acc.totalNetWeight += group.summary.totalNetWeight;
      acc.totalBirds += group.summary.totalBirds;
      acc.totalRate += group.summary.totalRate;
      acc.totalAmount += group.summary.totalAmount;
      acc.totalPaid += group.summary.totalPaid;
      acc.totalBalance += group.summary.totalBalance;
      return acc;
    },
    {
      totalTransactions: 0,
      totalEmptyVehicleWeight: 0,
      totalGrossWeight: 0,
      totalNetWeight: 0,
      totalBirds: 0,
      totalRate: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalBalance: 0,
    }
  );

  const totalTransactions2 = overallSummary.totalTransactions;
  overallSummary.averageRate =
    totalTransactions2 > 0 ? overallSummary.totalRate / totalTransactions2 : 0;
  overallSummary.averageNetWeight =
    totalTransactions2 > 0
      ? overallSummary.totalNetWeight / totalTransactions2
      : 0;
  overallSummary.averageBirdsPerTransaction =
    totalTransactions2 > 0 ? overallSummary.totalBirds / totalTransactions2 : 0;

  Object.keys(overallSummary).forEach((key) => {
    if (
      typeof overallSummary[key] === "number" &&
      key !== "totalTransactions" &&
      key !== "totalBirds"
    ) {
      overallSummary[key] = Math.round(overallSummary[key] * 100) / 100;
    }
  });

  const allDates = result
    .flatMap((group) => [
      new Date(group.summary.dateRange.from),
      new Date(group.summary.dateRange.to),
    ])
    .filter((d) => d && !isNaN(d));

  const responseData = {
    reportTitle,
    dateRange: {
      from:
        allDates.length > 0
          ? new Date(Math.min(...allDates)).toISOString().split("T")[0]
          : null,
      to:
        allDates.length > 0
          ? new Date(Math.max(...allDates)).toISOString().split("T")[0]
          : null,
    },
    summary: {
      ...overallSummary,
      dateRange: {
        from:
          allDates.length > 0
            ? new Date(Math.min(...allDates)).toISOString().split("T")[0]
            : null,
        to:
          allDates.length > 0
            ? new Date(Math.max(...allDates)).toISOString().split("T")[0]
            : null,
      },
    },
    groupedResults,
    groupBy: validGroupBy,
  };

  return { data: responseData, groupBy: validGroupBy, reportTitle };
}
