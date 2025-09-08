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

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["admin", "manager", "viewer"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be a string",
    }),
  }),
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
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(100, "Password must be at most 100 characters")
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
