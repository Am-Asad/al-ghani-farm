import { z } from "zod";
import { CSVConfig } from "@/utils/csvParser";

export const shedRecordSchema = z.object({
  name: z
    .string()
    .min(3, "Shed name must be at least 3 characters")
    .max(50, "Shed name must be at most 50 characters")
    .trim(),
  totalChicks: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        throw new Error("Total chicks must be a valid number");
      }
      return num;
    })
    .pipe(
      z
        .number()
        .int("Total chicks must be an integer")
        .min(1, "Total chicks must be at least 1")
        .max(1000000, "Total chicks must be at most 1,000,000")
    ),
  flockId: z.string().min(1, "Flock ID is required"),
});

export type ShedRecord = z.infer<typeof shedRecordSchema>;

// Expected CSV headers with variations
export const shedHeaders: Record<keyof ShedRecord, string[]> = {
  name: ["name", "shed_name", "shed name", "shedname"],
  totalChicks: [
    "totalchicks",
    "total_chicks",
    "total chicks",
    "chicks",
    "chick_count",
    "chick count",
  ],
  flockId: ["flockid", "flock_id", "flock id", "flock_id"],
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
  { key: "totalChicks" as keyof ShedRecord, label: "Total Chicks" },
  { key: "flockId" as keyof ShedRecord, label: "Flock Id" },
];

// Template configuration
export const shedTemplateHeaders = ["name", "totalChicks", "flockId"];

export const shedSampleData = ["Sample Shed", "1000", "flock_id_here"];

// Transform function to convert ShedRecord to API format
export function transformShedRecordsToAPI(shedRecords: ShedRecord[]): Array<{
  name: string;
  totalChicks: number;
  flockId: string;
}> {
  return shedRecords.map((record) => ({
    name: record.name,
    totalChicks: record.totalChicks,
    flockId: record.flockId,
  }));
}
