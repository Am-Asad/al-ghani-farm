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
