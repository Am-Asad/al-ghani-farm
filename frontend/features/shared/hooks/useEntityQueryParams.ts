import { useCallback, useEffect } from "react";
import { useQueryParams } from "./useQueryParams";

// Base query params that all entities share
export type BaseQueryParams = {
  page: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
};

// Common filter types that can be used across entities
export type CommonFilters = {
  // Entity relationships
  farmId?: string;
  shedId?: string;
  flockId?: string;
  buyerId?: string;

  // Date filters
  dateFrom?: string;
  dateTo?: string;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;

  // Status filters
  status?: string;
  role?: string;

  // Numeric range filters
  capacityMin?: string;
  capacityMax?: string;
  totalAmountMin?: string;
  totalAmountMax?: string;
  amountPaidMin?: string;
  amountPaidMax?: string;
  balanceMin?: string;
  balanceMax?: string;
  netWeightMin?: string;
  netWeightMax?: string;
  numberOfBirdsMin?: string;
  numberOfBirdsMax?: string;
  rateMin?: string;
  rateMax?: string;
  emptyVehicleWeightMin?: string;
  emptyVehicleWeightMax?: string;
  grossWeightMin?: string;
  grossWeightMax?: string;

  // Payment status
  paymentStatus?: string;

  // Text filters
  vehicleNumber?: string;
  driverName?: string;
  driverContact?: string;
  accountantName?: string;
};

// Generic entity query params type
export type EntityQueryParams<
  T extends Record<string, string> = Record<string, never>
> = BaseQueryParams & T;

// Configuration for entity-specific query params
export type EntityQueryConfig<
  T extends Record<string, string> = Record<string, never>
> = {
  // Entity name for debugging/logging
  entityName: string;

  // Default values for base params
  defaults: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  };

  // Entity-specific default values
  entityDefaults?: Partial<T>;

  // Available sort options for this entity
  sortOptions?: string[];

  // Available status options for this entity
  statusOptions?: string[];

  // Available role options for this entity
  roleOptions?: string[];
};

// Generic hook for entity query params
export const useEntityQueryParams = <
  T extends Record<string, string> = Record<string, never>
>(
  config: EntityQueryConfig<T>
) => {
  const {
    entityName,
    defaults: baseDefaults,
    entityDefaults = {} as Partial<T>,
    sortOptions = ["createdAt", "updatedAt"],
    statusOptions = [],
    roleOptions = [],
  } = config;

  // Merge base defaults with entity defaults
  const allDefaults = {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    ...baseDefaults,
    ...entityDefaults,
  } as EntityQueryParams<T>;

  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<EntityQueryParams<T>>({
    defaults: allDefaults,
  });

  const setFilters = useCallback(
    (filters: Partial<EntityQueryParams<T>>) => {
      // When filters change, reset page to 1
      setParams({ ...filters, page: "1" } as Partial<EntityQueryParams<T>>);
    },
    [setParams]
  );

  const setPage = useCallback(
    (page: number | string, opts?: { replace?: boolean }) => {
      setParams(
        { page: String(Math.max(1, Number(page) || 1)) } as Partial<
          EntityQueryParams<T>
        >,
        opts
      );
    },
    [setParams]
  );

  const setLimit = useCallback(
    (limit: number | string, opts?: { replace?: boolean }) => {
      const lim = String(
        Math.max(1, Number(limit) || Number(allDefaults.limit))
      );
      // When limit changes, reset to first page
      setParams(
        { limit: lim, page: "1" } as Partial<EntityQueryParams<T>>,
        opts
      );
    },
    [setParams, allDefaults.limit]
  );

  // Helper to get a filter value with fallback
  const getFilterValue = <K extends keyof EntityQueryParams<T>>(
    key: K,
    fallback: EntityQueryParams<T>[K] = "" as EntityQueryParams<T>[K]
  ): EntityQueryParams<T>[K] => {
    return query[key] ?? fallback;
  };

  // Helper to set a specific filter
  const setFilter = useCallback(
    <K extends keyof EntityQueryParams<T>>(
      key: K,
      value: EntityQueryParams<T>[K]
    ) => {
      setParams({ [key]: value, page: "1" } as Partial<EntityQueryParams<T>>);
    },
    [setParams]
  );

  return {
    // Raw query object
    query,

    // Computed values
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,

    // Entity-specific values (with fallbacks)
    ...Object.keys(entityDefaults).reduce((acc, key) => {
      acc[key] =
        query[key as keyof EntityQueryParams<T>] ??
        entityDefaults[key as keyof T] ??
        "";
      return acc;
    }, {} as Record<string, string>),

    // Setters
    setFilters,
    setPage,
    setLimit,
    setFilter,
    reset,

    // Configuration
    config: {
      entityName,
      sortOptions,
      statusOptions,
      roleOptions,
    },

    // Helper methods
    getFilterValue,
  } as const;
};

// Specialized hook for entities with automatic filtering by a specific field
export const useEntityQueryParamsWithFilter = <
  T extends Record<string, string> = Record<string, never>,
  K extends keyof EntityQueryParams<T> = keyof EntityQueryParams<T>
>(
  config: EntityQueryConfig<T>,
  filterField: K,
  filterValue: EntityQueryParams<T>[K]
) => {
  // Create a modified config that includes the filter field in entityDefaults
  const modifiedConfig = {
    ...config,
    entityDefaults: {
      ...config.entityDefaults,
      [filterField]: filterValue,
    } as Partial<T>,
  };

  const baseHook = useEntityQueryParams(modifiedConfig);

  // Ensure the filter field is set in the URL on mount
  useEffect(() => {
    if (baseHook.query[filterField] !== filterValue) {
      baseHook.setFilter(filterField, filterValue);
    }
  }, [baseHook, filterField, filterValue]);

  // Override setFilters to always include the filter field
  const setFilters = useCallback(
    (filters: Partial<EntityQueryParams<T>>) => {
      baseHook.setFilters({
        ...filters,
        [filterField]: filterValue,
      });
    },
    [baseHook, filterField, filterValue]
  );

  // Override reset to maintain the filter field
  const reset = useCallback(() => {
    baseHook.reset();
    // After reset, set the filter field again
    baseHook.setFilter(filterField, filterValue);
  }, [baseHook, filterField, filterValue]);

  return {
    ...baseHook,
    setFilters,
    reset,
    // Ensure the filter field is always the provided value
    [filterField]: filterValue,
  } as const;
};
