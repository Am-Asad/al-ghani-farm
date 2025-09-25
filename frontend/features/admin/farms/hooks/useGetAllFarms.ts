import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Farm as FarmType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

type QueryParams = {
  page: string;
  limit: string;
  search: string;
  sortBy: string;
  sortOrder: string;
};

export const useGetAllFarms = (query?: QueryParams) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.farms, query],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<FarmType[]>>(`/farms`, {
          params: query ?? {},
        });
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
    placeholderData: (previousData) => previousData,
  });
};
