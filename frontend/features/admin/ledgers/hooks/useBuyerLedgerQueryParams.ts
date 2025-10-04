import { useEntityQueryParamsWithFilter } from "@/features/shared/hooks/useEntityQueryParams";
import { LedgerQueryParams, LEDGER_QUERY_CONFIG } from "./useLedgerQueryParams";

export const useBuyerLedgerQueryParams = (buyerId: string) => {
  return useEntityQueryParamsWithFilter<LedgerQueryParams, "buyerId">(
    LEDGER_QUERY_CONFIG,
    "buyerId",
    buyerId
  );
};
