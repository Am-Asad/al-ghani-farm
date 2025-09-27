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
    mutationFn: async (ledgerIds: string[]) => {
      const response = await api.delete<APIResponse<[]>>(`/ledgers/bulk`, {
        data: ledgerIds,
      });
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBulkLedgers" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.ledgers,
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
          : "Delete bulk ledgers failed",
        { id: "deleteBulkLedgers" }
      );
    },
  });
};
