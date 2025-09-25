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

farmSchema.statics.getAllFarmsWithShedsAndFlocksCount = function ({
  search,
  limit = 10,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const sortDir = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    ...(search
      ? [
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { supervisor: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),
    {
      $lookup: {
        from: "flocks",
        localField: "_id",
        foreignField: "farmId",
        as: "flocks",
      },
    },
    {
      $lookup: {
        from: "sheds",
        localField: "_id",
        foreignField: "farmId",
        as: "sheds",
      },
    },
    {
      $addFields: {
        totalFlocks: { $size: "$flocks" },
        totalSheds: { $size: "$sheds" },
      },
    },
    { $project: { flocks: 0, sheds: 0 } },
    { $sort: { [sortBy]: sortDir } },
    {
      $facet: {
        items: [
          ...(offset > 0 ? [{ $skip: offset }] : []),
          { $limit: Math.max(limit, 0) },
        ],
        total: [{ $count: "count" }],
      },
    },
    {
      $project: {
        items: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
      },
    },
  ];

  return this.aggregate(pipeline).then(
    (res) => res[0] || { items: [], total: 0 }
  );
};

farmSchema.statics.getFarmByIdWithFlocksAndShedsCount = function (farmId) {
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
    {
      $lookup: {
        from: "sheds",
        localField: "_id",
        foreignField: "farmId",
        as: "sheds",
      },
    },
    {
      $addFields: {
        totalFlocks: { $size: "$flocks" },
        totalSheds: { $size: "$sheds" },
      },
    },
    { $sort: { createdAt: -1 } },
    { $project: { flocks: 0, sheds: 0 } },
  ]);
};

export const FarmModel = mongoose.model("Farm", farmSchema);
