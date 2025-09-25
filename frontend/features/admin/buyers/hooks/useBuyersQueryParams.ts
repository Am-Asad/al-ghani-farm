"use client";

import { useCallback } from "react";
import { useQueryParams } from "@/features/shared/hooks/useQueryParams";

export type BuyerQueryParams = {
  page: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
};

const DEFAULTS: BuyerQueryParams = {
  page: "1",
  limit: "10",
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useBuyersQueryParams = () => {
  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<BuyerQueryParams>({
    defaults: DEFAULTS,
  });

  const setFilters = useCallback(
    (filters: { search?: string; sortBy?: string; sortOrder?: string }) => {
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
    // setters
    setFilters,
    setPage,
    setLimit,
    reset,
  } as const;
};
