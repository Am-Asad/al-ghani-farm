import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Farm as FarmType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllFarms = () => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: queryKeys.farms,
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<FarmType[]>>(`/farms`);
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch farms"
        );
      }
    },
    enabled: !!user?._id,
  });
};
