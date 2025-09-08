import Papa from "papaparse";
import { z } from "zod";

export type ParseResult<T> = {
  success: boolean;
  data?: T[];
  errors?: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
};

export type CSVConfig<T> = {
  schema: z.ZodSchema<T>;
  headers: Record<keyof T, string[]>;
  entityName: string;
};

export function parseCSVFile<T>(
  file: File,
  config: CSVConfig<T>
): Promise<ParseResult<T>> {
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
        for (const [requiredField, variations] of Object.entries(
          config.headers
        )) {
          const foundHeader = headers.find((header) =>
            (variations as string[]).some(
              (variation: string) =>
                header.toLowerCase().trim() === variation.toLowerCase()
            )
          );

          if (foundHeader) {
            headerMapping[requiredField as string] = foundHeader;
          } else {
            missingHeaders.push(requiredField as string);
          }
        }

        if (missingHeaders.length > 0) {
          const errorMessage = `Missing required headers: ${missingHeaders.join(
            ", "
          )}. Available headers: ${headers.join(
            ", "
          )}. Please ensure your CSV has the correct columns.`;
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
        const validRecords: T[] = [];
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

            const validatedRecord = config.schema.parse(transformedRow);
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
export function downloadCSVTemplate(
  headers: string[],
  sampleData: string[],
  filename: string
) {
  const csvContent = `${headers.join(",")}\n${sampleData.join(",")}`;

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
