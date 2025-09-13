"use client";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { APIResponse, FlockWithSheds } from "@/types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetFlockById = (flockId: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.flockById(flockId),
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<FlockWithSheds>>(
          `/flocks/${flockId}`
        );
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch flock",
          { id: "getFlockById" }
        );
      }
    },
    enabled: !!flockId && !!user?._id,
  });
};
