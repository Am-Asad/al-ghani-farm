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
    mutationFn: async ({ farmId }: { farmId: string }) => {
      const response = await api.delete<APIResponse<[]>>(
        `/sheds/all?farmId=${farmId}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBulkSheds" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.sheds,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.sheds });
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
