import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Flock as FlockType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditFlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing flock...", { id: "editFlock" });
    },
    mutationFn: async (payload: Omit<FlockType, "createdAt" | "updatedAt">) => {
      const response = await api.put<APIResponse<FlockType>>(
        `/flocks/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "editFlock" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.farmById(variables.farmId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit flock failed",
        { id: "editFlock" }
      );
    },
  });
};
