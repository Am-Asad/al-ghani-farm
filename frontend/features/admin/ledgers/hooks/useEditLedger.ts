import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Ledger as LedgerType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing ledger...", { id: "editLedger" });
    },
    mutationFn: async (
      payload: Omit<LedgerType, "createdAt" | "updatedAt">
    ) => {
      const response = await api.put<APIResponse<LedgerType>>(
        `/ledgers/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editLedger" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.sheds });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgers });
      queryClient.invalidateQueries({ queryKey: queryKeys.buyers });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit ledger failed",
        { id: "editLedger" }
      );
    },
  });
};
