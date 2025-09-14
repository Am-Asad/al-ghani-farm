import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";
import { Farm } from "@/types";

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
];

// Template configuration
export const farmTemplateHeaders = ["name", "supervisor"];
export const farmSampleData = ["Sample Farm", "John Doe", "5"];

// Transform function to convert FarmRecord to API format
export function transformFarmRecordsToAPI(
  farmRecords: FarmRecord[]
): Pick<Farm, "name" | "supervisor">[] {
  return farmRecords.map((record) => ({
    name: record.name,
    supervisor: record.supervisor,
  }));
}
