import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type ShedOption = { _id: string; name: string };

export const useGetShedsDropdown = (params: {
  search: string;
  farmId?: string; // Can be comma-separated string for multiple farms
  shedIds?: string; // Comma-separated string of selected shed IDs
}) => {
  const { search, farmId, shedIds } = params;
  return useQuery({
    queryKey: ["sheds-dropdown", search, farmId ?? "", shedIds ?? ""],
    queryFn: async () => {
      const response = await api.get<APIResponse<ShedOption[]>>(
        `/sheds/dropdown`,
        {
          params: { search, farmId, shedIds },
        }
      );
      return response.data;
    },
  });
};
