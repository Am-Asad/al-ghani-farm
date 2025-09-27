import { z } from "zod";

export const createShedSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Shed name must be at least 3 characters").trim(),
    capacity: z
      .number()
      .int("Capacity must be an integer")
      .min(0, "Capacity must be at least 0"),
    farmId: z.string().min(1, "Farm ID is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateShedSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Shed name must be at least 3 characters").trim(),
    capacity: z
      .number()
      .int("Capacity must be an integer")
      .min(0, "Capacity must be at least 0")
      .optional(),
    farmId: z.string().min(1, "Farm ID is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual shed object (without body wrapper)
const shedObjectSchema = z.object({
  name: z.string().min(3, "Shed name must be at least 3 characters").trim(),
  capacity: z
    .number()
    .int("Capacity must be an integer")
    .min(0, "Capacity must be at least 0"),
  farmId: z.string().min(1, "Farm ID is required"),
});

export const createBulkShedsSchema = z.object({
  body: z.array(shedObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const deleteBulkShedsSchema = z.object({
  body: z
    .array(z.string().min(1, "Shed ID is required"))
    .min(1, "At least one shed ID is required"),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
