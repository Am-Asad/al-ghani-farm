import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { FlockOverallReport } from "@/types";

type UseGetFlockOverallReportParams = {
  flockId: string;
  enabled?: boolean;
};

export const useGetFlockOverallReport = ({
  flockId,
  enabled = true,
}: UseGetFlockOverallReportParams) => {
  return useQuery({
    queryKey: ["flock-overall-report", flockId],
    queryFn: async (): Promise<FlockOverallReport> => {
      const response = await api.get(`/reports/flock/${flockId}/overall`);
      return response.data.data;
    },
    enabled: enabled && !!flockId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
