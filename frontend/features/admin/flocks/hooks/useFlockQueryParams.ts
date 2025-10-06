import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type FlockQueryParams = EntityQueryParams<{
  farmId: string;
  status: string;
  capacityMin: string;
  capacityMax: string;
  dateFrom: string;
  dateTo: string;
}>;

const FLOCK_QUERY_CONFIG: EntityQueryConfig<FlockQueryParams> = {
  entityName: "flocks",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  entityDefaults: {
    farmId: "",
    status: "",
    capacityMin: "",
    capacityMax: "",
    dateFrom: "",
    dateTo: "",
  },
  sortOptions: [
    "createdAt",
    "updatedAt",
    "name",
    "startDate",
    "endDate",
    "status",
    "totalChicks",
  ],
  statusOptions: ["active", "completed"],
};

export const useFlockQueryParams = () => {
  return useEntityQueryParams<FlockQueryParams>(FLOCK_QUERY_CONFIG);
};
