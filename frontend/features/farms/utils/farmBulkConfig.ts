import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";
import { Farm } from "@/types/farm-types";

// Farm record schema for CSV parsing
export const farmRecordSchema = z.object({
  name: z
    .string()
    .min(3, "Farm name must be at least 3 characters")
    .max(50, "Farm name must be at most 50 characters")
    .trim(),
  supervisor: z
    .string()
    .min(3, "Supervisor name must be at least 3 characters")
    .max(50, "Supervisor name must be at most 50 characters")
    .trim(),
  totalSheds: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        throw new Error("Total sheds must be a valid number");
      }
      return num;
    })
    .refine((val) => val >= 1, "Total sheds must be at least 1")
    .refine((val) => Number.isInteger(val), "Total sheds must be an integer"),
});

export type FarmRecord = z.infer<typeof farmRecordSchema>;

// Expected CSV headers with variations
export const farmHeaders: Record<keyof FarmRecord, string[]> = {
  name: ["name", "farm_name", "farm name", "farmname"],
  supervisor: [
    "supervisor",
    "supervisor_name",
    "supervisor name",
    "manager",
    "manager_name",
    "manager name",
  ],
  totalSheds: [
    "totalSheds",
    "total_sheds",
    "total sheds",
    "sheds",
    "number_of_sheds",
    "number of sheds",
  ],
} as const;

// CSV configuration for farms
export const farmCSVConfig: CSVConfig<FarmRecord> = {
  schema: farmRecordSchema,
  headers: farmHeaders,
  entityName: "farm",
};

// Columns for data preview
export const farmColumns = [
  { key: "name" as keyof FarmRecord, label: "Name" },
  { key: "supervisor" as keyof FarmRecord, label: "Supervisor" },
  { key: "totalSheds" as keyof FarmRecord, label: "Total Sheds" },
];

// Template configuration
export const farmTemplateHeaders = ["name", "supervisor", "totalSheds"];
export const farmSampleData = ["Sample Farm", "John Doe", "5"];

// Transform function to convert FarmRecord to API format
export function transformFarmRecordsToAPI(
  farmRecords: FarmRecord[]
): Pick<Farm, "name" | "supervisor" | "totalSheds">[] {
  return farmRecords.map((record) => ({
    name: record.name,
    supervisor: record.supervisor,
    totalSheds: record.totalSheds,
  }));
}
