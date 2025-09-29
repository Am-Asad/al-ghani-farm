import { ReportQueryParams } from "@/features/reports/hooks/useReportQueryParams";

export function buildExportParams(query?: ReportQueryParams) {
  if (!query) return {} as Record<string, string>;

  const entries = Object.entries(query)
    .filter(([key, value]) => {
      if (key === "paymentStatus") return true;
      return value !== "" && value !== undefined;
    })
    .map(([key, value]) => {
      if (key === "paymentStatus" && value === "all") return [key, ""];
      return [key, value as string];
    })
    .filter(([_, value]) => value !== "");

  return Object.fromEntries(entries) as Record<string, string>;
}
