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

export const FlockModel = mongoose.model("Flock", flockSchema);
