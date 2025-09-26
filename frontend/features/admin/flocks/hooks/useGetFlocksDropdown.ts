import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type FlockOption = { _id: string; name: string };

export const useGetFlocksDropdown = (params: {
  search: string;
  farmId?: string;
  flockId?: string;
  shedId?: string;
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
