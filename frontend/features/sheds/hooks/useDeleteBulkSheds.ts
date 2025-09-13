import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useDeleteBulkSheds = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting sheds...", { id: "deleteBulkSheds" });
    },
    mutationFn: async ({ flockId }: { flockId: string }) => {
      const response = await api.delete<APIResponse<[]>>(
        `/sheds/all?flockId=${flockId}`
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "deleteBulkSheds" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.flockById(variables.flockId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete bulk sheds failed",
        { id: "deleteBulkSheds" }
      );
    },
  });
};
