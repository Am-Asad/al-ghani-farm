import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { Farm as FarmType } from "@/types/farm-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useEditFarm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing farm...", { id: "editFarm" });
    },
    mutationFn: async (farmData: Omit<FarmType, "createdAt" | "updatedAt">) => {
      const response = await api.put(`/farms/${farmData._id}`, farmData);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editFarm" });
      queryClient.invalidateQueries({ queryKey: queryKeys.farms });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit farm failed",
        { id: "editFarm" }
      );
    },
  });
};
