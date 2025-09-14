import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { APIResponse, Shed as ShedType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useCreateShed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating shed...", { id: "createShed" });
    },
    mutationFn: async (
      payload: Omit<ShedType, "_id" | "createdAt" | "updatedAt">
    ) => {
      const response = await api.post<APIResponse<ShedType>>(`/sheds`, payload);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "createShed" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
      queryClient.invalidateQueries({ queryKey: queryKeys.sheds });
      queryClient.invalidateQueries({ queryKey: queryKeys.entities });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Create shed failed",
        { id: "createShed" }
      );
    },
  });
};
