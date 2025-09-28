import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";
import { Farm as FarmType } from "@/types";

export const useGetFarmsDropdown = (params: {
  search: string;
  farmIds?: string; // Comma-separated string of selected farm IDs
}) => {
  const { search, farmIds } = params;
  return useQuery({
    queryKey: ["farms-dropdown", search, farmIds ?? ""],
    queryFn: async () => {
      const response = await api.get<
        APIResponse<Pick<FarmType, "_id" | "name">[]>
      >(`/farms/dropdown`, {
        params: { search, farmIds },
      });
      return response.data;
    },
  });
};
