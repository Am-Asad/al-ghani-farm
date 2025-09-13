import mongoose from "mongoose";
import { ShedModel } from "./sheds.js";

const flockSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] }, // batch no.
    status: { type: String, enum: ["active", "completed"], default: "active" },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: [true, "Farm Id is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: false, // Disable the default id virtual
  }
);

// Indexes
flockSchema.index({ farmId: 1 }); // to fetch all flocks by farm
flockSchema.index({ status: 1 }); // if we often filter by active/completed
flockSchema.index({ startDate: 1 }); // useful for chronological sorting

// expose virtuals in JSON/Object output
flockSchema.set("toObject", { virtuals: true });
flockSchema.set("toJSON", { virtuals: true });

// Static methods
// Calculate total chicks and sheds count with flockId
flockSchema.statics.getFlockByIdWithTotalChicks = function (flockId) {
  return this.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.isValid(flockId)
          ? new mongoose.Types.ObjectId(flockId)
          : flockId,
      },
    },
    {
      $lookup: {
        from: "sheds",
        localField: "_id",
        foreignField: "flockId",
        as: "sheds",
      },
    },
    {
      $addFields: {
        totalChicks: { $sum: "$sheds.totalChicks" },
        shedsCount: { $size: "$sheds" }, // Add shedsCount calculation
      },
    },
    { $project: { sheds: 0 } }, // hide sheds if not needed
  ]);
};

// Calculate total chicks and sheds count for all the flocks
flockSchema.statics.getAllFlocksWithTotalChicks = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "sheds",
        localField: "_id",
        foreignField: "flockId",
        as: "sheds",
      },
    },
    {
      $addFields: {
        totalChicks: { $sum: "$sheds.totalChicks" },
        shedsCount: { $size: "$sheds" }, // Add shedsCount calculation
      },
    },
    { $project: { sheds: 0 } }, // hide sheds if not needed
  ]);
};

// Calculate total chicks and sheds count for all the flocks in a farm
flockSchema.statics.getAllFlocksWithTotalChicksForFarm = function (farmId) {
  return this.aggregate([
    {
      $match: {
        farmId: mongoose.Types.ObjectId.isValid(farmId)
          ? new mongoose.Types.ObjectId(farmId)
          : farmId,
      },
    },
    {
      $lookup: {
        from: "sheds", // Mongo collection name
        localField: "_id",
        foreignField: "flockId",
        as: "sheds",
      },
    },
    {
      $addFields: {
        totalChicks: { $sum: "$sheds.totalChicks" },
        shedsCount: { $size: "$sheds" }, // Add shedsCount calculation
      },
    },
    { $project: { sheds: 0 } }, // hide sheds if not needed
  ]);
};

export const FlockModel = mongoose.model("Flock", flockSchema);
