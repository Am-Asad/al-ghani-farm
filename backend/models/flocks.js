import mongoose from "mongoose";

const flockSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] }, // batch no.
    status: { type: String, enum: ["active", "completed"], default: "active" },
    startDate: { type: Date, required: [true, "Start date is required"] },
    endDate: { type: Date },
    totalChicks: { type: Number, required: [true, "Total chicks is required"] },
    allocations: [
      {
        shedId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Shed",
          required: [true, "Shed ID is required"],
        },
        chicks: {
          type: Number,
          required: [true, "Number of chicks is required"],
          min: [0, "Number of chicks must be at least 0"],
        },
      },
    ],
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

// Static methods
// Get flock by ID with farm and shed information
flockSchema.statics.getFlockByIdWithFarmAndSheds = function (flockId) {
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
        localField: "allocations.shedId",
        foreignField: "_id",
        as: "shedDetails",
      },
    },
    {
      $addFields: {
        allocations: {
          $map: {
            input: "$allocations",
            as: "allocation",
            in: {
              chicks: "$$allocation.chicks",
              shed: {
                $let: {
                  vars: {
                    shedDetail: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$shedDetails",
                            cond: {
                              $eq: ["$$this._id", "$$allocation.shedId"],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    _id: "$$shedDetail._id",
                    name: "$$shedDetail.name",
                    capacity: "$$shedDetail.capacity",
                  },
                },
              },
            },
          },
        },
      },
    },
    { $project: { shedDetails: 0 } },
    { $sort: { createdAt: -1 } },
  ]);
};

// Get all flocks with farm and shed information
flockSchema.statics.getAllFlocksWithFarmAndSheds = function () {
  return this.aggregate([
    {
      $lookup: {
        from: "sheds",
        localField: "allocations.shedId",
        foreignField: "_id",
        as: "shedDetails",
      },
    },
    {
      $addFields: {
        allocations: {
          $map: {
            input: "$allocations",
            as: "allocation",
            in: {
              chicks: "$$allocation.chicks",
              shed: {
                $let: {
                  vars: {
                    shedDetail: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$shedDetails",
                            cond: {
                              $eq: ["$$this._id", "$$allocation.shedId"],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    _id: "$$shedDetail._id",
                    name: "$$shedDetail.name",
                    capacity: "$$shedDetail.capacity",
                  },
                },
              },
            },
          },
        },
      },
    },
    { $project: { shedDetails: 0 } },
    { $sort: { createdAt: -1 } },
  ]);
};

export const FlockModel = mongoose.model("Flock", flockSchema);
