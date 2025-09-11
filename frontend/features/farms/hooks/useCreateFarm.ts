import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "@/lib/query-client";
import { Farm as FarmType } from "@/types/farm-types";
import { APIResponse } from "@/types";

export const useCreateFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating farm...", { id: "createFarm" });
    },
    mutationFn: async (
      farmData: Pick<FarmType, "name" | "supervisor" | "totalSheds">
    ) => {
      const response = await api.post<APIResponse<FarmType>>(
        `/farms`,
        farmData
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "createFarm" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Create farm failed",
        { id: "createFarm" }
      );
    },
  });
};
