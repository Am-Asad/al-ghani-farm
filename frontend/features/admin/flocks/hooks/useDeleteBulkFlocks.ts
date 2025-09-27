import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useDeleteBulkFlocks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting flocks...", { id: "deleteBulkFlocks" });
    },
    mutationFn: async (flockIds: string[]) => {
      const response = await api.delete<APIResponse<[]>>(`/flocks/bulk`, {
        data: flockIds,
      });
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBulkFlocks" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.flocks,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.sheds });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgers });
      queryClient.invalidateQueries({ queryKey: queryKeys.buyers });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete bulk flocks failed",
        { id: "deleteBulkFlocks" }
      );
    },
  });
};
