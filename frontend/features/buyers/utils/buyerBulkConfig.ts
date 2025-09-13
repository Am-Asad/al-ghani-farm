import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";
import { Buyer } from "@/types";

// Buyer record schema for CSV parsing
export const buyerRecordSchema = z.object({
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

export type BuyerRecord = z.infer<typeof buyerRecordSchema>;

// Expected CSV headers with variations
export const buyerHeaders: Record<keyof BuyerRecord, string[]> = {
  name: [
    "name",
    "buyer_name",
    "buyer name",
    "buyername",
    "customer_name",
    "customer name",
  ],
  contactNumber: [
    "contactNumber",
    "contact_number",
    "contact number",
    "phone",
    "phone_number",
    "phone number",
    "mobile",
    "mobile_number",
    "mobile number",
    "contact",
  ],
  address: [
    "address",
    "location",
    "street_address",
    "street address",
    "full_address",
    "full address",
  ],
} as const;

// CSV configuration for buyers
export const buyerCSVConfig: CSVConfig<BuyerRecord> = {
  schema: buyerRecordSchema,
  headers: buyerHeaders,
  entityName: "buyer",
};

// Columns for data preview
export const buyerColumns = [
  { key: "name" as keyof BuyerRecord, label: "Name" },
  { key: "contactNumber" as keyof BuyerRecord, label: "Contact Number" },
  { key: "address" as keyof BuyerRecord, label: "Address" },
];

// Template configuration
export const buyerTemplateHeaders = ["name", "contactNumber", "address"];
export const buyerSampleData = [
  "John Doe",
  "03001234567",
  "123 Main Street, Lahore",
];

// Transform function to convert BuyerRecord to API format
export function transformBuyerRecordsToAPI(
  buyerRecords: BuyerRecord[]
): Pick<Buyer, "name" | "contactNumber" | "address">[] {
  return buyerRecords.map((record) => ({
    name: record.name,
    contactNumber: record.contactNumber,
    address: record.address,
  }));
}
