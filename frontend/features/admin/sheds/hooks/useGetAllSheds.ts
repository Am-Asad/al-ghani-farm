import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Shed as ShedType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllSheds = (farmId?: string) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: farmId ? [...queryKeys.sheds, farmId] : queryKeys.sheds,
    queryFn: async () => {
      try {
        const params = farmId ? { farmId } : {};
        const response = await api.get<APIResponse<ShedType[]>>(`/sheds`, {
          params,
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch sheds"
        );
      }
    },
    enabled: !!user?._id,
  });
};
