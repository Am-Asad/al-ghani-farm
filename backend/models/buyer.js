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

buyerSchema.statics.getAllBuyersPaginated = function ({
  search,
  limit = 10,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const sortDir = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    ...(search
      ? [
          {
            $match: {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { address: { $regex: search, $options: "i" } },
                { contactNumber: { $regex: search, $options: "i" } },
              ],
            },
          },
        ]
      : []),
    { $sort: { [sortBy]: sortDir } },
    {
      $facet: {
        items: [
          ...(offset > 0 ? [{ $skip: offset }] : []),
          { $limit: Math.max(limit, 0) },
        ],
        total: [{ $count: "count" }],
      },
    },
    {
      $project: {
        items: 1,
        total: { $ifNull: [{ $arrayElemAt: ["$total.count", 0] }, 0] },
      },
    },
  ];

  return this.aggregate(pipeline).then(
    (res) => res[0] || { items: [], total: 0 }
  );
};

export const BuyerModel = mongoose.model("Buyer", buyerSchema);
