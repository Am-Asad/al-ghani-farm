import mongoose from "mongoose";

const shedSchema = new mongoose.Schema(
  {
    flockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flock",
      required: [true, "Flock is required"],
    },
    name: { type: String, required: [true, "Name is required"] }, // Shed-1, Shed-2
    totalChicks: { type: Number, required: [true, "Total chicks is required"] },
  },
  { timestamps: true, versionKey: false }
);

// Indexes
shedSchema.index({ flockId: 1 }); // fetch all sheds inside a flock
shedSchema.index({ name: 1, flockId: 1 }, { unique: true });
// Ensures no duplicate shed names inside the same flock

export const ShedModel = mongoose.model("Shed", shedSchema);
