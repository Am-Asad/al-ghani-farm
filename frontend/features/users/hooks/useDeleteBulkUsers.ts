import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";

export const useDeleteBulkUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting users...", { id: "deleteBulkUsers" });
    },
    mutationFn: async () => {
      const response = await api.delete(`/users/all`);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBulkUsers" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete bulk users failed",
        { id: "deleteBulkUsers" }
      );
    },
  });
};
