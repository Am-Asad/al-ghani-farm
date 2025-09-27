import z from "zod";

export const createBuyerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Buyer name must be at least 3 characters")
      .max(100, "Buyer name must be at most 100 characters")
      .trim(),
    contactNumber: z
      .string()
      .regex(
        /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/,
        "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits."
      ),
    address: z
      .string()
      .max(500, "Address must be at most 500 characters")
      .trim()
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateBuyerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, "Buyer name must be at least 3 characters")
      .max(100, "Buyer name must be at most 100 characters")
      .trim(),
    contactNumber: z
      .string()
      .regex(
        /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/,
        "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits."
      )
      .optional(),
    address: z
      .string()
      .max(500, "Address must be at most 500 characters")
      .trim()
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual buyer object (without body wrapper)
const buyerObjectSchema = z.object({
  name: z
    .string()
    .min(3, "Buyer name must be at least 3 characters")
    .max(100, "Buyer name must be at most 100 characters")
    .trim(),
  contactNumber: z
    .string()
    .regex(
      /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/,
      "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits."
    ),
  address: z
    .string()
    .max(500, "Address must be at most 500 characters")
    .trim()
    .optional(),
});

export const createBulkBuyersSchema = z.object({
  body: z.array(buyerObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const deleteBulkBuyersSchema = z.object({
  body: z
    .array(z.string().min(1, "Buyer ID is required"))
    .min(1, "At least one buyer ID is required"),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
