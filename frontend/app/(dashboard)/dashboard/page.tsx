"use client";

import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Building2, Users, Truck, FileText } from "lucide-react";
import {
  useDashboardSummary,
  useRecentActivity,
} from "@/features/dashboard/hooks/useDashboardData";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import RecentActivity from "@/features/dashboard/components/RecentActivity";
import TopBuyers from "@/features/dashboard/components/TopBuyers";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
// import { useRouter } from "next/navigation";

export default function DashboardPage() {
  // const router = useRouter();

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    isError: dashboardError,
    error: dashboardErrorMsg,
  } = useDashboardSummary();

  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useRecentActivity(10);

  // Show skeleton loading when either dashboard or activity data is loading
  if (dashboardLoading || activityLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardError || activityError) {
    return (
      <div className="p-6">
        <ErrorFetchingData
          title="Dashboard"
          description="Overview of your poultry operations"
          buttonText="Try Again"
          error={
            (dashboardErrorMsg as Error)?.message ||
            "Failed to load dashboard data"
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your poultry operations
        </p>
      </div>

      {/* Dashboard Stats */}
      {dashboardData && (
        <DashboardStats data={dashboardData} isLoading={false} />
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        {activityData && (
          <RecentActivity data={activityData} isLoading={false} />
        )}

        {/* Top Buyers */}
        {dashboardData && <TopBuyers data={dashboardData} isLoading={false} />}
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => router.push("/admin?tab=farms")}
            >
              <Building2 className="w-6 h-6 text-primary mb-2" />
              <div className="text-sm font-medium">Add Farm</div>
              <div className="text-xs text-muted-foreground">
                Register new farm
              </div>
            </button>

            <button
              className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => router.push("/admin?tab=flocks")}
            >
              <Users className="w-6 h-6 text-primary mb-2" />
              <div className="text-sm font-medium">Start Flock</div>
              <div className="text-xs text-muted-foreground">
                Begin new flock
              </div>
            </button>

            <button
              className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => router.push("/admin?tab=ledgers")}
            >
              <FileText className="w-6 h-6 text-primary mb-2" />
              <div className="text-sm font-medium">Create Ledger</div>
              <div className="text-xs text-muted-foreground">
                New transaction
              </div>
            </button>

            <button
              className="p-4 text-left border border-border rounded-lg hover:bg-accent transition-colors"
              onClick={() => router.push("/admin?tab=vehicles")}
            >
              <Truck className="w-6 h-6 text-primary mb-2" />
              <div className="text-sm font-medium">Assign Vehicle</div>
              <div className="text-xs text-muted-foreground">
                Transport setup
              </div>
            </button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
