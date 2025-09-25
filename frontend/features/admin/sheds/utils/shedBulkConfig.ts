import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";

export const shedRecordSchema = z.object({
  name: z.string().min(3, "Shed name must be at least 3 characters").trim(),
  capacity: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        throw new Error("Capacity must be a valid number");
      }
      return num;
    })
    .pipe(
      z
        .number()
        .int("Capacity must be an integer")
        .min(1, "Capacity must be at least 1")
    )
    .optional(),
  farmId: z.string().min(1, "Farm ID is required"),
});

export type ShedRecord = z.infer<typeof shedRecordSchema>;

// Expected CSV headers with variations
export const shedHeaders: Record<keyof ShedRecord, string[]> = {
  name: ["name", "shed_name", "shed name", "shedname"],
  capacity: ["capacity", "cap", "max_capacity", "max capacity", "maxcapacity"],
  farmId: ["farmid", "farm_id", "farm id", "farm_id"],
} as const;

// CSV configuration for sheds
export const shedCSVConfig: CSVConfig<ShedRecord> = {
  schema: shedRecordSchema,
  headers: shedHeaders,
  entityName: "shed",
};

// Columns for data preview
export const shedColumns = [
  { key: "name" as keyof ShedRecord, label: "Name" },
  { key: "capacity" as keyof ShedRecord, label: "Capacity" },
  { key: "farmId" as keyof ShedRecord, label: "Farm Id" },
];

// Template configuration
export const shedTemplateHeaders = ["name", "capacity", "farmId"];

export const shedSampleData = ["Sample Shed", "1000", "farm_id_here"];

// Transform function to convert ShedRecord to API format
export function transformShedRecordsToAPI(shedRecords: ShedRecord[]): Array<{
  name: string;
  capacity?: number;
  farmId: string;
}> {
  return shedRecords.map((record) => ({
    name: record.name,
    capacity: record.capacity,
    farmId: record.farmId,
  }));
}
