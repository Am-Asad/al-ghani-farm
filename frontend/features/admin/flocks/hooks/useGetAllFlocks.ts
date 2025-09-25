import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Flock as FlockType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllFlocks = (farmId?: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: farmId ? [...queryKeys.flocks, farmId] : queryKeys.flocks,
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<FlockType[]>>(`/flocks`, {
          params: farmId ? { farmId } : {},
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch flocks"
        );
      }
    },
    enabled: !!user?._id,
  });
};
