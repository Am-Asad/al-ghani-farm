import { z } from "zod";

// Create farm validation schema
export const createEditFarmSchema = z.object({
  name: z
    .string()
    .min(3, "Farm name must be at least 3 characters")
    .max(50, "Farm name must be at most 50 characters")
    .trim(),
  supervisor: z
    .string()
    .min(3, "Supervisor name must be at least 3 characters")
    .max(50, "Supervisor name must be at most 50 characters")
    .trim(),
  totalSheds: z
    .number({
      error: "Total sheds must be a number",
    })
    .int("Total sheds must be an integer")
    .min(1, "Total sheds must be at least 1"),
});

// Types derived from schemas
export type CreateEditFarmSchema = z.infer<typeof createEditFarmSchema>;
