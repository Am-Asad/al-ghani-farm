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
  const { search = "", buyerId = "" } = req.query;

  const andConditions = [];
  if (typeof buyerId === "string" && buyerId.trim()) {
    andConditions.push({ _id: buyerId });
  }
  if (typeof search === "string" && search.trim()) {
    andConditions.push({ name: { $regex: search.trim(), $options: "i" } });
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const buyers = await BuyerModel.find(query)
    .select("_id name")
    .sort({ name: 1 })
    .limit(10);

  res.status(200).json({
    status: "success",
    message: "Buyers fetched successfully",
    data: buyers,
  });
});
