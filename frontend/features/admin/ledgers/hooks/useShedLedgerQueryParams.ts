import { useEntityQueryParamsWithFilter } from "@/features/shared/hooks/useEntityQueryParams";
import { LedgerQueryParams, LEDGER_QUERY_CONFIG } from "./useLedgerQueryParams";

export const useShedLedgerQueryParams = (shedId: string) => {
  return useEntityQueryParamsWithFilter<LedgerQueryParams, "shedId">(
    LEDGER_QUERY_CONFIG,
    "shedId",
    shedId
  );
};
