import z from "zod";

export const createFarmSchema = z.object({
  body: z.object({
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
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual farm object (without body wrapper)
const farmObjectSchema = z.object({
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
});

export const createBulkFarmsSchema = z.object({
  body: z.array(farmObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateFarmSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Farm name must be at least 3 characters")
      .max(100, "Farm name must be at most 100 characters")
      .trim()
      .optional(),
    supervisor: z
      .string()
      .min(3, "Supervisor name must be at least 3 characters")
      .max(100, "Supervisor name must be at most 100 characters")
      .trim()
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
