import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { APIResponse } from "@/types";

type ShedOption = { _id: string; name: string };

export const useGetShedsDropdown = (params: {
  search: string;
  farmId?: string;
  shedId?: string;
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
