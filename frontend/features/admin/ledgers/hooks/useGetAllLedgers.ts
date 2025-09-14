import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { LedgerResponse as LedgerResponseType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllLedgers = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.ledgers,
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<LedgerResponseType[]>>(
          `/ledgers`
        );
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
  });
};
