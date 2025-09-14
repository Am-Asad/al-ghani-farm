import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { APIResponse, Ledger as LedgerType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateLedger = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating ledger...", { id: "createLedger" });
    },
    mutationFn: async (
      payload: Omit<LedgerType, "_id" | "createdAt" | "updatedAt">
    ) => {
      const response = await api.post<APIResponse<LedgerType>>(
        `/ledgers`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "createLedger" });
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
          : "Create ledger failed",
        { id: "createLedger" }
      );
    },
  });
};
