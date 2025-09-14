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
    mutationFn: async (
      payload: Omit<
        FlockType,
        "totalChicks" | "shedsCount" | "createdAt" | "updatedAt"
      >
    ) => {
      const response = await api.put<APIResponse<FlockType>>(
        `/flocks/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editFlock" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
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
