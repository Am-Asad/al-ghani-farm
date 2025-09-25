import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Shed as ShedType } from "@/types";
import { APIResponse } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

type QueryParams = {
  page: string;
  limit: string;
  search: string;
  farmId: string;
  sortBy: string;
  sortOrder: string;
  capacityMin?: string;
  capacityMax?: string;
  dateFrom?: string;
  dateTo?: string;
};

export const useGetAllSheds = (query?: QueryParams) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.sheds, query],
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<ShedType[]>>(`/sheds`, {
          params: query ?? {},
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
    placeholderData: (previousData) => previousData,
  });
};
