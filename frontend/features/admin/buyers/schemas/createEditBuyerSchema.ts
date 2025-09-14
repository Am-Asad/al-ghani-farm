import z from "zod";

export const createEditBuyerSchema = z.object({
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

// Types derived from schemas
export type CreateEditBuyerSchema = z.infer<typeof createEditBuyerSchema>;
