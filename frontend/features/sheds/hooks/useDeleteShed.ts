import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useDeleteShed = (flockId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Deleting shed...", { id: "deleteShed" });
    },
    mutationFn: async ({ shedId }: { shedId: string }) => {
      const response = await api.delete<APIResponse<{ id: string }>>(
        `/sheds/${shedId}`
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "deleteShed" });
      queryClient.invalidateQueries({
        queryKey: queryKeys.flockById(flockId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.flocks });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : error.message,
        { id: "deleteShed" }
      );
    },
  });
};
