import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Ledger as LedgerType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

type QueryParams = {
  page: string;
  limit: string;
  search: string;
  farmId: string;
  shedId: string;
  flockId: string;
  buyerId: string;
  sortBy: string;
  sortOrder: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
};

export const useGetAllLedgers = (query?: QueryParams) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.ledgers, query],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<LedgerType[]>>(`/ledgers`, {
          params: query ?? {},
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch ledgers"
        );
      }
    },
    enabled: !!user?._id,
    placeholderData: (previousData) => previousData,
  });
};
