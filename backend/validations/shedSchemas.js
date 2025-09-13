import { z } from "zod";

export const createShedSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Shed name must be at least 3 characters")
      .max(50, "Shed name must be at most 50 characters")
      .trim(),
    totalChicks: z
      .number()
      .int("Total chicks must be an integer")
      .min(0, "Total chicks must be at least 1")
      .max(1000000, "Total chicks must be at most 1,000,000"),
    flockId: z.string().min(1, "Flock ID is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateShedSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Shed name must be at least 3 characters")
      .max(50, "Shed name must be at most 50 characters")
      .trim(),
    totalChicks: z
      .number()
      .int("Total chicks must be an integer")
      .min(0, "Total chicks must be at least 1")
      .max(1000000, "Total chicks must be at most 1,000,000"),
    flockId: z.string().min(1, "Flock ID is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual shed object (without body wrapper)
const shedObjectSchema = z.object({
  name: z
    .string()
    .min(3, "Shed name must be at least 3 characters")
    .max(50, "Shed name must be at most 50 characters")
    .trim(),
  totalChicks: z
    .number()
    .int("Total chicks must be an integer")
    .min(0, "Total chicks must be at least 1")
    .max(1000000, "Total chicks must be at most 1,000,000"),
  flockId: z.string().min(1, "Flock ID is required"),
});

export const createBulkShedsSchema = z.object({
  body: z.array(shedObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
