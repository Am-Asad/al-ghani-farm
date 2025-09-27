import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [50, "Username must be at most 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (email) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [3, "Password must be at least 3 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "manager", "viewer"],
      default: "viewer",
    },
  },
  { timestamps: true, versionKey: false }
);

// INDEXES
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });

// PRE / POST MIDDLEWARES
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// METHODS
userSchema.methods.comparePassword = async function (
  inputPassword,
  storedPassword
) {
  return await bcrypt.compare(inputPassword, storedPassword);
};

// STATICS
userSchema.statics.getAllUsersPaginated = function ({
  search,
  role,
  limit = 10,
  offset = 0,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  const sortDir = sortOrder === "asc" ? 1 : -1;

  const pipeline = [
    ...(search || role
      ? [
          {
            $match: {
              ...(search
                ? {
                    $or: [
                      { username: { $regex: search, $options: "i" } },
                      { email: { $regex: search, $options: "i" } },
                    ],
                  }
                : {}),
              ...(role && role !== "" ? { role } : {}),
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
          { $project: { password: 0 } }, // Exclude password from results
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

export const UserModel = mongoose.model("User", userSchema);
