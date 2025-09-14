import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ShedOverallReport } from "@/types";

type UseGetShedOverallReportParams = {
  shedId: string;
  enabled?: boolean;
};

export const useGetShedOverallReport = ({
  shedId,
  enabled = true,
}: UseGetShedOverallReportParams) => {
  return useQuery({
    queryKey: ["shed-overall-report", shedId],
    queryFn: async (): Promise<ShedOverallReport> => {
      const response = await api.get(`/reports/shed/${shedId}/overall`);
      return response.data.data;
    },
    enabled: enabled && !!shedId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
