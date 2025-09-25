import { useCallback } from "react";
import { useQueryParams } from "@/features/shared/hooks/useQueryParams";

export type FlockQueryParams = {
  page: string;
  limit: string;
  search: string;
  farmId: string;
  sortBy: string;
  sortOrder: string;
  status?: string;
  capacityMin?: string;
  capacityMax?: string;
  dateFrom?: string;
  dateTo?: string;
};

const DEFAULTS: FlockQueryParams = {
  page: "1",
  limit: "10",
  search: "",
  farmId: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  status: "",
  capacityMin: "",
  capacityMax: "",
  dateFrom: "",
  dateTo: "",
};

export const useFlockQueryParams = () => {
  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<FlockQueryParams>({
    defaults: DEFAULTS,
  });

  const setFilters = useCallback(
    (filters: {
      search?: string;
      farmId?: string;
      sortBy?: string;
      sortOrder?: string;
      status?: string;
      capacityMin?: string;
      capacityMax?: string;
      dateFrom?: string;
      dateTo?: string;
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
    farmId: query.farmId,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    status: query.status ?? "",
    capacityMin: query.capacityMin ?? "",
    capacityMax: query.capacityMax ?? "",
    dateFrom: query.dateFrom ?? "",
    dateTo: query.dateTo ?? "",
    // setters
    setFilters,
    setPage,
    setLimit,
    reset,
  } as const;
};
