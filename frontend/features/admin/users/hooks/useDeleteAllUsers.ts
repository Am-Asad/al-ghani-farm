import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useDeleteAllUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting all users...", { id: "deleteAllUsers" });
    },
    mutationFn: async () => {
      const response = await api.delete<APIResponse<[]>>(`/users/all`);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteAllUsers" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete all users failed",
        { id: "deleteAllUsers" }
      );
    },
  });
};
