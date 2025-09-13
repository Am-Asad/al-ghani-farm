import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Buyer as BuyerType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing buyer...", { id: "editBuyer" });
    },
    mutationFn: async (payload: Omit<BuyerType, "createdAt" | "updatedAt">) => {
      const response = await api.put<APIResponse<BuyerType>>(
        `/buyers/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editBuyer" });
      queryClient.invalidateQueries({ queryKey: queryKeys.buyers });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit buyer failed",
        { id: "editBuyer" }
      );
    },
  });
};
