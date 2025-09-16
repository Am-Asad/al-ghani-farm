import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FarmDailyReport } from "@/types";

type Params = { farmId: string; date: string; enabled?: boolean };

export const useGetFarmDailyReport = ({
  farmId,
  date,
  enabled = true,
}: Params) => {
  return useQuery({
    queryKey: ["farm-daily-report", farmId, date],
    queryFn: async (): Promise<FarmDailyReport> => {
      const res = await api.get(`/reports/farm/${farmId}/daily/${date}`);
      return res.data.data;
    },
    enabled: enabled && !!farmId && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
