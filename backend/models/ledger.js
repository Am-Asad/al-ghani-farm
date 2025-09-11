import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: [true, "Farm is required"],
    },
    flockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flock",
      required: [true, "Flock is required"],
    },
    shedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shed",
      required: [true, "Shed is required"],
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Buyer",
      required: [true, "Buyer is required"],
    },

    vehicleNumber: {
      type: String,
      required: [true, "Vehicle number is required"],
    },
    driverName: { type: String, required: [true, "Driver name is required"] },
    driverContact: {
      type: String,
      required: [true, "Driver contact is required"],
    },
    accountantName: {
      type: String,
      required: [true, "Accountant name is required"],
    },

    emptyVehicleWeight: {
      type: Number,
      required: [true, "Empty vehicle weight is required"],
    },
    grossWeight: { type: Number, required: [true, "Gross weight is required"] },
    netWeight: { type: Number, required: [true, "Net weight is required"] },
    numberOfBirds: {
      type: Number,
      required: [true, "Number of birds is required"],
    },
    rate: { type: Number, required: [true, "Rate is required"] },
    totalAmount: { type: Number, required: [true, "Total amount is required"] },
    amountPaid: { type: Number, default: 0 },

    date: { type: Date, required: [true, "Date is required"] },
  },
  { timestamps: true, versionKey: false }
);

// Indexes
ledgerSchema.index({ farmId: 1 });
ledgerSchema.index({ flockId: 1 });
ledgerSchema.index({ shedId: 1 });
ledgerSchema.index({ buyerId: 1 });
ledgerSchema.index({ date: 1 }); // for daily reports
ledgerSchema.index({ buyerId: 1, date: -1 }); // buyer history sorted by latest

export const LedgerModel = mongoose.model("Ledger", ledgerSchema);
