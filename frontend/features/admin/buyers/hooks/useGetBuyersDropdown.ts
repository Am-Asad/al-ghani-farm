import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type BuyerOption = { _id: string; name: string };

export const useGetBuyersDropdown = (params: {
  search: string;
  buyerIds?: string; // Comma-separated string of selected buyer IDs
}) => {
  const { search, buyerIds } = params;
  return useQuery({
    queryKey: ["buyers-dropdown", search, buyerIds ?? ""],
    queryFn: async () => {
      const response = await api.get<APIResponse<BuyerOption[]>>(
        `/buyers/dropdown`,
        {
          params: { search, buyerIds },
        }
      );
      return response.data;
    },
  });
};
