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
import { Flock as FlockType } from "@/types";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";

// Flock-specific hooks
export const useGetAllFlocks = (query?: QueryParams) => {
  return useEntityGetAll<FlockType>(
    {
      entityType: "flocks",
      entityName: "flock",
    },
    query
  );
};

export const useGetFlockById = (flockId: string) => {
  return useEntityGetById<FlockType>(
    {
      entityType: "flocks",
      entityName: "flock",
    },
    flockId
  );
};

export const useGetFlocksDropdown = (params: {
  search: string;
  farmId?: string;
  flockIds?: string;
  shedId?: string;
}) => {
  const { search, farmId, flockIds, shedId } = params;

  return useEntityGetDropdown<{ _id: string; name: string }>(
    {
      entityType: "flocks",
      entityName: "flock",
    },
    { search, farmId, flockIds, shedId }
  );
};

// Mutation hooks
export const useCreateFlock = () =>
  useEntityCreate<
    FlockType,
    Omit<FlockType, "_id" | "createdAt" | "updatedAt"> & { farmId: string }
  >({
    entityType: "flocks",
    entityName: "flock",
    invalidateQueries: ["farms", "flocks", "entities"],
  });

export const useEditFlock = () =>
  useEntityEdit<FlockType>({
    entityType: "flocks",
    entityName: "flock",
    invalidateQueries: ["farms", "flocks", "entities"],
  });

export const useDeleteFlock = () =>
  useEntityDelete({
    entityType: "flocks",
    entityName: "flock",
    invalidateQueries: ["farms", "flocks", "sheds", "ledgers", "buyers"],
  });

export const useDeleteBulkFlocks = () =>
  useEntityBulkDelete({
    entityType: "flocks",
    entityName: "flock",
    invalidateQueries: ["flocks", "farms", "sheds", "ledgers", "buyers"],
  });
