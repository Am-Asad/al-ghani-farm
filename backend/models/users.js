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
    permissions: {
      type: [
        {
          resource: {
            type: String,
            enum: [
              "farms",
              "ledgers",
              "reports",
              "users",
              "vehicles",
              "brokers",
            ],
            required: true,
          },
          actions: {
            type: [String],
            enum: ["create", "read", "update", "delete"],
            required: true,
            validate: {
              validator: function (actions) {
                return actions && actions.length > 0;
              },
              message: "At least one action must be specified",
            },
          },
        },
      ],
      default: [
        {
          resource: "farms",
          actions: ["read"],
        },
        {
          resource: "ledgers",
          actions: ["read"],
        },
        {
          resource: "reports",
          actions: ["read"],
        },
        {
          resource: "users",
          actions: ["read"],
        },
        {
          resource: "vehicles",
          actions: ["read"],
        },
        {
          resource: "brokers",
          actions: ["read"],
        },
      ],
    },
  },
  { timestamps: true }
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

export const UserModel = mongoose.model("User", userSchema);

export default UserModel;
