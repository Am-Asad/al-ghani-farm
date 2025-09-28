import mongoose from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { BuyerModel } from "../models/buyer.js";
import { LedgerModel } from "../models/ledger.js";
import { AppError } from "../utils/AppError.js";

export const getAllBuyers = asyncHandler(async (req, res) => {
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

  const { items, total } = await BuyerModel.getAllBuyersPaginated({
    search,
    limit: limitNum,
    offset: offsetNum,
    sortBy: sortField,
    sortOrder: sortDir,
  });

  res.status(200).json({
    status: "success",
    message: "Buyers fetched successfully",
    data: items.map((buyer) => ({ ...buyer })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount: total,
      hasMore: offsetNum + items.length < total,
    },
  });
});

export const getBuyerById = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  const buyer = await BuyerModel.findById(buyerId);
  if (!buyer) {
    throw new AppError("Buyer not found", 404, "BUYER_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "Buyer fetched successfully",
    data: buyer.toObject(),
  });
});

// Post
export const createBuyer = asyncHandler(async (req, res) => {
  const buyer = await BuyerModel.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Buyer created successfully",
    data: buyer.toObject(),
  });
});

export const createBulkBuyers = asyncHandler(async (req, res, next) => {
  const buyers = await BuyerModel.insertMany(req.body);

  // Check if no buyers were created
  if (buyers.length === 0) {
    const error = new AppError(
      "No buyers created",
      400,
      "NO_BUYERS_CREATED",
      true
    );
    return next(error);
  }

  // Return the buyers
  res.status(201).json({
    status: "success",
    message: "Buyers created successfully",
    data: buyers.map((buyer) => buyer.toObject()),
  });
});

export const createDummyBuyers = asyncHandler(async (req, res) => {
  const { count = 10 } = req.query;
  const countNum = Math.min(Math.max(parseInt(count, 10) || 10, 1), 100); // Limit between 1-100

  const dummyBuyers = [];
  const buyerNames = [
    "Muhammad Asif",
    "Fatima Khan",
    "Ahmed Hassan",
    "Aisha Malik",
    "Ali Raza",
    "Zainab Sheikh",
    "Omar Khan",
    "Maryam Ali",
    "Hassan Rizvi",
    "Khadija Ahmed",
    "Usman Malik",
    "Amina Khan",
    "Ibrahim Sheikh",
    "Hafsa Ali",
    "Tariq Raza",
    "Nadia Khan",
    "Saad Malik",
    "Layla Sheikh",
    "Hamza Ali",
    "Yusuf Khan",
  ];

  const addresses = [
    "123 Main Street, Karachi",
    "456 Park Avenue, Lahore",
    "789 Garden Road, Islamabad",
    "321 Market Street, Faisalabad",
    "654 University Road, Rawalpindi",
    "987 Mall Road, Multan",
    "147 Business District, Peshawar",
    "258 Industrial Area, Quetta",
    "369 Residential Block, Sialkot",
    "741 Commercial Zone, Gujranwala",
    "852 Downtown Area, Hyderabad",
    "963 Suburban Street, Sukkur",
    "159 Old City, Bahawalpur",
    "357 New Town, Sargodha",
    "468 City Center, Jhang",
    "579 Town Square, Sahiwal",
    "680 Village Road, Okara",
    "791 Farm Area, Kasur",
    "802 Border Town, Attock",
    "913 Hill Station, Abbottabad",
  ];

  // Generate Pakistani phone numbers
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
    const buyerName = buyerNames[i % buyerNames.length];
    const address = addresses[i % addresses.length];
    const phoneNumber = generatePhoneNumber(i);

    // Add unique suffix if we need more buyers than available names
    const uniqueSuffix =
      i >= buyerNames.length ? ` ${Math.floor(i / buyerNames.length) + 1}` : "";

    // Generate random date between 2020 and 2025
    const startYear = 2020;
    const endYear = 2025;
    const randomYear =
      startYear + Math.floor(Math.random() * (endYear - startYear + 1));
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = Math.floor(Math.random() * 28) + 1; // 1-28 to avoid month-end issues
    const randomDate = new Date(randomYear, randomMonth, randomDay);

    dummyBuyers.push({
      name: `${buyerName}${uniqueSuffix}`,
      contactNumber: phoneNumber,
      address: address,
      createdAt: randomDate,
      updatedAt: randomDate,
    });
  }

  const buyers = await BuyerModel.insertMany(dummyBuyers);

  res.status(201).json({
    status: "success",
    message: `${buyers.length} dummy buyers created successfully`,
    data: buyers.map((buyer) => buyer.toObject()),
  });
});

