import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Shed as ShedType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditShed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing shed...", { id: "editShed" });
    },
    mutationFn: async (payload: Omit<ShedType, "createdAt" | "updatedAt">) => {
      const response = await api.put<APIResponse<ShedType>>(
        `/sheds/${payload._id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (response, variables) => {
      toast.success(response.message, { id: "editShed" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.flockById(variables.flockId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit shed failed",
        { id: "editFlock" }
      );
    },
  });
};
