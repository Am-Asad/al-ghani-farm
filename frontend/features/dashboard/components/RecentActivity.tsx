"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecentActivity as RecentActivityType } from "../hooks/useDashboardData";
import { formatAmount, formatDate } from "@/utils/formatting";
import {
  FileText,
  Users,
  Building2,
  Truck,
  Calendar,
  DollarSign,
} from "lucide-react";

type RecentActivityProps = {
  data: RecentActivityType;
  isLoading?: boolean;
};

const RecentActivity = ({ data, isLoading }: RecentActivityProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-muted animate-pulse rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "transaction":
        return <FileText className="w-4 h-4" />;
      case "flock":
        return <Users className="w-4 h-4" />;
      case "farm":
        return <Building2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "transaction":
        return "text-blue-600 bg-blue-50";
      case "flock":
        return "text-green-600 bg-green-50";
      case "farm":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Combine all activities and sort by creation date
  const allActivities = [
    ...data.recentTransactions.map((activity) => ({
      ...activity,
      sortDate: new Date(activity.createdAt),
    })),
    ...data.recentFlocks.map((activity) => ({
      ...activity,
      sortDate: new Date(activity.createdAt),
    })),
    ...data.recentFarms.map((activity) => ({
      ...activity,
      sortDate: new Date(activity.createdAt),
    })),
  ]
    .sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())
    .slice(0, 10);

  const renderActivityDetails = (activity: (typeof allActivities)[0]) => {
    if (activity.type === "transaction") {
      const transactionActivity =
        activity as (typeof data.recentTransactions)[0] & { sortDate: Date };
      return (
        <>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {formatAmount(transactionActivity.amount)}
          </div>
          {transactionActivity.vehicleNumber && (
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {transactionActivity.vehicleNumber}
            </div>
          )}
        </>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest updates from your operations
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allActivities.length > 0 ? (
            allActivities.map((activity) => (
              <div
                key={`${activity.type}-${activity.id}`}
                className="flex items-start space-x-4"
              >
                <div
                  className={`p-2 rounded-full ${getActivityColor(
                    activity.type
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(activity.createdAt)}
                    </div>
                    {renderActivityDetails(activity)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
