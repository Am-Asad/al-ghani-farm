import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useDeleteBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting buyer...", { id: "deleteBuyer" });
    },
    mutationFn: async (buyerId: string) => {
      const response = await api.delete<APIResponse<{ id: string }>>(
        `/buyers/${buyerId}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBuyer" });
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
          : error.message,
        { id: "deleteBuyer" }
      );
    },
  });
};
