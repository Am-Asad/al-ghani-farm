import { asyncHandler } from "../middleware/asyncHandler.js";
import { FarmModel } from "../models/farms.js";
import { FlockModel } from "../models/flocks.js";
import { BuyerModel } from "../models/buyer.js";
import { ShedModel } from "../models/sheds.js";

export const getAllEntities = asyncHandler(async (req, res) => {
  const [farms, flocks, buyers, sheds] = await Promise.all([
    FarmModel.find({}, "_id name").sort({ name: 1 }),
    FlockModel.find({}, "_id name farmId").sort({ name: 1 }),
    BuyerModel.find({}, "_id name").sort({ name: 1 }),
    ShedModel.find({}, "_id name flockId").sort({ name: 1 }),
  ]);

  res.status(200).json({
    success: true,
    message: "All entities fetched successfully",
    data: {
      farms,
      flocks,
      buyers,
      sheds,
      counts: {
        farms: farms.length,
        flocks: flocks.length,
        buyers: buyers.length,
        sheds: sheds.length,
      },
    },
  });
});
