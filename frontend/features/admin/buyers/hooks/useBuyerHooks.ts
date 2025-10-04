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
import { Buyer as BuyerType } from "@/types";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";

// Buyer-specific hooks
export const useGetAllBuyers = (query?: QueryParams) => {
  return useEntityGetAll<BuyerType>(
    {
      entityType: "buyers",
      entityName: "buyer",
    },
    query
  );
};

export const useGetBuyerById = (buyerId: string) => {
  return useEntityGetById<BuyerType>(
    {
      entityType: "buyers",
      entityName: "buyer",
    },
    buyerId
  );
};

export const useGetBuyersDropdown = (params: {
  search: string;
  buyerIds?: string;
}) => {
  const { search, buyerIds } = params;

  return useEntityGetDropdown<{ _id: string; name: string }>(
    {
      entityType: "buyers",
      entityName: "buyer",
    },
    { search, buyerIds }
  );
};

// Mutation hooks
export const useCreateBuyer = () =>
  useEntityCreate<
    BuyerType,
    Pick<BuyerType, "name" | "contactNumber" | "address">
  >({
    entityType: "buyers",
    entityName: "buyer",
    invalidateQueries: ["buyers", "entities"],
  });

export const useEditBuyer = () =>
  useEntityEdit<BuyerType>({
    entityType: "buyers",
    entityName: "buyer",
    invalidateQueries: ["buyers", "entities"],
  });

export const useDeleteBuyer = () =>
  useEntityDelete({
    entityType: "buyers",
    entityName: "buyer",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useDeleteBulkBuyers = () =>
  useEntityBulkDelete({
    entityType: "buyers",
    entityName: "buyer",
    invalidateQueries: ["farms", "sheds", "flocks", "ledgers", "buyers"],
  });
