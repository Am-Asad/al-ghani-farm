import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type BuyerOption = { _id: string; name: string };

export const useGetBuyersDropdown = (params: {
  search: string;
  buyerId?: string;
}) => {
  const { search, buyerId } = params;
  return useQuery({
    queryKey: ["buyers-dropdown", search, buyerId ?? ""],
    queryFn: async () => {
      const response = await api.get<APIResponse<BuyerOption[]>>(
        `/buyers/dropdown`,
        {
          params: { search, buyerId },
        }
      );
      return response.data;
    },
  });
};
