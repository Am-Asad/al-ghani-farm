import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    address: { type: String },
  },
  { timestamps: true, versionKey: false }
);

// Indexes
buyerSchema.index({ name: 1 }); // quick lookup by name
buyerSchema.index({ contactNumber: 1 }, { unique: true });
// ensures no duplicate buyers with same contact number

export const BuyerModel = mongoose.model("Buyer", buyerSchema);
