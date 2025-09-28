import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type FlockOption = { _id: string; name: string };

export const useGetFlocksDropdown = (params: {
  search: string;
  farmId?: string; // Can be comma-separated string for multiple farms
  flockIds?: string; // Comma-separated string of selected flock IDs
  shedId?: string; // Can be comma-separated string for multiple sheds
}) => {
  const { search, farmId, flockIds, shedId } = params;
  return useQuery({
    queryKey: [
      "flocks-dropdown",
      search,
      farmId ?? "",
      flockIds ?? "",
      shedId ?? "",
    ],
    queryFn: async () => {
      const response = await api.get<APIResponse<FlockOption[]>>(
        `/flocks/dropdown`,
        {
          params: { search, farmId, flockIds, shedId },
        }
      );
      return response.data;
    },
  });
};
