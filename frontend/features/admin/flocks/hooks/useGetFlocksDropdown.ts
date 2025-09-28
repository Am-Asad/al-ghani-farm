import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type FlockOption = { _id: string; name: string };

export const useGetFlocksDropdown = (params: {
  search: string;
  farmId?: string; // Can be comma-separated string for multiple farms
  flockId?: string; // Can be comma-separated string for multiple flocks
  shedId?: string; // Can be comma-separated string for multiple sheds
}) => {
  const { search, farmId, flockId, shedId } = params;
  return useQuery({
    queryKey: [
      "flocks-dropdown",
      search,
      farmId ?? "",
      flockId ?? "",
      shedId ?? "",
    ],
    queryFn: async () => {
      const response = await api.get<APIResponse<FlockOption[]>>(
        `/flocks/dropdown`,
        {
          params: { search, farmId, flockId, shedId },
        }
      );
      return response.data;
    },
  });
};
