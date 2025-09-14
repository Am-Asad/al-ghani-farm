import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";

const flexibleDateSchema = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  });

const flexibleOptionalDateSchema = z
  .string()
  .optional()
  .refine((date) => !date || !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  });

export const flockRecordSchema = z.object({
  name: z
    .string()
    .min(3, "Flock name must be at least 3 characters")
    .max(50, "Flock name must be at most 50 characters")
    .trim(),
  status: z
    .string()
    .transform((val) => val.toLowerCase())
    .pipe(z.enum(["active", "completed"]))
    .default("active"),
  startDate: flexibleDateSchema,
  endDate: flexibleOptionalDateSchema,
  farmId: z.string().min(1, "farmId is required"),
});

export type FlockRecord = z.infer<typeof flockRecordSchema>;

// Expected CSV headers with variations
export const flockHeaders: Record<keyof FlockRecord, string[]> = {
  name: ["name", "farm_name", "farm name", "farmname"],
  status: [
    "status",
    "status_name",
    "status name",
    "status_type",
    "status_type_name",
    "status_type name",
  ],
  startDate: ["startdate", "start_date", "start date", "start_date"],
  endDate: ["enddate", "end_date", "end date", "end_date"],
  farmId: ["farmid", "farm_id", "farm id", "farm_id"],
} as const;

// CSV configuration for flocks
export const flockCSVConfig: CSVConfig<FlockRecord> = {
  schema: flockRecordSchema,
  headers: flockHeaders,
  entityName: "flock",
};

// Columns for data preview
export const flockColumns = [
  { key: "name" as keyof FlockRecord, label: "Name" },
  { key: "status" as keyof FlockRecord, label: "Status" },
  { key: "startDate" as keyof FlockRecord, label: "Start Date" },
  { key: "endDate" as keyof FlockRecord, label: "End Date" },
  { key: "farmId" as keyof FlockRecord, label: "Farm Id" },
];

// Template configuration
export const flockTemplateHeaders = [
  "name",
  "status",
  "startDate",
  "endDate",
  "farmId",
];
export const flockSampleData = [
  "Sample Flock",
  "active",
  "2024-01-01",
  "2024-12-31",
  "farm_id_here",
];

// Transform function to convert FlockRecord to API format
export function transformFlockRecordsToAPI(flockRecords: FlockRecord[]): Array<{
  name: string;
  status: "active" | "completed";
  startDate: string;
  endDate: string;
  farmId: string;
}> {
  return flockRecords.map((record) => ({
    name: record.name,
    status: record.status,
    startDate: record.startDate,
    endDate: record.endDate || "",
    farmId: record.farmId,
  }));
}
