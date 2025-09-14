import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Farm as FarmType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing farm...", { id: "editFarm" });
    },
    mutationFn: async (payload: Omit<FarmType, "createdAt" | "updatedAt">) => {
      const response = await api.put<APIResponse<FarmType>>(
        `/farms/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editFarm" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit farm failed",
        { id: "editFarm" }
      );
    },
  });
};
