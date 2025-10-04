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
import { Ledger, LedgerPayload } from "@/types";
import { QueryParams } from "@/features/shared/hooks/useEntityQueries";

// Ledger-specific hooks
export const useGetAllLedgers = (query?: QueryParams) => {
  return useEntityGetAll<Ledger>(
    {
      entityType: "ledgers",
      entityName: "ledger",
    },
    query
  );
};

export const useGetLedgerById = (ledgerId: string) => {
  return useEntityGetById<LedgerPayload>(
    {
      entityType: "ledgers",
      entityName: "ledger",
    },
    ledgerId
  );
};

// Mutation hooks
export const useCreateLedger = () =>
  useEntityCreate<
    LedgerPayload,
    Omit<LedgerPayload, "_id" | "createdAt" | "updatedAt">
  >({
    entityType: "ledgers",
    entityName: "ledger",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useEditLedger = () =>
  useEntityEdit<LedgerPayload>({
    entityType: "ledgers",
    entityName: "ledger",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useDeleteLedger = () =>
  useEntityDelete({
    entityType: "ledgers",
    entityName: "ledger",
    invalidateQueries: [
      "farms",
      "flocks",
      "sheds",
      "ledgers",
      "buyers",
      "entities",
    ],
  });

export const useDeleteBulkLedgers = () =>
  useEntityBulkDelete({
    entityType: "ledgers",
    entityName: "ledger",
    invalidateQueries: ["ledgers", "farms", "sheds", "flocks", "buyers"],
  });
