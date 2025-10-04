import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type ShedQueryParams = EntityQueryParams<{
  farmId: string;
  capacityMin: string;
  capacityMax: string;
  dateFrom: string;
  dateTo: string;
}>;

const SHED_QUERY_CONFIG: EntityQueryConfig<ShedQueryParams> = {
  entityName: "sheds",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  entityDefaults: {
    farmId: "",
    capacityMin: "",
    capacityMax: "",
    dateFrom: "",
    dateTo: "",
  },
  sortOptions: ["createdAt", "updatedAt", "name", "capacity"],
};

export const useShedQueryParams = () => {
  return useEntityQueryParams<ShedQueryParams>(SHED_QUERY_CONFIG);
};
