import z from "zod";

export const createFarmSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Farm name must be at least 3 characters").trim(),
    supervisor: z
      .string()
      .min(3, "Supervisor name must be at least 3 characters")
      .trim(),
    totalSheds: z
      .number({
        required_error: "Total sheds is required",
        invalid_type_error: "Total sheds must be a number",
      })
      .int("Total sheds must be an integer")
      .min(1, "Total sheds must be at least 1"),
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
  totalSheds: z
    .number({
      required_error: "Total sheds is required",
      invalid_type_error: "Total sheds must be a number",
    })
    .int("Total sheds must be an integer")
    .min(1, "Total sheds must be at least 1"),
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
    totalSheds: z
      .number({
        invalid_type_error: "Total sheds must be a number",
      })
      .int("Total sheds must be an integer")
      .min(1, "Total sheds must be at least 1")
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
