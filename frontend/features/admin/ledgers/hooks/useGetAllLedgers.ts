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
  // Payment status and amount filters
  paymentStatus?: string;
  totalAmountMin?: string;
  totalAmountMax?: string;
  amountPaidMin?: string;
  amountPaidMax?: string;
  balanceMin?: string;
  balanceMax?: string;
  netWeightMin?: string;
  netWeightMax?: string;
};

export const useGetAllLedgers = (query?: QueryParams) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.ledgers, query],
    queryFn: async () => {
      try {
        // Clean up empty parameters and handle special values
        const cleanQuery = Object.fromEntries(
          Object.entries(query ?? {})
            .filter(([key, value]) => {
              // Keep payment status values even if they're "all" (we'll handle that in map)
              if (key === "paymentStatus") return true;
              // For other fields, filter out empty strings and undefined
              return value !== "" && value !== undefined;
            })
            .map(([key, value]) => {
              // Convert "all" payment status to empty string for API (which means no filter)
              if (key === "paymentStatus" && value === "all") {
                return [key, ""];
              }
              return [key, value];
            })
            .filter(([key, value]) => {
              // Final filter to remove empty strings after processing
              return value !== "";
            })
        );

        const response = await api.get<APIResponse<LedgerType[]>>(`/ledgers`, {
          params: cleanQuery,
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
