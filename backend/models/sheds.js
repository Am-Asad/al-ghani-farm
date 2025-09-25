import mongoose from "mongoose";

const shedSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    capacity: { type: Number, required: [true, "Capacity is required"] },
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: [true, "Farm is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

// Indexes
shedSchema.index({ farmId: 1 }); // fetch all sheds inside a farm
shedSchema.index({ name: 1, farmId: 1 }, { unique: true });
// Ensures no duplicate shed names inside the same farm

export const ShedModel = mongoose.model("Shed", shedSchema);
