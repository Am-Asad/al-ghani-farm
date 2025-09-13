import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { Buyer as BuyerType } from "@/types";
import { APIResponse } from "@/types";

export const useCreateBuyer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating buyer...", { id: "createBuyer" });
    },
    mutationFn: async (
      payload: Pick<BuyerType, "name" | "contactNumber" | "address">
    ) => {
      const response = await api.post<APIResponse<BuyerType>>(
        `/buyers`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "createBuyer" });
      queryClient.invalidateQueries({ queryKey: queryKeys.buyers });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Create buyer failed",
        { id: "createBuyer" }
      );
    },
  });
};
