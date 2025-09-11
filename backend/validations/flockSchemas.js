import { z } from "zod";

// Flexible date validation that accepts strings or dates and converts to Date objects
const flexibleDateSchema = z
  .union([
    z.string().refine((date) => !isNaN(Date.parse(date)), {
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

export const createFlockSchema = z.object({
  body: z.object({
    farmId: z.string().min(1, "farmId is required"),
    name: z
      .string()
      .min(3, "Flock name must be at least 3 characters")
      .max(50, "Flock name must be at most 50 characters")
      .trim(),
    status: z.enum(["active", "completed"]).default("active"),
    startDate: flexibleDateSchema,
    endDate: flexibleOptionalDateSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateFlockSchema = z.object({
  body: z.object({
    farmId: z.string().min(1, "farmId is required"),
    name: z
      .string()
      .min(3, "Flock name must be at least 3 characters")
      .max(50, "Flock name must be at most 50 characters")
      .trim()
      .optional(),
    status: z.enum(["active", "completed"]).default("active"),
    startDate: flexibleDateSchema,
    endDate: flexibleOptionalDateSchema,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual flock object (without body wrapper)
const flockObjectSchema = z.object({
  farmId: z.string().min(1, "farmId is required"),
  name: z
    .string()
    .min(3, "Flock name must be at least 3 characters")
    .max(50, "Flock name must be at most 50 characters")
    .trim(),
  status: z.enum(["active", "completed"]).default("active"),
  startDate: flexibleDateSchema,
  endDate: flexibleOptionalDateSchema,
});

export const createBulkFlocksSchema = z.object({
  body: z.array(flockObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
