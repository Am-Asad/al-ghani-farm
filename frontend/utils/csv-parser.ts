import Papa from "papaparse";
import { z } from "zod";

// Expected CSV headers with variations
const CSV_HEADERS = {
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

// Schema for individual farm record from CSV
const farmRecordSchema = z.object({
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

export type ParseResult = {
  success: boolean;
  data?: FarmRecord[];
  errors?: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
};

export function parseCSVFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
      complete: (results) => {
        const { data, errors } = results;

        if (errors.length > 0) {
          resolve({
            success: false,
            errors: errors.map(
              (error) => `Row ${(error.row || 0) + 1}: ${error.message}`
            ),
            totalRows: data.length,
            validRows: 0,
            invalidRows: data.length,
          });
          return;
        }

        // Validate headers and create mapping
        const headers = Object.keys(data[0] || {});
        const headerMapping: Record<string, string> = {};
        const missingHeaders: string[] = [];

        // Find matching headers for each required field
        for (const [requiredField, variations] of Object.entries(CSV_HEADERS)) {
          const foundHeader = headers.find((header) =>
            variations.some(
              (variation) =>
                header.toLowerCase().trim() === variation.toLowerCase()
            )
          );

          if (foundHeader) {
            headerMapping[requiredField] = foundHeader;
          } else {
            missingHeaders.push(requiredField);
          }
        }

        if (missingHeaders.length > 0) {
          const errorMessage = `Missing required headers: ${missingHeaders.join(
            ", "
          )}. Available headers: ${headers.join(
            ", "
          )}. Please ensure your CSV has columns for farm name, supervisor/manager, and total sheds.`;
          resolve({
            success: false,
            errors: [errorMessage],
            totalRows: data.length,
            validRows: 0,
            invalidRows: data.length,
          });
          return;
        }

        // Validate and transform each record
        const validRecords: FarmRecord[] = [];
        const validationErrors: string[] = [];

        data.forEach((row: unknown, index: number) => {
          try {
            // Transform row data using header mapping
            const transformedRow: Record<string, string> = {};
            const originalRow = row as Record<string, string>;

            for (const [requiredField, actualHeader] of Object.entries(
              headerMapping
            )) {
              transformedRow[requiredField] = originalRow[actualHeader] || "";
            }

            const validatedRecord = farmRecordSchema.parse(transformedRow);
            validRecords.push(validatedRecord);
          } catch (error) {
            if (error instanceof z.ZodError) {
              const errorMessages = error.issues.map(
                (err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`
              );
              validationErrors.push(
                `Row ${index + 1}: ${errorMessages.join(", ")}`
              );
            } else {
              validationErrors.push(`Row ${index + 1}: Invalid data format`);
            }
          }
        });

        resolve({
          success: validRecords.length > 0,
          data: validRecords.length > 0 ? validRecords : undefined,
          errors: validationErrors.length > 0 ? validationErrors : undefined,
          totalRows: data.length,
          validRows: validRecords.length,
          invalidRows: validationErrors.length,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          errors: [`Failed to parse CSV file: ${error.message}`],
          totalRows: 0,
          validRows: 0,
          invalidRows: 0,
        });
      },
    });
  });
}

// Helper function to download CSV template
export function downloadCSVTemplate() {
  const headers = "name,supervisor,totalSheds";
  const sampleData = "Sample Farm,John Doe,5";
  const csvContent = `${headers}\n${sampleData}`;

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "farm_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
