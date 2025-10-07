import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { ShedModel } from "../models/sheds.js";
import { BuyerModel } from "../models/buyer.js";
import { LedgerModel } from "../models/ledger.js";
import { UserModel } from "../models/users.js";
import {
  startOfMonth,
  endOfMonth,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";

// ==================== DASHBOARD SUMMARY ====================
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentMonthStart = startOfMonth(currentDate);
  const currentMonthEnd = endOfMonth(currentDate);
  const lastMonthStart = startOfMonth(subDays(currentDate, 30));
  const lastMonthEnd = endOfMonth(subDays(currentDate, 30));

  // Get entity counts
  const [
    totalFarms,
    totalBuyers,
    totalSheds,
    totalUsers,
    activeFlocks,
    completedFlocks,
  ] = await Promise.all([
    FarmModel.countDocuments(),
    BuyerModel.countDocuments(),
    ShedModel.countDocuments(),
    UserModel.countDocuments(),
    FlockModel.countDocuments({ status: "active" }),
    FlockModel.countDocuments({ status: "completed" }),
  ]);

  // Get financial summary
  const [
    totalRevenue,
    totalPaid,
    totalTransactions,
    thisMonthRevenue,
    thisMonthTransactions,
    thisMonthBirds,
    thisMonthNetWeight,
    lastMonthRevenue,
    lastMonthTransactions,
  ] = await Promise.all([
    LedgerModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    LedgerModel.aggregate([
      { $group: { _id: null, total: { $sum: "$amountPaid" } } },
    ]),
    LedgerModel.countDocuments(),
    LedgerModel.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    LedgerModel.countDocuments({
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
    }),
    LedgerModel.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$numberOfBirds" } } },
    ]),
    LedgerModel.aggregate([
      {
        $match: {
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$netWeight" } } },
    ]),
    LedgerModel.aggregate([
      {
        $match: {
          date: { $gte: lastMonthStart, $lte: lastMonthEnd },
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    LedgerModel.countDocuments({
      date: { $gte: lastMonthStart, $lte: lastMonthEnd },
    }),
  ]);

  // Get payment status breakdown
  const paymentStatusBreakdown = await LedgerModel.aggregate([
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$amountPaid", 0] },
            "unpaid",
            {
              $cond: [
                { $eq: ["$amountPaid", "$totalAmount"] },
                "paid",
                "partial",
              ],
            },
          ],
        },
        count: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Get top buyers
  const topBuyers = await LedgerModel.aggregate([
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $group: {
        _id: "$buyerId",
        buyerName: { $first: "$buyer.name" },
        transactionCount: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
        totalBirds: { $sum: "$numberOfBirds" },
      },
    },
    { $sort: { totalAmount: -1 } },
    { $limit: 3 },
  ]);

  // Calculate derived metrics
  const totalRevenueValue = totalRevenue[0]?.total || 0;
  const totalPaidValue = totalPaid[0]?.total || 0;
  const outstandingBalance = totalRevenueValue - totalPaidValue;
  const thisMonthRevenueValue = thisMonthRevenue[0]?.total || 0;
  const thisMonthBirdsValue = thisMonthBirds[0]?.total || 0;
  const thisMonthNetWeightValue = thisMonthNetWeight[0]?.total || 0;
  const lastMonthRevenueValue = lastMonthRevenue[0]?.total || 0;

  const averageTransactionValue =
    totalTransactions > 0 ? totalRevenueValue / totalTransactions : 0;
  const averageBirdsPerTransaction =
    thisMonthTransactions > 0 ? thisMonthBirdsValue / thisMonthTransactions : 0;
  const averageNetWeightPerTransaction =
    thisMonthTransactions > 0
      ? thisMonthNetWeightValue / thisMonthTransactions
      : 0;

  // Format payment status breakdown
  const paymentStatus = {
    paid: { count: 0, totalAmount: 0 },
    partial: { count: 0, totalAmount: 0 },
    unpaid: { count: 0, totalAmount: 0 },
  };

  paymentStatusBreakdown.forEach((status) => {
    if (paymentStatus[status._id]) {
      paymentStatus[status._id] = {
        count: status.count,
        totalAmount: status.totalAmount,
      };
    }
  });

  const response = {
    entityCounts: {
      totalFarms,
      totalBuyers,
      totalSheds,
      totalUsers,
      activeFlocks,
      completedFlocks,
    },
    financialSummary: {
      totalRevenue: Math.round(totalRevenueValue * 100) / 100,
      totalPaid: Math.round(totalPaidValue * 100) / 100,
      outstandingBalance: Math.round(outstandingBalance * 100) / 100,
      totalTransactions,
    },
    thisMonth: {
      revenue: Math.round(thisMonthRevenueValue * 100) / 100,
      transactions: thisMonthTransactions,
      birdsSold: thisMonthBirdsValue,
      netWeight: Math.round(thisMonthNetWeightValue * 100) / 100,
    },
    lastMonth: {
      revenue: Math.round(lastMonthRevenueValue * 100) / 100,
      transactions: lastMonthTransactions,
    },
    averages: {
      transactionValue: Math.round(averageTransactionValue * 100) / 100,
      birdsPerTransaction: Math.round(averageBirdsPerTransaction * 100) / 100,
      netWeightPerTransaction:
        Math.round(averageNetWeightPerTransaction * 100) / 100,
    },
    paymentStatus,
    topBuyers: topBuyers.map((buyer) => ({
      id: buyer._id,
      name: buyer.buyerName,
      transactionCount: buyer.transactionCount,
      totalAmount: Math.round(buyer.totalAmount * 100) / 100,
      totalBirds: buyer.totalBirds,
    })),
  };

  res.status(200).json({
    status: "success",
    message: "Dashboard summary fetched successfully",
    data: response,
  });
});

// ==================== RECENT ACTIVITY ====================
export const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  const parsedLimit = Math.min(parseInt(limit) || 10, 50);

  // Get recent transactions
  const recentTransactions = await LedgerModel.aggregate([
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyer",
      },
    },
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
      },
    },
    { $unwind: "$buyer" },
    { $unwind: "$farm" },
    {
      $project: {
        _id: 1,
        date: 1,
        totalAmount: 1,
        amountPaid: 1,
        numberOfBirds: 1,
        netWeight: 1,
        vehicleNumber: 1,
        driverName: 1,
        buyerName: "$buyer.name",
        farmName: "$farm.name",
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: parsedLimit },
  ]);

  // Get recent flocks
  const recentFlocks = await FlockModel.aggregate([
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farm",
      },
    },
    { $unwind: "$farm" },
    {
      $project: {
        _id: 1,
        name: 1,
        status: 1,
        startDate: 1,
        totalChicks: 1,
        farmName: "$farm.name",
        createdAt: 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
  ]);

  // Get recent farms
  const recentFarms = await FarmModel.find()
    .select("name supervisor createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  const response = {
    recentTransactions: recentTransactions.map((transaction) => ({
      id: transaction._id,
      type: "transaction",
      title: `Transaction with ${transaction.buyerName}`,
      description: `${transaction.numberOfBirds} birds, ${transaction.netWeight}kg, ${transaction.farmName}`,
      amount: transaction.totalAmount,
      date: transaction.date,
      createdAt: transaction.createdAt,
      vehicleNumber: transaction.vehicleNumber,
      driverName: transaction.driverName,
    })),
    recentFlocks: recentFlocks.map((flock) => ({
      id: flock._id,
      type: "flock",
      title: `Flock ${flock.name} started`,
      description: `${flock.totalChicks} chicks at ${flock.farmName}`,
      status: flock.status,
      startDate: flock.startDate,
      createdAt: flock.createdAt,
    })),
    recentFarms: recentFarms.map((farm) => ({
      id: farm._id,
      type: "farm",
      title: `Farm ${farm.name} added`,
      description: `Supervisor: ${farm.supervisor}`,
      createdAt: farm.createdAt,
    })),
  };

  res.status(200).json({
    status: "success",
    message: "Recent activity fetched successfully",
    data: response,
  });
});

