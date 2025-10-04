import { useEntityQueryParamsWithFilter } from "@/features/shared/hooks/useEntityQueryParams";
import { LedgerQueryParams, LEDGER_QUERY_CONFIG } from "./useLedgerQueryParams";

export const useFarmLedgerQueryParams = (farmId: string) => {
  return useEntityQueryParamsWithFilter<LedgerQueryParams, "farmId">(
    LEDGER_QUERY_CONFIG,
    "farmId",
    farmId
  );
};
