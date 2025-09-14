import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";
import { Ledger } from "@/types";

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

// Ledger record schema for CSV parsing
export const ledgerRecordSchema = z
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
    amountPaid: z.number().min(0, "Amount paid cannot be negative").default(0),
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

export type LedgerRecord = z.infer<typeof ledgerRecordSchema>;

// Expected CSV headers with variations
export const ledgerHeaders: Record<keyof LedgerRecord, string[]> = {
  farmId: ["farmId", "farm_id", "farm id", "farm"],
  flockId: ["flockId", "flock_id", "flock id", "flock"],
  shedId: ["shedId", "shed_id", "shed id", "shed"],
  buyerId: ["buyerId", "buyer_id", "buyer id", "buyer"],
  vehicleNumber: [
    "vehicleNumber",
    "vehicle_number",
    "vehicle number",
    "vehicle",
    "truck",
    "truck_number",
    "truck number",
  ],
  driverName: [
    "driverName",
    "driver_name",
    "driver name",
    "driver",
    "driverName",
  ],
  driverContact: [
    "driverContact",
    "driver_contact",
    "driver contact",
    "contact",
    "phone",
    "mobile",
  ],
  accountantName: [
    "accountantName",
    "accountant_name",
    "accountant name",
    "accountant",
  ],
  emptyVehicleWeight: [
    "emptyVehicleWeight",
    "empty_vehicle_weight",
    "empty vehicle weight",
    "empty_weight",
    "empty weight",
    "tare_weight",
    "tare weight",
  ],
  grossWeight: [
    "grossWeight",
    "gross_weight",
    "gross weight",
    "total_weight",
    "total weight",
  ],
  netWeight: [
    "netWeight",
    "net_weight",
    "net weight",
    "actual_weight",
    "actual weight",
  ],
  numberOfBirds: [
    "numberOfBirds",
    "number_of_birds",
    "number of birds",
    "birds",
    "count",
    "quantity",
  ],
  rate: ["rate", "price", "price_per_kg", "price per kg", "rate_per_kg"],
  totalAmount: [
    "totalAmount",
    "total_amount",
    "total amount",
    "amount",
    "total",
  ],
  amountPaid: [
    "amountPaid",
    "amount_paid",
    "amount paid",
    "paid",
    "paid_amount",
    "paid amount",
  ],
  date: ["date", "transaction_date", "transaction date", "entry_date"],
} as const;

// CSV configuration for ledgers
export const ledgerCSVConfig: CSVConfig<LedgerRecord> = {
  schema: ledgerRecordSchema,
  headers: ledgerHeaders,
  entityName: "ledger",
};

// Columns for data preview
export const ledgerColumns = [
  { key: "vehicleNumber" as keyof LedgerRecord, label: "Vehicle Number" },
  { key: "driverName" as keyof LedgerRecord, label: "Driver Name" },
  { key: "driverContact" as keyof LedgerRecord, label: "Driver Contact" },
  { key: "accountantName" as keyof LedgerRecord, label: "Accountant" },
  { key: "netWeight" as keyof LedgerRecord, label: "Net Weight (kg)" },
  { key: "numberOfBirds" as keyof LedgerRecord, label: "Number of Birds" },
  { key: "rate" as keyof LedgerRecord, label: "Rate" },
  { key: "totalAmount" as keyof LedgerRecord, label: "Total Amount" },
  { key: "amountPaid" as keyof LedgerRecord, label: "Amount Paid" },
  { key: "date" as keyof LedgerRecord, label: "Date" },
];

// Template configuration
export const ledgerTemplateHeaders = [
  "farmId",
  "flockId",
  "shedId",
  "buyerId",
  "vehicleNumber",
  "driverName",
  "driverContact",
  "accountantName",
  "emptyVehicleWeight",
  "grossWeight",
  "netWeight",
  "numberOfBirds",
  "rate",
  "totalAmount",
  "amountPaid",
  "date",
];

export const ledgerSampleData = [
  "farm_id_1",
  "flock_id_1",
  "shed_id_1",
  "buyer_id_1",
  "ABC-123",
  "John Doe",
  "03001234567",
  "Jane Smith",
  "1000",
  "2500",
  "1500",
  "100",
  "200",
  "300000",
  "150000",
  "2024-01-15",
];

// Transform function to convert LedgerRecord to API format
export function transformLedgerRecordsToAPI(
  ledgerRecords: LedgerRecord[]
): (Omit<Ledger, "_id" | "createdAt" | "updatedAt" | "date"> & {
  date: string;
})[] {
  return ledgerRecords.map((record) => ({
    farmId: record.farmId,
    flockId: record.flockId,
    shedId: record.shedId,
    buyerId: record.buyerId,
    vehicleNumber: record.vehicleNumber,
    driverName: record.driverName,
    driverContact: record.driverContact,
    accountantName: record.accountantName,
    emptyVehicleWeight: record.emptyVehicleWeight,
    grossWeight: record.grossWeight,
    netWeight: record.netWeight,
    numberOfBirds: record.numberOfBirds,
    rate: record.rate,
    totalAmount: record.totalAmount,
    amountPaid: record.amountPaid,
    date: record.date.toISOString(),
  }));
}
