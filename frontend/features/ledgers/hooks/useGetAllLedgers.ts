"use client";
import { queryKeys } from "@/lib/query-client";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";
import { LedgerResponse as LedgerResponseType } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllLedgers = (query: { [key: string]: string }) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.ledgerWithFilters(query),
    queryFn: async () => {
      const params = new URLSearchParams(query);
      const response = await api.get<APIResponse<LedgerResponseType[]>>(
        `/ledgers?${params.toString()}`
      );
      return response.data;
    },
    enabled: !!query && !!user?._id,
  });
};
