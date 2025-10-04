import { useEntityQueryParamsWithFilter } from "@/features/shared/hooks/useEntityQueryParams";
import { LedgerQueryParams, LEDGER_QUERY_CONFIG } from "./useLedgerQueryParams";

export const useFlockLedgerQueryParams = (flockId: string) => {
  return useEntityQueryParamsWithFilter<LedgerQueryParams, "flockId">(
    LEDGER_QUERY_CONFIG,
    "flockId",
    flockId
  );
};
