import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FarmOverallReport } from "@/types";

type Params = { farmId: string; enabled?: boolean };

export const useGetFarmOverallReport = ({ farmId, enabled = true }: Params) => {
  return useQuery({
    queryKey: ["farm-overall-report", farmId],
    queryFn: async (): Promise<FarmOverallReport> => {
      const res = await api.get(`/reports/farm/${farmId}/overall`);
      return res.data.data;
    },
    enabled: enabled && !!farmId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
