import z from "zod";

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

export const createLedgerSchema = z.object({
  body: z
    .object({
      farmId: z.string().min(1, "Farm ID is required"),
      flockId: z.string().min(1, "Flock ID is required"),
      shedId: z.string().min(1, "Shed ID is required"),
      buyerId: z.string().min(1, "Buyer ID is required"),
      vehicleNumber: z.string().min(3, "Vehicle number is required").trim(),
      driverName: z.string().min(3, "Driver name is required").trim(),
      driverContact: z
        .string()
        .regex(
          /^((\+92)|(0092))-{0,1}3[0-9]{2}-{0,1}[0-9]{7}$|^03[0-9]{2}[0-9]{7}$/,
          "Invalid Pakistani contact number format. It should start with +92, 0092, or 03, followed by 10 digits."
        ),
      accountantName: z.string().min(3, "Accountant name is required").trim(),
      emptyVehicleWeight: z
        .number()
        .int("Empty vehicle weight must be a whole number")
        .min(0, "Empty vehicle weight must be 0 or greater"),
      grossWeight: z
        .number()
        .int("Gross weight must be a whole number")
        .min(0, "Gross weight must be 0 or greater"),
      netWeight: z
        .number()
        .int("Net weight must be a whole number")
        .min(0, "Net weight must be 0 or greater"),
      numberOfBirds: z
        .number()
        .int("Number of birds must be a whole number")
        .min(0, "Number of birds must be 0 or greater"),
      rate: z
        .number()
        .int("Rate must be a whole number")
        .min(0, "Rate must be 0 or greater"),
      totalAmount: z
        .number()
        .int("Total amount must be a whole number")
        .min(0, "Total amount must be 0 or greater"),
      amountPaid: z
        .number()
        .int("Amount paid must be a whole number")
        .min(0, "Amount paid must be 0 or greater")
        .default(0),
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
    }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateLedgerSchema = z.object({
  body: z
    .object({
      farmId: z.string().min(1, "Farm ID is required").optional(),
      flockId: z.string().min(1, "Flock ID is required").optional(),
      shedId: z.string().min(1, "Shed ID is required").optional(),
      buyerId: z.string().min(1, "Buyer ID is required").optional(),
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
        .int("Empty vehicle weight must be a whole number")
        .min(0, "Empty vehicle weight must be 0 or greater"),
      grossWeight: z
        .number()
        .int("Gross weight must be a whole number")
        .min(0, "Gross weight must be 0 or greater"),
      netWeight: z
        .number()
        .int("Net weight must be a whole number")
        .min(0, "Net weight must be 0 or greater"),
      numberOfBirds: z
        .number()
        .int("Number of birds must be a whole number")
        .min(0, "Number of birds must be 0 or greater"),
      rate: z
        .number()
        .int("Rate must be a whole number")
        .min(0, "Rate must be 0 or greater"),
      totalAmount: z
        .number()
        .int("Total amount must be a whole number")
        .min(0, "Total amount must be 0 or greater"),
      amountPaid: z
        .number()
        .int("Amount paid must be a whole number")
        .min(0, "Amount paid must be 0 or greater")
        .default(0),
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
    }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

// Schema for individual ledger object (without body wrapper)
const ledgerObjectSchema = z
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
      .int("Empty vehicle weight must be a whole number")
      .min(0, "Empty vehicle weight must be 0 or greater"),
    grossWeight: z
      .number()
      .int("Gross weight must be a whole number")
      .min(0, "Gross weight must be 0 or greater"),
    netWeight: z
      .number()
      .int("Net weight must be a whole number")
      .min(0, "Net weight must be 0 or greater"),
    numberOfBirds: z
      .number()
      .int("Number of birds must be a whole number")
      .min(0, "Number of birds must be 0 or greater"),
    rate: z
      .number()
      .int("Rate must be a whole number")
      .min(0, "Rate must be 0 or greater"),
    totalAmount: z
      .number()
      .int("Total amount must be a whole number")
      .min(0, "Total amount must be 0 or greater"),
    amountPaid: z
      .number()
      .int("Amount paid must be a whole number")
      .min(0, "Amount paid must be 0 or greater")
      .default(0),
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

export const createBulkLedgersSchema = z.object({
  body: z.array(ledgerObjectSchema),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
