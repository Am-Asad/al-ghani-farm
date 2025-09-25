import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { APIResponse, FarmDetails } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetFarmById = (farmId: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.farmById(farmId),
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<FarmDetails>>(
          `/farms/${farmId}`
        );
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch farm",
          { id: "getFarmById" }
        );
      }
    },
    enabled: !!farmId && !!user?._id,
  });
};