// ==================== DASHBOARD STATS ====================
export const getDashboardStats = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const currentMonthStart = startOfMonth(currentDate);
  const currentMonthEnd = endOfMonth(currentDate);

  // Get this month vs last month comparison
  const thisMonthStats = await LedgerModel.aggregate([
    {
      $match: {
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
        birds: { $sum: "$numberOfBirds" },
        netWeight: { $sum: "$netWeight" },
      },
    },
  ]);

  const lastMonthStats = await LedgerModel.aggregate([
    {
      $match: {
        date: {
          $gte: startOfMonth(subDays(currentDate, 30)),
          $lte: endOfMonth(subDays(currentDate, 30)),
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
        birds: { $sum: "$numberOfBirds" },
        netWeight: { $sum: "$netWeight" },
      },
    },
  ]);

  const thisMonth = thisMonthStats[0] || {
    revenue: 0,
    transactions: 0,
    birds: 0,
    netWeight: 0,
  };

  const lastMonth = lastMonthStats[0] || {
    revenue: 0,
    transactions: 0,
    birds: 0,
    netWeight: 0,
  };

  // Calculate percentage changes
  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const response = {
    thisMonth: {
      revenue: Math.round(thisMonth.revenue * 100) / 100,
      transactions: thisMonth.transactions,
      birds: thisMonth.birds,
      netWeight: Math.round(thisMonth.netWeight * 100) / 100,
    },
    lastMonth: {
      revenue: Math.round(lastMonth.revenue * 100) / 100,
      transactions: lastMonth.transactions,
      birds: lastMonth.birds,
      netWeight: Math.round(lastMonth.netWeight * 100) / 100,
    },
    changes: {
      revenue: calculateChange(thisMonth.revenue, lastMonth.revenue),
      transactions: calculateChange(
        thisMonth.transactions,
        lastMonth.transactions
      ),
      birds: calculateChange(thisMonth.birds, lastMonth.birds),
      netWeight: calculateChange(thisMonth.netWeight, lastMonth.netWeight),
    },
  };

  res.status(200).json({
    status: "success",
    message: "Dashboard stats fetched successfully",
    data: response,
  });
});
