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
      validate: {
        validator: function (v) {
          return /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/.test(
            v
          );
        },
      },
      message:
        "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits.",
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

// Pagination method
ledgerSchema.statics.getAllLedgersPaginated = function ({
  search = "",
  limit = 10,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = "desc",
  farmId = "",
  flockId = "",
  shedId = "",
  buyerId = "",
  dateFrom = "",
  dateTo = "",
  paymentStatus = "",
  totalAmountMin = "",
  totalAmountMax = "",
  amountPaidMin = "",
  amountPaidMax = "",
  balanceMin = "",
  balanceMax = "",
  netWeightMin = "",
  netWeightMax = "",
} = {}) {
  const sortDir = sortOrder === "asc" ? 1 : -1;

  // Allowed sort fields
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "date",
    "totalAmount",
    "amountPaid",
    "netWeight",
    "numberOfBirds",
    "rate",
    "vehicleNumber",
    "driverName",
  ];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const matchConditions = [];

  // Search functionality
  if (search && typeof search === "string" && search.trim()) {
    const searchRegex = { $regex: search, $options: "i" };
    const numericSearch = parseFloat(search);

    matchConditions.push({
      $or: [
        { driverName: searchRegex },
        { driverContact: searchRegex },
        { vehicleNumber: searchRegex },
        { accountantName: searchRegex },
        ...(isNaN(numericSearch)
          ? []
          : [{ numberOfBirds: numericSearch }, { rate: numericSearch }]),
      ],
    });
  }

  // Entity filters
  if (farmId && typeof farmId === "string" && farmId.trim()) {
    matchConditions.push({
      farmId: mongoose.Types.ObjectId.isValid(farmId)
        ? new mongoose.Types.ObjectId(farmId)
        : farmId,
    });
  }
  if (flockId && typeof flockId === "string" && flockId.trim()) {
    matchConditions.push({
      flockId: mongoose.Types.ObjectId.isValid(flockId)
        ? new mongoose.Types.ObjectId(flockId)
        : flockId,
    });
  }
  if (shedId && typeof shedId === "string" && shedId.trim()) {
    matchConditions.push({
      shedId: mongoose.Types.ObjectId.isValid(shedId)
        ? new mongoose.Types.ObjectId(shedId)
        : shedId,
    });
  }
  if (buyerId && typeof buyerId === "string" && buyerId.trim()) {
    matchConditions.push({
      buyerId: mongoose.Types.ObjectId.isValid(buyerId)
        ? new mongoose.Types.ObjectId(buyerId)
        : buyerId,
    });
  }

  // Date range filter
  if (dateFrom || dateTo) {
    const dateFilter = {};
    if (dateFrom) {
      dateFilter.$gte = new Date(dateFrom);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      dateFilter.$lte = toDate;
    }
    matchConditions.push({ date: dateFilter });
  }

  // Payment status filter
  if (
    paymentStatus &&
    typeof paymentStatus === "string" &&
    paymentStatus.trim()
  ) {
    const amountPaidField = { $subtract: ["$totalAmount", "$amountPaid"] };
    switch (paymentStatus) {
      case "paid":
        matchConditions.push({
          $expr: { $eq: ["$amountPaid", "$totalAmount"] },
        });
        break;
      case "partial":
        matchConditions.push({
          $expr: {
            $and: [
              { $gt: ["$amountPaid", 0] },
              { $lt: ["$amountPaid", "$totalAmount"] },
            ],
          },
        });
        break;
      case "unpaid":
        matchConditions.push({ $expr: { $eq: ["$amountPaid", 0] } });
        break;
    }
  }

  // Numeric range filters
  const addNumericRangeFilter = (field, min, max) => {
    if (min || max) {
      const range = {};
      if (min) {
        const minNum = parseFloat(min);
        if (!isNaN(minNum)) range.$gte = minNum;
      }
      if (max) {
        const maxNum = parseFloat(max);
        if (!isNaN(maxNum)) range.$lte = maxNum;
      }
      if (Object.keys(range).length > 0) {
        matchConditions.push({ [field]: range });
      }
    }
  };

  addNumericRangeFilter("totalAmount", totalAmountMin, totalAmountMax);
  addNumericRangeFilter("amountPaid", amountPaidMin, amountPaidMax);
  addNumericRangeFilter("netWeight", netWeightMin, netWeightMax);

  // Balance range filter (calculated field)
  if (balanceMin || balanceMax) {
    const balanceRange = {};
    if (balanceMin) {
      const minNum = parseFloat(balanceMin);
      if (!isNaN(minNum)) balanceRange.$gte = minNum;
    }
    if (balanceMax) {
      const maxNum = parseFloat(balanceMax);
      if (!isNaN(maxNum)) balanceRange.$lte = maxNum;
    }
    if (Object.keys(balanceRange).length > 0) {
      matchConditions.push({
        $expr: {
          $and: [
            {
              $gte: [
                { $subtract: ["$totalAmount", "$amountPaid"] },
                balanceRange.$gte || 0,
              ],
            },
            {
              $lte: [
                { $subtract: ["$totalAmount", "$amountPaid"] },
                balanceRange.$lte || Number.MAX_SAFE_INTEGER,
              ],
            },
          ],
        },
      });
    }
  }

  const pipeline = [
    // Add match conditions if any
    ...(matchConditions.length > 0
      ? [
          {
            $match:
              matchConditions.length === 1
                ? matchConditions[0]
                : { $and: matchConditions },
          },
        ]
      : []),

    // Lookup related entities
    {
      $lookup: {
        from: "farms",
        localField: "farmId",
        foreignField: "_id",
        as: "farmId",
        pipeline: [{ $project: { name: 1, supervisor: 1 } }],
      },
    },
    {
      $lookup: {
        from: "flocks",
        localField: "flockId",
        foreignField: "_id",
        as: "flockId",
        pipeline: [{ $project: { name: 1, status: 1 } }],
      },
    },
    {
      $lookup: {
        from: "sheds",
        localField: "shedId",
        foreignField: "_id",
        as: "shedId",
        pipeline: [{ $project: { name: 1, capacity: 1 } }],
      },
    },
    {
      $lookup: {
        from: "buyers",
        localField: "buyerId",
        foreignField: "_id",
        as: "buyerId",
        pipeline: [{ $project: { name: 1, contactNumber: 1, address: 1 } }],
      },
    },

    // Unwind the arrays to get single objects
    { $unwind: "$farmId" },
    { $unwind: "$flockId" },
    { $unwind: "$shedId" },
    { $unwind: "$buyerId" },

    // Add calculated balance field
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$amountPaid"] },
      },
    },

    // Sort
    { $sort: { [sortField]: sortDir } },

    // Pagination
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

export const LedgerModel = mongoose.model("Ledger", ledgerSchema);
