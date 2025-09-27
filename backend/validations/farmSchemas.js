import z from "zod";

export const createFarmSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Farm name must be at least 3 characters").trim(),
    supervisor: z
      .string()
      .min(3, "Supervisor name must be at least 3 characters")
      .trim(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual farm object (without body wrapper)
const farmObjectSchema = z.object({
  name: z.string().min(3, "Farm name must be at least 3 characters").trim(),
  supervisor: z
    .string()
    .min(3, "Supervisor name must be at least 3 characters")
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
      .trim()
      .optional(),
    supervisor: z
      .string()
      .min(3, "Supervisor name must be at least 3 characters")
      .trim()
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const deleteBulkFarmsSchema = z.object({
  body: z
    .array(z.string().min(1, "Farm ID cannot be empty"))
    .min(1, "At least one farm ID is required"),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
