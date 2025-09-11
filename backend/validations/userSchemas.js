import z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(100, "Password must be at most 100 characters"),
    role: z
      .enum(["admin", "manager", "viewer"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be a string",
      })
      .optional()
      .default("viewer"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const createUserBulkSchema = z.object({
  body: z.array(
    z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be at most 50 characters"),
      email: z.string().email("Invalid email format"),
      password: z
        .string()
        .min(3, "Password must be at least 3 characters")
        .max(100, "Password must be at most 100 characters"),
      role: z
        .enum(["admin", "manager", "viewer"], {
          required_error: "Role is required",
          invalid_type_error: "Role must be a string",
        })
        .optional()
        .default("viewer"),
    })
  ),

  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .preprocess(
        (val) =>
          typeof val === "string" && val.trim() === "" ? undefined : val,
        z.string().min(3, "Password must be at least 3 characters").max(100)
      )
      .optional(),

    role: z
      .enum(["admin", "manager", "viewer"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be a string",
      })
      .optional()
      .default("viewer"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
