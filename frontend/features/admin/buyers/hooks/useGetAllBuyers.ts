import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Buyer as BuyerType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllBuyers = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.buyers,
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<BuyerType[]>>(`/buyers`);
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch buyers"
        );
      }
    },
    enabled: !!user?._id,
  });
};
