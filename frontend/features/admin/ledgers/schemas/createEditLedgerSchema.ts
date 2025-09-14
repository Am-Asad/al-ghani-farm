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

export const createEditLedgerSchema = z
  .object({
    farmId: z.string().min(1, "Farm ID is required"),
    flockId: z.string().min(1, "Flock ID is required"),
    shedId: z.string().min(1, "Shed ID is required"),
    buyerId: z.string().min(1, "Buyer ID is required"),
    vehicleNumber: z
      .string()
      .min(3, "Vehicle number is required")
      .max(20, "Vehicle number must be at most 20 characters")
      .trim(),
    driverName: z
      .string()
      .min(3, "Driver name is required")
      .max(100, "Driver name must be at most 100 characters")
      .trim(),
    driverContact: z
      .string()
      .regex(
        /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/,
        "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits."
      ),
    accountantName: z
      .string()
      .min(3, "Accountant name is required")
      .max(100, "Accountant name must be at most 100 characters")
      .trim(),
    emptyVehicleWeight: z
      .number()
      .positive("Empty vehicle weight must be a positive number"),
    grossWeight: z
      .number()
      .positive("Gross weight must be greater than empty vehicle weight"),
    netWeight: z
      .number()
      .positive(
        "Net weight must be equal to gross weight minus empty vehicle weight"
      ),
    numberOfBirds: z
      .number()
      .int("Number of birds must be a whole number")
      .positive("Number of birds must be a positive number"),
    rate: z.number().positive("Rate must be a positive number"),
    totalAmount: z
      .number()
      .positive("Total amount must be equal to net weight * rate"),
    amountPaid: z.number().min(0, "Amount paid cann negative").default(0),
    date: flexibleDateSchema,
  })
  .refine((data) => data.grossWeight > data.emptyVehicleWeight, {
    message: "Gross weight must be greater than empty vehicle weight",
    path: ["grossWeight"],
  })
  .refine(
    (data) => data.netWeight === data.grossWeight - data.emptyVehicleWeight,
    {
      message:
        "Net weight must be equal to gross weight minus empty vehicle weight",
      path: ["netWeight"],
    }
  )
  .refine((data) => data.totalAmount === data.netWeight * data.rate, {
    message: "Total amount must be equal to net weight * rate",
    path: ["totalAmount"],
  })
  .refine((data) => data.amountPaid <= data.totalAmount, {
    message: "Amount paid must be less than or equal to total amount",
    path: ["amountPaid"],
  });

export type CreateEditLedgerSchema = z.infer<typeof createEditLedgerSchema>;
