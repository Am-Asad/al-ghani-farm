import { z } from "zod";

// Flexible date validation that accepts strings or dates and converts to Date objects
const flexibleDateSchema = z
  .union([
    z
      .string()
      .min(1, "Start date is required")
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
    z.date(),
  ])
  .transform((date) => {
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  });

const flexibleOptionalDateSchema = z
  .union([
    z.string().refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
    z.date(),
  ])
  .optional()
  .transform((date) => {
    if (!date) return undefined;
    if (typeof date === "string") {
      return new Date(date);
    }
    return date;
  });

export const createEditFlockSchema = z.object({
  name: z
    .string()
    .min(3, "Flock name must be at least 3 characters")
    .max(50, "Flock name must be at most 50 characters")
    .trim(),
  status: z.enum(["active", "completed"]).default("active"),
  startDate: flexibleDateSchema,
  endDate: flexibleOptionalDateSchema,
  farmId: z.string().min(1, "Farm id is required"),
});

export type CreateEditFlockSchema = z.infer<typeof createEditFlockSchema>;
