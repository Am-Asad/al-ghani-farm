import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ShedDailyReport } from "@/types";

type UseGetShedDailyReportParams = {
  shedId: string;
  date: string;
  enabled?: boolean;
};

export const useGetShedDailyReport = ({
  shedId,
  date,
  enabled = true,
}: UseGetShedDailyReportParams) => {
  return useQuery({
    queryKey: ["shed-daily-report", shedId, date],
    queryFn: async (): Promise<ShedDailyReport> => {
      const response = await api.get(`/reports/shed/${shedId}/daily/${date}`);
      return response.data.data;
    },
    enabled: enabled && !!shedId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
