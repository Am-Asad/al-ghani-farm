import { z } from "zod";

// Signup Schema
export const signupSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be less than 50 characters"),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .min(3, "Password must be at least 3 characters")
      .max(100, "Password must be less than 100 characters"),
    role: z.enum(["admin", "manager", "viewer"]).optional().default("viewer"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Signin Schema
export const signinSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
