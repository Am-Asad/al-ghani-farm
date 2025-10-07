import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

// Types for dashboard data
export type DashboardSummary = {
  entityCounts: {
    totalFarms: number;
    totalBuyers: number;
    totalSheds: number;
    totalUsers: number;
    activeFlocks: number;
    completedFlocks: number;
  };
  financialSummary: {
    totalRevenue: number;
    totalPaid: number;
    outstandingBalance: number;
    totalTransactions: number;
  };
  thisMonth: {
    revenue: number;
    transactions: number;
    birdsSold: number;
    netWeight: number;
  };
  lastMonth: {
    revenue: number;
    transactions: number;
  };
  averages: {
    transactionValue: number;
    birdsPerTransaction: number;
    netWeightPerTransaction: number;
  };
  paymentStatus: {
    paid: { count: number; totalAmount: number };
    partial: { count: number; totalAmount: number };
    unpaid: { count: number; totalAmount: number };
  };
  topBuyers: Array<{
    id: string;
    name: string;
    transactionCount: number;
    totalAmount: number;
    totalBirds: number;
  }>;
};

export type RecentActivity = {
  recentTransactions: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    amount: number;
    date: string;
    createdAt: string;
    vehicleNumber: string;
    driverName: string;
  }>;
  recentFlocks: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    startDate: string;
    createdAt: string;
  }>;
  recentFarms: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
  }>;
};

export type DashboardStats = {
  thisMonth: {
    revenue: number;
    transactions: number;
    birds: number;
    netWeight: number;
  };
  lastMonth: {
    revenue: number;
    transactions: number;
    birds: number;
    netWeight: number;
  };
  changes: {
    revenue: number;
    transactions: number;
    birds: number;
    netWeight: number;
  };
};

// Hook for dashboard summary
export const useDashboardSummary = () => {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const response = await api.get("/dashboard/summary");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for recent activity
export const useRecentActivity = (limit?: number) => {
  return useQuery<RecentActivity>({
    queryKey: ["dashboard", "activity", limit],
    queryFn: async () => {
      const params = limit ? `?limit=${limit}` : "";
      const response = await api.get(`/dashboard/activity${params}`);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await api.get("/dashboard/stats");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
