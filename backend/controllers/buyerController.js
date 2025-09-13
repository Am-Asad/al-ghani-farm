import { asyncHandler } from "../middleware/asyncHandler.js";
import { BuyerModel } from "../models/buyer.js";
import { AppError } from "../utils/AppError.js";

export const getAllBuyers = asyncHandler(async (req, res) => {
  const buyers = await BuyerModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    message: "Buyers fetched successfully",
    data: buyers.map((buyer) => buyer.toObject()),
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
export const deleteBuyerById = asyncHandler(async (req, res) => {
  const { buyerId } = req.params;
  const buyer = await BuyerModel.findByIdAndDelete(buyerId);
  if (!buyer) {
    throw new AppError("Buyer not found", 404, "BUYER_NOT_FOUND", true);
  }
  res.status(200).json({
    status: "success",
    message: "Buyer deleted successfully",
    data: buyer.toObject(),
  });
});

export const deleteAllBuyers = asyncHandler(async (req, res) => {
  await BuyerModel.deleteMany({});
  res.status(200).json({
    status: "success",
    message: "All buyers deleted successfully",
    data: [],
  });
});
