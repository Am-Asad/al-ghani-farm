import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { APIResponse, Flock as FlockType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateFlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating flock...", { id: "createFlock" });
    },
    mutationFn: async (
      payload: Omit<FlockType, "_id" | "createdAt" | "updatedAt"> & {
        farmId: string;
      }
    ) => {
      const response = await api.post<APIResponse<FlockType>>(
        `/flocks`,
        payload
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "createFlock" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.farmById(variables.farmId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Create flock failed",
        { id: "createFlock" }
      );
    },
  });
};
