import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";
import { Farm as FarmType } from "@/types";

export const useGetFarmsDropdown = (params: {
  search: string;
  farmId?: string;
}) => {
  const { search, farmId } = params;
  return useQuery({
    queryKey: ["farms-dropdown", search, farmId ?? ""],
    queryFn: async () => {
      const response = await api.get<
        APIResponse<Pick<FarmType, "_id" | "name">[]>
      >(`/farms/dropdown`, {
        params: { search, farmId },
      });
      return response.data;
    },
  });
};
