import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useDeleteBulkFarms = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting farms...", { id: "deleteBulkFarms" });
    },
    mutationFn: async () => {
      const response = await api.delete<APIResponse<[]>>(`/farms/all`);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteBulkFarms" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Delete bulk farms failed",
        { id: "deleteBulkFarms" }
      );
    },
  });
};
