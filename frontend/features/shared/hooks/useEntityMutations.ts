import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { APIResponse } from "@/types";

// Generic entity types
type EntityType = "farms" | "buyers" | "sheds" | "flocks" | "ledgers" | "users";

// Configuration for entity mutations
type EntityMutationConfig = {
  entityType: EntityType;
  entityName: string; // Human-readable name for toasts
  invalidateQueries?: (keyof typeof queryKeys)[]; // Which queries to invalidate
};

// Generic create mutation hook
export const useEntityCreate = <
  TData,
  TPayload = Omit<TData, "_id" | "createdAt" | "updatedAt">
>(
  config: EntityMutationConfig
) => {
  const queryClient = useQueryClient();
  const {
    entityType,
    entityName,
    invalidateQueries = [entityType, "entities"],
  } = config;

  return useMutation({
    onMutate: () => {
      toast.loading(`Creating ${entityName}...`, { id: `create${entityName}` });
    },
    mutationFn: async (payload: TPayload) => {
      const response = await api.post<APIResponse<TData>>(
        `/${entityType}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: `create${entityName}` });

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        const key = queryKeys[queryKey as keyof typeof queryKeys];
        if (typeof key === "function") {
          // For function-based query keys, we need to invalidate all queries that start with the base key
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: key });
        }
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : `Create ${entityName} failed`,
        { id: `create${entityName}` }
      );
    },
  });
};

// Generic edit mutation hook
export const useEntityEdit = <TData extends { _id: string }>(
  config: EntityMutationConfig
) => {
  const queryClient = useQueryClient();
  const {
    entityType,
    entityName,
    invalidateQueries = [entityType, "entities"],
  } = config;

  return useMutation({
    onMutate: () => {
      toast.loading(`Editing ${entityName}...`, { id: `edit${entityName}` });
    },
    mutationFn: async (payload: Omit<TData, "createdAt" | "updatedAt">) => {
      const response = await api.put<APIResponse<TData>>(
        `/${entityType}/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: `edit${entityName}` });

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        const key = queryKeys[queryKey as keyof typeof queryKeys];
        if (typeof key === "function") {
          // For function-based query keys, we need to invalidate all queries that start with the base key
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: key });
        }
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : `Edit ${entityName} failed`,
        { id: `edit${entityName}` }
      );
    },
  });
};

// Generic delete mutation hook
export const useEntityDelete = (config: EntityMutationConfig) => {
  const queryClient = useQueryClient();
  const {
    entityType,
    entityName,
    invalidateQueries = [entityType, "entities"],
  } = config;

  return useMutation({
    onMutate: () => {
      toast.loading(`Deleting ${entityName}...`, { id: `delete${entityName}` });
    },
    mutationFn: async (entityId: string) => {
      const response = await api.delete<APIResponse<{ id: string }>>(
        `/${entityType}/${entityId}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: `delete${entityName}` });

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        const key = queryKeys[queryKey as keyof typeof queryKeys];
        if (typeof key === "function") {
          // For function-based query keys, we need to invalidate all queries that start with the base key
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: key });
        }
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : error.message,
        { id: `delete${entityName}` }
      );
    },
  });
};

// Generic bulk delete mutation hook
export const useEntityBulkDelete = (config: EntityMutationConfig) => {
  const queryClient = useQueryClient();
  const {
    entityType,
    entityName,
    invalidateQueries = [entityType, "entities"],
  } = config;

  return useMutation({
    onMutate: () => {
      toast.loading(`Deleting ${entityName}s...`, {
        id: `deleteBulk${entityName}s`,
      });
    },
    mutationFn: async (entityIds: string[]) => {
      const response = await api.delete<APIResponse<[]>>(
        `/${entityType}/bulk`,
        {
          data: entityIds,
        }
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: `deleteBulk${entityName}s` });

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        const key = queryKeys[queryKey as keyof typeof queryKeys];
        if (typeof key === "function") {
          // For function-based query keys, we need to invalidate all queries that start with the base key
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: key });
        }
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : `Delete bulk ${entityName}s failed`,
        { id: `deleteBulk${entityName}s` }
      );
    },
  });
};

// Generic bulk create mutation hook
export const useEntityBulkCreate = <
  TData,
  TPayload = Omit<TData, "_id" | "createdAt" | "updatedAt">
>(
  config: EntityMutationConfig
) => {
  const queryClient = useQueryClient();
  const {
    entityType,
    entityName,
    invalidateQueries = [entityType, "entities"],
  } = config;

  return useMutation({
    onMutate: () => {
      toast.loading(`Creating ${entityName}s...`, {
        id: `createBulk${entityName}s`,
      });
    },
    mutationFn: async (payload: TPayload[]) => {
      const response = await api.post<APIResponse<TData[]>>(
        `/${entityType}/bulk`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: `createBulk${entityName}s` });

      // Invalidate specified queries
      invalidateQueries.forEach((queryKey) => {
        const key = queryKeys[queryKey as keyof typeof queryKeys];
        if (typeof key === "function") {
          // For function-based query keys, we need to invalidate all queries that start with the base key
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        } else {
          queryClient.invalidateQueries({ queryKey: key });
        }
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : `Create bulk ${entityName}s failed`,
        { id: `createBulk${entityName}s` }
      );
    },
  });
};

// Export types for external use
export type { EntityType, EntityMutationConfig };
