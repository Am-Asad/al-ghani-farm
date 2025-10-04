import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type FarmQueryParams = EntityQueryParams<Record<string, never>>;

const FARM_QUERY_CONFIG: EntityQueryConfig<FarmQueryParams> = {
  entityName: "farms",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  sortOptions: ["createdAt", "updatedAt", "name"],
};

export const useFarmQueryParams = () => {
  return useEntityQueryParams<FarmQueryParams>(FARM_QUERY_CONFIG);
};
