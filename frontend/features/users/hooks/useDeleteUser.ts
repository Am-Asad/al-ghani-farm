import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting user...", { id: "deleteUser" });
    },
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteUser" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : error.message,
        { id: "deleteUser" }
      );
    },
  });
};
