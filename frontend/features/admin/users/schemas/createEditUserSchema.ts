import { z } from "zod";

// User edit validation schema
export const createEditUserSchema = (isEditMode: boolean) =>
  z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters"),
    email: z.string().email("Invalid email format"),
    password: isEditMode
      ? // allow empty string or a valid password
        z.union([
          z.literal(""),
          z.string().min(3, "Password must be at least 3 characters").max(100),
        ])
      : // strictly required on create
        z.string().min(3, "Password must be at least 3 characters").max(100),
    role: z.enum(["admin", "manager", "viewer"], {
      message: "Role is required",
    }),
  });

// Types derived from schemas
export type CreateEditUserSchema = z.infer<
  ReturnType<typeof createEditUserSchema>
>;