// Update
export const updateBuyerById = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;

  const buyer = await BuyerModel.findByIdAndUpdate(
    buyerId,
    { ...req.body },
    {
      new: true,
      runValidators: true, // Ensure validation runs on update
    }
  );

  if (!buyer) {
    throw new AppError("Buyer not found", 404, "BUYER_NOT_FOUND", true);
  }

  res.status(200).json({
    status: "success",
    message: "Buyer updated successfully",
    data: buyer.toObject(),
  });
});

// Delete
export const deleteBuyerById = asyncHandler(async (req, res, next) => {
  const { buyerId } = req.params;

  // Check if buyer exists
  const buyer = await BuyerModel.findById(buyerId);
  if (!buyer) {
    const error = new AppError("Buyer not found", 404, "BUYER_NOT_FOUND", true);
    return next(error);
  }

  // Delete all ledgers associated with this buyer
  await LedgerModel.deleteMany({ buyerId: buyerId });

  // Finally delete the buyer
  await BuyerModel.findByIdAndDelete(buyerId);

  res.status(200).json({
    status: "success",
    message: `Buyer with id ${buyerId} and all its associated ledgers deleted successfully`,
    data: buyer.toObject(),
  });
});

export const deleteAllBuyers = asyncHandler(async (req, res, next) => {
  // Find all buyers
  const buyers = await BuyerModel.find({});

  if (buyers.length === 0) {
    const error = new AppError(
      "No buyers found to delete",
      404,
      "NO_BUYERS_FOUND",
      true
    );
    return next(error);
  }

  const deletedBuyersIds = buyers.map((buyer) => buyer._id);

  // Delete all ledgers associated with these buyers
  await LedgerModel.deleteMany({
    buyerId: { $in: deletedBuyersIds },
  });

  // Finally delete all buyers
  const deletedBuyers = await BuyerModel.deleteMany({});

  if (deletedBuyers.deletedCount === 0) {
    throw new AppError("No buyers deleted", 400, "NO_BUYERS_DELETED", true);
  }

  res.status(200).json({
    status: "success",
    message: "All buyers and their associated ledgers deleted successfully",
    data: {
      deletedBuyers: deletedBuyers.deletedCount,
      deletedLedgers: "All related ledgers",
    },
  });
});

export const deleteBulkBuyers = asyncHandler(async (req, res, next) => {
  const buyerIds = req.body;

  // Validate input
  if (!Array.isArray(buyerIds) || buyerIds.length === 0) {
    throw new AppError(
      "Buyer IDs array is required",
      400,
      "INVALID_BUYER_IDS",
      true
    );
  }

  // Validate that all buyerIds are valid ObjectIds
  const validBuyerIds = buyerIds.filter(
    (id) => typeof id === "string" && mongoose.Types.ObjectId.isValid(id)
  );

  if (validBuyerIds.length === 0) {
    throw new AppError(
      "No valid buyer IDs provided",
      400,
      "INVALID_BUYER_IDS",
      true
    );
  }

  // Check if buyers exist
  const existingBuyers = await BuyerModel.find({ _id: { $in: validBuyerIds } });
  if (existingBuyers.length === 0) {
    throw new AppError(
      "No buyers found with provided IDs",
      404,
      "BUYERS_NOT_FOUND",
      true
    );
  }

  // Delete all ledgers associated with these buyers
  const deletedLedgers = await LedgerModel.deleteMany({
    buyerId: { $in: validBuyerIds },
  });

  // Finally delete the buyers themselves
  const deletedBuyers = await BuyerModel.deleteMany({
    _id: { $in: validBuyerIds },
  });

  res.status(200).json({
    status: "success",
    message: `Successfully deleted ${validBuyerIds.length} buyers and their associated data`,
    data: {
      deletedBuyers: deletedBuyers.deletedCount,
      deletedLedgers: deletedLedgers.deletedCount,
    },
  });
});

export const getBuyersForDropdown = asyncHandler(async (req, res) => {
  const { search = "", buyerIds = "" } = req.query;

  const orConditions = [];

  // Always include selected buyers (comma-separated list)
  if (typeof buyerIds === "string" && buyerIds.trim()) {
    const selectedBuyerIds = buyerIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    if (selectedBuyerIds.length > 0) {
      orConditions.push({ _id: { $in: selectedBuyerIds } });
    }
  }

  // Include search results if search query is provided
  if (typeof search === "string" && search.trim()) {
    orConditions.push({ name: { $regex: search.trim(), $options: "i" } });
  }

  // Build the final query
  let query;
  if (orConditions.length > 0) {
    query = { $or: orConditions };
  } else if (typeof search === "string" && search.trim()) {
    // If there's a search but no results, return empty
    query = { _id: { $in: [] } };
  } else {
    // If no search query, return default options (first 20 buyers)
    query = {};
  }

  const buyers = await BuyerModel.find(query)
    .select("_id name")
    .sort({ name: 1 })
    .limit(50); // Increased limit to accommodate selected items + search results

  res.status(200).json({
    status: "success",
    message: "Buyers fetched successfully",
    data: buyers,
  });
});
