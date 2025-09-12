import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useDeleteFlock = (farmId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting flock...", { id: "deleteFlock" });
    },
    mutationFn: async ({ id }: { id: string }) => {
      const response = await api.delete<APIResponse<{ id: string }>>(
        `/flocks/${id}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteFlock" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.farmById(farmId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : error.message,
        { id: "deleteFlock" }
      );
    },
  });
};
