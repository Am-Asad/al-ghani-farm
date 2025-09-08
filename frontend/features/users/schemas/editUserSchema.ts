import { z } from "zod";

// User edit validation schema
export const editUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "Password must be at least 3 characters",
    }),
  role: z
    .enum(["admin", "manager", "viewer"], {
      message: "Role is required",
    })
    .optional()
    .default("viewer"),
});

// Types derived from schemas
export type EditUserFormData = z.infer<typeof editUserSchema>;
