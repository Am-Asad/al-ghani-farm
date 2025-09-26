import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useDeleteBulkLedgers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting ledgers...", { id: "deleteBulkLedgers" });
    },
    mutationFn: async ({ farmId }: { farmId: string }) => {
      const response = await api.delete<APIResponse<[]>>(
        `/ledgers/all?farmId=${farmId}`
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "deleteBulkLedgers" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.farmById(variables.farmId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgers });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete bulk ledgers failed",
        { id: "deleteBulkLedgers" }
      );
    },
  });
};
