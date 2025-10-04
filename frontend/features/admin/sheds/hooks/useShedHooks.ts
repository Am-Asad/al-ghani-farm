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
import { Shed as ShedType } from "@/types";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";

// Shed-specific hooks
export const useGetAllSheds = (query?: QueryParams) => {
  return useEntityGetAll<ShedType>(
    {
      entityType: "sheds",
      entityName: "shed",
    },
    query
  );
};

export const useGetShedById = (shedId: string) => {
  return useEntityGetById<ShedType>(
    {
      entityType: "sheds",
      entityName: "shed",
    },
    shedId
  );
};

export const useGetShedsDropdown = (params: {
  search: string;
  farmId?: string;
  shedIds?: string;
}) => {
  const { search, farmId, shedIds } = params;

  return useEntityGetDropdown<{ _id: string; name: string }>(
    {
      entityType: "sheds",
      entityName: "shed",
    },
    { search, farmId, shedIds }
  );
};

// Mutation hooks
export const useCreateShed = () =>
  useEntityCreate<ShedType, Omit<ShedType, "_id" | "createdAt" | "updatedAt">>({
    entityType: "sheds",
    entityName: "shed",
    invalidateQueries: ["farms", "flocks", "sheds", "entities"],
  });

export const useEditShed = () =>
  useEntityEdit<ShedType>({
    entityType: "sheds",
    entityName: "shed",
    invalidateQueries: ["farms", "flocks", "sheds", "entities"],
  });

export const useDeleteShed = () =>
  useEntityDelete({
    entityType: "sheds",
    entityName: "shed",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useDeleteBulkSheds = () =>
  useEntityBulkDelete({
    entityType: "sheds",
    entityName: "shed",
    invalidateQueries: ["sheds", "farms", "flocks", "ledgers", "buyers"],
  });
