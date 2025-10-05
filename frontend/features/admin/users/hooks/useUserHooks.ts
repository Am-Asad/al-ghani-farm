import {
  useEntityCreate,
  useEntityEdit,
  useEntityDelete,
  useEntityBulkDelete,
} from "@/features/shared/hooks/useEntityMutations";
import {
  useEntityGetAll,
  useEntityGetById,
} from "@/features/shared/hooks/useEntityQueries";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";
import { User } from "@/types";

// User-specific hooks using the generic entity hooks
export const useGetAllUsers = (query?: QueryParams) => {
  // Normalize UI-level filters to API expectations
  const apiQuery: QueryParams | undefined = query
    ? {
        ...query,
        // Backend expects empty string for no role filter
        role: query.role === "all" ? "" : query.role,
      }
    : undefined;

  return useEntityGetAll<User>(
    {
      entityType: "users",
      entityName: "user",
    },
    apiQuery
  );
};

export const useGetUserById = (userId: string) => {
  return useEntityGetById<User>(
    {
      entityType: "users",
      entityName: "user",
    },
    userId
  );
};

export const useCreateUser = () => {
  return useEntityCreate<User>({
    entityType: "users",
    entityName: "user",
    invalidateQueries: ["users"],
  });
};

export const useEditUser = () => {
  return useEntityEdit<User>({
    entityType: "users",
    entityName: "user",
    invalidateQueries: ["users"],
  });
};

export const useDeleteUser = () => {
  return useEntityDelete({
    entityType: "users",
    entityName: "user",
    invalidateQueries: ["users"],
  });
};

export const useDeleteBulkUsers = () => {
  return useEntityBulkDelete({
    entityType: "users",
    entityName: "user",
    invalidateQueries: ["users"],
  });
};
