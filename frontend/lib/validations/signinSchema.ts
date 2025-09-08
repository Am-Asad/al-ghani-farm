import { z } from "zod";

// User signin validation schema
export const signinSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(3, "Password is required and must be at least 3 characters"),
});

export type SigninFormData = z.infer<typeof signinSchema>;
