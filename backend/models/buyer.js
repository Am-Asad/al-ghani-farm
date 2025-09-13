import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      validate: {
        validator: function (v) {
          // Pakistani phone number validation regex
          return /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/.test(
            v
          );
        },
        message:
          "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits.",
      },
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
