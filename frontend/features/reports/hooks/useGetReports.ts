import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useAuthContext } from "@/providers/AuthProvider";
import { ReportQueryParams } from "./useReportQueryParams";

// Types for the report response
export type ReportTransaction = {
  _id: string;
  date: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  accountantName: string;
  emptyVehicleWeight: number;
  grossWeight: number;
  netWeight: number;
  numberOfBirds: number;
  rate: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  buyerInfo: {
    _id: string;
    name: string;
    contactNumber: string;
    address: string;
  };
  farmInfo: {
    _id: string;
    name: string;
    supervisor: string;
  };
  flockInfo: {
    _id: string;
    name: string;
    status: string;
  };
  shedInfo: {
    _id: string;
    name: string;
    capacity: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type ReportSummary = {
  totalTransactions: number;
  totalEmptyVehicleWeight: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalBirds: number;
  totalRate: number;
  totalAmount: number;
  totalPaid: number;
  totalBalance: number;
  averageRate: number;
  averageNetWeight: number;
  averageBirdsPerTransaction: number;
  dateRange?: {
    from: string;
    to: string;
  };
};

export type ReportData = {
  reportTitle: string;
  dateRange?: {
    from: string;
    to: string;
  };
  summary: ReportSummary;
  transactions: ReportTransaction[];
  pagination?: {
    totalCount: number;
    hasMore: boolean;
    page?: number;
    limit?: number;
  };
};

export type GroupedReportData = {
  reportTitle: string;
  groupBy: string;
  summary: ReportSummary;
  ledgers: Array<{
    groupId: string;
    groupInfo: any;
    summary: ReportSummary;
    transactions: ReportTransaction[];
  }>;
};

export type APIResponse<T> = {
  status: string;
  message: string;
  data: T;
};

export const useGetReports = (query?: ReportQueryParams) => {
  const { user } = useAuthContext();

  return useQuery({
    queryKey: [...queryKeys.reports, query],
    queryFn: async () => {
      try {
        // Clean up empty parameters and handle special values
        const cleanQuery = Object.fromEntries(
          Object.entries(query ?? {})
            .filter(([key, value]) => {
              // Keep payment status values even if they're "all" (we'll handle that in map)
              if (key === "paymentStatus") return true;
              // For other fields, filter out empty strings and undefined
              return value !== "" && value !== undefined;
            })
            .map(([key, value]) => {
              // Convert "all" payment status to empty string for API (which means no filter)
              if (key === "paymentStatus" && value === "all") {
                return [key, ""];
              }
              return [key, value];
            })
            .filter(([key, value]) => {
              // Final filter to remove empty strings after processing
              return value !== "";
            })
        );

        // Debug: Log the query being sent to API
        console.log("Reports API Query:", cleanQuery);

        const response = await api.get<
          APIResponse<ReportData | GroupedReportData>
        >(`/reports/universal`, {
          params: cleanQuery,
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.message || "Failed to fetch reports"
            : "Failed to fetch reports"
        );
        throw error;
      }
    },
    enabled: !!user?._id,
    placeholderData: (previousData) => previousData,
  });
};
