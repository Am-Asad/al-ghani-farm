import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BuyerDailyReport } from "@/types";

type UseGetBuyerDailyReportParams = {
  buyerId: string;
  date: string;
  enabled?: boolean;
};

export const useGetBuyerDailyReport = ({
  buyerId,
  date,
  enabled = true,
}: UseGetBuyerDailyReportParams) => {
  return useQuery({
    queryKey: ["buyer-daily-report", buyerId, date],
    queryFn: async (): Promise<BuyerDailyReport> => {
      const response = await api.get(`/reports/buyer/${buyerId}/daily/${date}`);
      return response.data.data;
    },
    enabled: enabled && !!buyerId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
