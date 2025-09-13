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
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "createShed" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.flockById(variables.flockId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
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
