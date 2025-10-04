import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

// Generic entity types
type EntityType = "farms" | "buyers" | "sheds" | "flocks" | "ledgers" | "users";

// Generic query parameters
type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  [key: string]: string | undefined;
};

// Configuration for entity queries
type EntityQueryConfig = {
  entityType: EntityType;
  entityName: string; // Human-readable name for error messages
  enabled?: boolean; // Whether the query should be enabled
};

// Generic hook to get all entities
export const useEntityGetAll = <TData>(
  config: EntityQueryConfig,
  query?: QueryParams
) => {
  const { user } = useAuthContext();
  const { entityType, entityName, enabled = true } = config;

  return useQuery({
    queryKey: [...queryKeys[entityType], query],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<TData[]>>(`/${entityType}`, {
          params: query ?? {},
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : `Failed to fetch ${entityName}s`
        );
        throw error;
      }
    },
    enabled: enabled && !!user?._id,
    placeholderData: (previousData) => previousData,
  });
};

// Generic hook to get a single entity by ID
export const useEntityGetById = <TData>(
  config: EntityQueryConfig,
  entityId: string | undefined
) => {
  const { user } = useAuthContext();
  const { entityType, entityName, enabled = true } = config;

  return useQuery({
    queryKey: [...queryKeys[entityType], entityId],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<TData>>(
          `/${entityType}/${entityId}`
        );
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : `Failed to fetch ${entityName}`
        );
        throw error;
      }
    },
    enabled: enabled && !!user?._id && !!entityId,
    placeholderData: (previousData) => previousData,
  });
};

// Generic hook to get entities for dropdown/select components
export const useEntityGetDropdown = <
  TData extends { _id: string; name: string }
>(
  config: EntityQueryConfig,
  params: QueryParams = {}
) => {
  const { user } = useAuthContext();
  const { entityType, entityName, enabled = true } = config;

  return useQuery({
    queryKey: [...queryKeys[entityType], "dropdown", params],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<TData[]>>(
          `/${entityType}/dropdown`,
          {
            params,
          }
        );
        return response.data;
      } catch (error) {
        // Don't show toast for dropdown errors as they're less critical
        console.error(`Failed to fetch ${entityName} dropdown:`, error);
        throw error;
      }
    },
    enabled: enabled && !!user?._id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes for dropdown data
  });
};

// Generic hook to get entities with filters
export const useEntityGetFiltered = <TData>(
  config: EntityQueryConfig,
  filters: QueryParams = {}
) => {
  const { user } = useAuthContext();
  const { entityType, entityName, enabled = true } = config;

  return useQuery({
    queryKey: [...queryKeys[entityType], "filtered", filters],
    queryFn: async () => {
      try {
        // Clean up empty parameters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([_, value]) =>
              value !== "" && value !== undefined && value !== null
          )
        );

        const response = await api.get<APIResponse<TData[]>>(`/${entityType}`, {
          params: cleanFilters,
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : `Failed to fetch filtered ${entityName}s`
        );
        throw error;
      }
    },
    enabled: enabled && !!user?._id,
    placeholderData: (previousData) => previousData,
  });
};

// Generic hook to get entity statistics/summary
export const useEntityGetStats = <TData>(
  config: EntityQueryConfig,
  filters: QueryParams = {}
) => {
  const { user } = useAuthContext();
  const { entityType, entityName, enabled = true } = config;

  return useQuery({
    queryKey: [...queryKeys[entityType], "stats", filters],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<TData>>(
          `/${entityType}/stats`,
          {
            params: filters,
          }
        );
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : `Failed to fetch ${entityName} statistics`
        );
        throw error;
      }
    },
    enabled: enabled && !!user?._id,
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats data
  });
};

// Export types for external use
export type { EntityType, QueryParams, EntityQueryConfig };
