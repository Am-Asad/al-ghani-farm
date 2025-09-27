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
  body: z
    .object({
      name: z
        .string()
        .min(3, "Flock name must be at least 3 characters")
        .trim(),
      status: z.enum(["active", "completed"]).default("active"),
      startDate: flexibleDateSchema,
      endDate: flexibleOptionalDateSchema,
      totalChicks: z
        .number({ required_error: "totalChicks is required" })
        .int("totalChicks must be an integer")
        .min(0, "totalChicks must be at least 0"),
      allocations: z
        .array(
          z.object({
            shedId: z.string().min(1, "Shed ID is required"),
            chicks: z
              .number({ required_error: "Number of chicks is required" })
              .int("Number of chicks must be an integer")
              .min(0, "Number of chicks must be at least 0"),
          })
        )
        .min(1, "At least one allocation is required"),
      farmId: z.string().min(1, "farmId is required"),
    })
    .refine(
      (data) => {
        const totalAllocatedChicks = data.allocations.reduce(
          (sum, allocation) => sum + allocation.chicks,
          0
        );
        return totalAllocatedChicks === data.totalChicks;
      },
      {
        message: "Total allocated chicks must equal total chicks",
        path: ["allocations"],
      }
    ),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateFlockSchema = z.object({
  body: z
    .object({
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
      totalChicks: z
        .number()
        .int("totalChicks must be an integer")
        .min(0, "totalChicks must be at least 0")
        .optional(),
      allocations: z
        .array(
          z.object({
            shedId: z.string().min(1, "Shed ID is required"),
            chicks: z
              .number()
              .int("Number of chicks must be an integer")
              .min(0, "Number of chicks must be at least 0"),
          })
        )
        .min(1, "At least one allocation is required")
        .optional(),
    })
    .refine(
      (data) => {
        if (data.allocations && data.totalChicks) {
          const totalAllocatedChicks = data.allocations.reduce(
            (sum, allocation) => sum + allocation.chicks,
            0
          );
          return totalAllocatedChicks === data.totalChicks;
        }
        return true;
      },
      {
        message: "Total allocated chicks must equal total chicks",
        path: ["allocations"],
      }
    ),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual flock object (without body wrapper)
const flockObjectSchema = z
  .object({
    farmId: z.string().min(1, "farmId is required"),
    name: z
      .string()
      .min(3, "Flock name must be at least 3 characters")
      .max(50, "Flock name must be at most 50 characters")
      .trim(),
    status: z.enum(["active", "completed"]).default("active"),
    startDate: flexibleDateSchema,
    endDate: flexibleOptionalDateSchema,
    totalChicks: z
      .number({ required_error: "totalChicks is required" })
      .int("totalChicks must be an integer")
      .min(0, "totalChicks must be at least 0"),
    allocations: z
      .array(
        z.object({
          shedId: z.string().min(1, "Shed ID is required"),
          chicks: z
            .number({ required_error: "Number of chicks is required" })
            .int("Number of chicks must be an integer")
            .min(0, "Number of chicks must be at least 0"),
        })
      )
      .min(1, "At least one allocation is required"),
  })
  .refine(
    (data) => {
      const totalAllocatedChicks = data.allocations.reduce(
        (sum, allocation) => sum + allocation.chicks,
        0
      );
      return totalAllocatedChicks === data.totalChicks;
    },
    {
      message: "Total allocated chicks must equal total chicks",
      path: ["allocations"],
    }
  );

export const createBulkFlocksSchema = z.object({
  body: z.array(flockObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const deleteBulkFlocksSchema = z.object({
  body: z
    .array(z.string().min(1, "Flock ID is required"))
    .min(1, "At least one flock ID is required"),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
