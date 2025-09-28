import { useCallback } from "react";
import { useQueryParams } from "@/features/shared/hooks/useQueryParams";

export type ReportQueryParams = {
  page: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;

  // Date range filters
  duration: string; // 'daily', 'weekly', 'monthly', 'yearly', 'custom', 'period'
  date?: string; // Specific date for daily/weekly/monthly/yearly reports
  startDate?: string; // Start date for custom range
  endDate?: string; // End date for custom range
  period?: string; // Number of days for period duration

  // Entity filters (comma-separated lists)
  buyerIds?: string;
  farmIds?: string;
  flockIds?: string;
  shedIds?: string;

  // Advanced filters
  paymentStatus?: string; // 'paid', 'partial', 'unpaid'
  minAmount?: string;
  maxAmount?: string;
  minNetWeight?: string;
  maxNetWeight?: string;
  minBirds?: string;
  maxBirds?: string;
  minRate?: string;
  maxRate?: string;
  vehicleNumbers?: string;
  driverNames?: string;
  accountantNames?: string;

  // Aggregation
  includeDetails?: string; // 'true', 'false'
};

const DEFAULTS: ReportQueryParams = {
  page: "1",
  limit: "10",
  search: "",
  sortBy: "date",
  sortOrder: "desc",
  duration: "daily",
  date: new Date().toISOString().split("T")[0], // Set today's date as default for daily reports
  startDate: "",
  endDate: "",
  period: "",
  buyerIds: "",
  farmIds: "",
  flockIds: "",
  shedIds: "",
  paymentStatus: "all",
  minAmount: "",
  maxAmount: "",
  minNetWeight: "",
  maxNetWeight: "",
  minBirds: "",
  maxBirds: "",
  minRate: "",
  maxRate: "",
  vehicleNumbers: "",
  driverNames: "",
  accountantNames: "",
  includeDetails: "true",
};

export const useReportQueryParams = () => {
  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<ReportQueryParams>({
    defaults: DEFAULTS,
  });

  const setFilters = useCallback(
    (filters: {
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      duration?: string;
      date?: string;
      startDate?: string;
      endDate?: string;
      period?: string;
      buyerIds?: string;
      farmIds?: string;
      flockIds?: string;
      shedIds?: string;
      paymentStatus?: string;
      minAmount?: string;
      maxAmount?: string;
      minNetWeight?: string;
      maxNetWeight?: string;
      minBirds?: string;
      maxBirds?: string;
      minRate?: string;
      maxRate?: string;
      vehicleNumbers?: string;
      driverNames?: string;
      accountantNames?: string;
      includeDetails?: string;
    }) => {
      // When filters change, reset page to 1
      setParams({ ...filters, page: "1" });
    },
    [setParams]
  );

  const setPage = useCallback(
    (page: number | string, opts?: { replace?: boolean }) => {
      setParams({ page: String(Math.max(1, Number(page) || 1)) }, opts);
    },
    [setParams]
  );

  const setLimit = useCallback(
    (limit: number | string, opts?: { replace?: boolean }) => {
      const lim = String(Math.max(1, Number(limit) || Number(DEFAULTS.limit)));
      // When limit changes, reset to first page
      setParams({ limit: lim, page: "1" }, opts);
    },
    [setParams]
  );

  return {
    query,
    // values
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    duration: query.duration,
    date: query.date ?? "",
    startDate: query.startDate ?? "",
    endDate: query.endDate ?? "",
    period: query.period ?? "",
    buyerIds: query.buyerIds ?? "",
    farmIds: query.farmIds ?? "",
    flockIds: query.flockIds ?? "",
    shedIds: query.shedIds ?? "",
    paymentStatus: query.paymentStatus ?? "",
    minAmount: query.minAmount ?? "",
    maxAmount: query.maxAmount ?? "",
    minNetWeight: query.minNetWeight ?? "",
    maxNetWeight: query.maxNetWeight ?? "",
    minBirds: query.minBirds ?? "",
    maxBirds: query.maxBirds ?? "",
    minRate: query.minRate ?? "",
    maxRate: query.maxRate ?? "",
    vehicleNumbers: query.vehicleNumbers ?? "",
    driverNames: query.driverNames ?? "",
    accountantNames: query.accountantNames ?? "",
    includeDetails: query.includeDetails ?? "true",
    // setters
    setFilters,
    setPage,
    setLimit,
    reset,
  } as const;
};
