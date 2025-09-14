import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BuyerOverallReport } from "@/types";

type UseGetBuyerOverallReportParams = {
  buyerId: string;
  enabled?: boolean;
};

export const useGetBuyerOverallReport = ({
  buyerId,
  enabled = true,
}: UseGetBuyerOverallReportParams) => {
  return useQuery({
    queryKey: ["buyer-overall-report", buyerId],
    queryFn: async (): Promise<BuyerOverallReport> => {
      const response = await api.get(`/reports/buyer/${buyerId}/overall`);
      return response.data.data;
    },
    enabled: enabled && !!buyerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
