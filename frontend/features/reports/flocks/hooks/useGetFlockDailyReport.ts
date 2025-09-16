import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FlockDailyReport } from "@/types";

type UseGetFlockDailyReportParams = {
  flockId: string;
  date: string;
  enabled?: boolean;
};

export const useGetFlockDailyReport = ({
  flockId,
  date,
  enabled = true,
}: UseGetFlockDailyReportParams) => {
  return useQuery({
    queryKey: ["flock-daily-report", flockId, date],
    queryFn: async (): Promise<FlockDailyReport> => {
      const response = await api.get(`/reports/flock/${flockId}/daily/${date}`);
      return response.data.data;
    },
    enabled: enabled && !!flockId && !!date,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
