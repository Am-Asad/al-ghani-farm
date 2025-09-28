import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type ShedOption = { _id: string; name: string };

export const useGetShedsDropdown = (params: {
  search: string;
  farmId?: string; // Can be comma-separated string for multiple farms
  shedId?: string; // Can be comma-separated string for multiple sheds
}) => {
  const { search, farmId, shedId } = params;
  return useQuery({
    queryKey: ["sheds-dropdown", search, farmId ?? "", shedId ?? ""],
    queryFn: async () => {
      const response = await api.get<APIResponse<ShedOption[]>>(
        `/sheds/dropdown`,
        {
          params: { search, farmId, shedId },
        }
      );
      return response.data;
    },
  });
};
