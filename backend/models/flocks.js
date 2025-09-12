import mongoose from "mongoose";

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
  { timestamps: true, versionKey: false }
);

// Indexes
flockSchema.index({ farmId: 1 }); // to fetch all flocks by farm
flockSchema.index({ status: 1 }); // if we often filter by active/completed
flockSchema.index({ startDate: 1 }); // useful for chronological sorting

// Static methods
flockSchema.statics.getAllFlocksWithTotalChicks = function () {
  return this.aggregate([
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
      },
    },
    { $project: { sheds: 0 } }, // hide sheds if not needed
  ]);
};

flockSchema.statics.getFlockByIdWithTotalChicks = function (flockId) {
  return this.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(flockId) },
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
      },
    },
    { $project: { sheds: 0 } }, // hide sheds if not needed
  ]);
};

export const FlockModel = mongoose.model("Flock", flockSchema);
