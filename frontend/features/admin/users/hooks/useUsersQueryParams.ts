"use client";

import { useCallback } from "react";
import { useQueryParams } from "@/features/shared/hooks/useQueryParams";

export type UserQueryParams = {
  page: string;
  limit: string;
  search: string;
  role: "admin" | "manager" | "viewer" | "all";
  sortBy: string;
  sortOrder: string;
};

const DEFAULTS: UserQueryParams = {
  page: "1",
  limit: "10",
  search: "",
  role: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useUsersQueryParams = () => {
  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<UserQueryParams>({
    defaults: DEFAULTS,
  });

  const setFilters = useCallback(
    (filters: {
      search?: string;
      sortBy?: string;
      sortOrder?: string;
      role?: "admin" | "manager" | "viewer" | "all";
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
    role: query.role,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    // setters
    setFilters,
    setPage,
    setLimit,
    reset,
  } as const;
};
