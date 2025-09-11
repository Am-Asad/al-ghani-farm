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
    totalSheds: {
      type: Number,
      required: [true, "Total sheds is required"],
      positive: true,
    },
  },
  { timestamps: true, versionKey: false }
);

farmSchema.index({ createdAt: -1 });
farmSchema.index({ updatedAt: -1 });

export const FarmModel = mongoose.model("Farm", farmSchema);
