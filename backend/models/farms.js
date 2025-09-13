import mongoose from "mongoose";
import { FlockModel } from "./flocks.js";
import { ShedModel } from "./sheds.js";

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

// expose virtuals in JSON/Object output
farmSchema.set("toObject", { virtuals: true });
farmSchema.set("toJSON", { virtuals: true });

// virtual populate that returns a NUMBER (count), not an array
farmSchema.virtual("flocksCount", {
  ref: "Flock",
  localField: "_id",
  foreignField: "farmId",
  count: true, // <- key bit
});

farmSchema.pre(/^find/, function (next) {
  this.populate({ path: "flocksCount" }); // returns a number
  next();
});

// Cascading delete middleware - deletes all flocks and their sheds when a farm is deleted
farmSchema.pre(/^delete/, async function (next) {
  const farmId = this.getQuery()._id;

  if (farmId) {
    try {
      // Find all flocks belonging to this farm
      const flocks = await FlockModel.find({ farmId });
      const flockIds = flocks.map((flock) => flock._id);

      // Delete all sheds belonging to these flocks
      if (flockIds.length > 0) {
        await ShedModel.deleteMany({ flockId: { $in: flockIds } });
      }

      // Delete all flocks belonging to this farm
      await FlockModel.deleteMany({ farmId });

      console.log(
        `Cascading delete: Deleted ${flockIds.length} flocks and their sheds for farm ${farmId}`
      );
    } catch (error) {
      console.error("Error in cascading delete for farm:", error);
      return next(error);
    }
  }

  next();
});

export const FarmModel = mongoose.model("Farm", farmSchema);
