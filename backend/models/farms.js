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

export const FarmModel = mongoose.model("Farm", farmSchema);
