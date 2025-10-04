import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type BuyerQueryParams = EntityQueryParams<Record<string, never>>;

const BUYER_QUERY_CONFIG: EntityQueryConfig<BuyerQueryParams> = {
  entityName: "buyers",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  sortOptions: ["createdAt", "updatedAt"],
};

export const useBuyersQueryParams = () => {
  return useEntityQueryParams<BuyerQueryParams>(BUYER_QUERY_CONFIG);
};
