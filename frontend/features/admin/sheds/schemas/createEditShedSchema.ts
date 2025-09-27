import { z } from "zod";

export const createEditShedSchema = z.object({
  name: z.string().min(3, "Shed name must be at least 3 characters").trim(),
  capacity: z
    .number()
    .int("Capacity must be an integer")
    .min(0, "Capacity must be at least 0"),
  farmId: z.string().min(1, "Farm is required"),
});

export type CreateEditShedSchema = z.infer<typeof createEditShedSchema>;
