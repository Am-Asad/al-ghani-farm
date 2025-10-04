import {
  useEntityCreate,
  useEntityEdit,
  useEntityDelete,
  useEntityBulkDelete,
} from "@/features/shared/hooks/useEntityMutations";
import {
  useEntityGetAll,
  useEntityGetById,
  useEntityGetDropdown,
} from "@/features/shared/hooks/useEntityQueries";
import { Farm as FarmType, FarmDetails } from "@/types";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";

// Farm-specific hooks
export const useGetAllFarms = (query?: QueryParams) => {
  return useEntityGetAll<FarmType>(
    {
      entityType: "farms",
      entityName: "farm",
    },
    query
  );
};

export const useGetFarmById = (farmId: string) => {
  return useEntityGetById<FarmDetails>(
    {
      entityType: "farms",
      entityName: "farm",
    },
    farmId
  );
};

export const useGetFarmsDropdown = (params: {
  search: string;
  farmIds?: string;
}) => {
  const { search, farmIds } = params;

  return useEntityGetDropdown<Pick<FarmType, "_id" | "name">>(
    {
      entityType: "farms",
      entityName: "farm",
    },
    { search, farmIds }
  );
};

// Mutation hooks
export const useCreateFarm = () =>
  useEntityCreate<FarmType, Pick<FarmType, "name" | "supervisor">>({
    entityType: "farms",
    entityName: "farm",
    invalidateQueries: ["farms", "entities"],
  });

export const useEditFarm = () =>
  useEntityEdit<FarmType>({
    entityType: "farms",
    entityName: "farm",
    invalidateQueries: ["farms", "entities"],
  });

export const useDeleteFarm = () =>
  useEntityDelete({
    entityType: "farms",
    entityName: "farm",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useDeleteBulkFarms = () =>
  useEntityBulkDelete({
    entityType: "farms",
    entityName: "farm",
    invalidateQueries: ["farms", "sheds", "flocks", "ledgers", "buyers"],
  });
