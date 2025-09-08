import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useDeleteFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting farm...", { id: "deleteFarm" });
    },
    mutationFn: async (id: string) => {
      const response = await api.delete(`/farms/${id}`);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteFarm" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : error.message,
        { id: "deleteFarm" }
      );
    },
  });
};
