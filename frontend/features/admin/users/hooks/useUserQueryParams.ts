import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type UserQueryParams = EntityQueryParams<{
  role: string; // "admin" | "manager" | "viewer" | "all" (UI-level)
}>;

export const USER_QUERY_CONFIG: EntityQueryConfig<UserQueryParams> = {
  entityName: "users",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  entityDefaults: {
    role: "all",
  },
  sortOptions: ["createdAt", "updatedAt"],
  roleOptions: ["all", "admin", "manager", "viewer"],
};

export const useUserQueryParams = () => {
  return useEntityQueryParams<UserQueryParams>(USER_QUERY_CONFIG);
};
