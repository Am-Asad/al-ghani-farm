import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { APIResponse, Buyer } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetBuyerById = (buyerId: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.buyerById(buyerId),
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<Buyer>>(
          `/buyers/${buyerId}`
        );
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch buyer",
          { id: "getBuyerById" }
        );
      }
    },
    enabled: !!buyerId && !!user?._id,
  });
};
