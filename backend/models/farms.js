import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Farm name is required"],
      unique: [true, "Farm name must be unique"],
      trim: true,
    },
    supervisor: {
      type: String,
      required: [true, "Supervisor is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    id: false, // Disable the default id virtual
  }
);

farmSchema.index({ createdAt: -1 });
farmSchema.index({ updatedAt: -1 });

farmSchema.statics.getAllFarmsWithFlocksCount = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "flocks",
        localField: "_id",
        foreignField: "farmId",
        as: "flocks",
      },
    },
    { $addFields: { flocksCount: { $size: "$flocks" } } },
    { $sort: { createdAt: -1 } },
    { $project: { flocks: 0 } },
  ]);
};

farmSchema.statics.getFarmByIdWithFlocksCount = function (farmId) {
  return this.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId.isValid(farmId)
          ? new mongoose.Types.ObjectId(farmId)
          : farmId,
      },
    },
    {
      $lookup: {
        from: "flocks",
        localField: "_id",
        foreignField: "farmId",
        as: "flocks",
      },
    },
    { $addFields: { flocksCount: { $size: "$flocks" } } },
    { $sort: { createdAt: -1 } },
    { $project: { flocks: 0 } },
  ]);
};

export const FarmModel = mongoose.model("Farm", farmSchema);
