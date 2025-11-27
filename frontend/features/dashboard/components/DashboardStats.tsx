"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummary } from "../hooks/useDashboardData";
import { formatAmount } from "@/utils/formatting";
import {
  Building2,
  Feather,
  Receipt,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Package,
  Weight,
  UserCheck,
  Warehouse,
} from "lucide-react";

type DashboardStatsProps = {
  data: DashboardSummary;
  isLoading?: boolean;
};

const DashboardStats = ({ data, isLoading }: DashboardStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  <div className="h-8 bg-muted animate-pulse rounded w-16" />
                </div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const primaryStats = [
    {
      title: "Total Revenue",
      value: formatAmount(data.financialSummary.totalRevenue || 0),
      icon: DollarSign,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      description: "All-time revenue",
    },
    {
      title: "Active Flocks",
      value: (data.entityCounts.activeFlocks || 0).toString(),
      icon: Feather,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      description: "Currently raising birds",
    },
    {
      title: "This Month's Revenue",
      value: formatAmount(data.thisMonth.revenue || 0),
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      description: "Current month earnings",
    },
    {
      title: "Outstanding Balance",
      value: formatAmount(data.financialSummary.outstandingBalance || 0),
      icon: CreditCard,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      description: "Unpaid amounts",
    },
  ];

  const secondaryStats = [
    {
      title: "Total Farms",
      value: (data.entityCounts.totalFarms || 0).toString(),
      icon: Building2,
      description: "Registered farms",
    },
    {
      title: "Total Buyers",
      value: (data.entityCounts.totalBuyers || 0).toString(),
      icon: UserCheck,
      description: "Active buyers",
    },
    {
      title: "Total Sheds",
      value: (data.entityCounts.totalSheds || 0).toString(),
      icon: Warehouse,
      description: "Available sheds",
    },
    {
      title: "Total Transactions",
      value: (data.financialSummary.totalTransactions || 0).toString(),
      icon: Receipt,
      description: "All transactions",
    },
  ];

  const monthlyStats = [
    {
      title: "This Month's Birds",
      value: (data.thisMonth.birdsSold || 0).toLocaleString(),
      icon: Feather,
      description: "Birds sold this month",
    },
    {
      title: "This Month's Weight",
      value: `${(data.thisMonth.netWeight || 0).toLocaleString()} kg`,
      icon: Weight,
      description: "Net weight this month",
    },
    {
      title: "Avg Transaction Value",
      value: formatAmount(data.averages.transactionValue || 0),
      icon: DollarSign,
      description: "Average per transaction",
    },
    {
      title: "Avg Birds/Transaction",
      value: (data.averages.birdsPerTransaction || 0).toFixed(0),
      icon: Package,
      description: "Average birds per sale",
    },
  ];

  const paymentStatusCards: Array<{
    key: keyof DashboardSummary["paymentStatus"];
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    accentClass: string;
    containerClass: string;
  }> = [
    {
      key: "paid",
      label: "Paid",
      icon: CreditCard,
      accentClass: "text-chart-2",
      containerClass: "bg-chart-2/10 border border-chart-2/20",
    },
    {
      key: "partial",
      label: "Partial",
      icon: TrendingUp,
      accentClass: "text-chart-3",
      containerClass: "bg-chart-3/10 border border-chart-3/20",
    },
    {
      key: "unpaid",
      label: "Unpaid",
      icon: TrendingDown,
      accentClass: "text-destructive",
      containerClass: "bg-destructive/10 border border-destructive/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {primaryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {monthlyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentStatusCards.map(
              ({ key, label, icon: Icon, accentClass, containerClass }) => {
                const statusData = data.paymentStatus[key];
                return (
                  <div
                    key={key}
                    className={`text-center p-4 rounded-lg ${containerClass}`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${accentClass}`} />
                    <p className={`text-sm font-medium ${accentClass}`}>
                      {label}
                    </p>
                    <p className={`text-lg font-bold ${accentClass}`}>
                      {statusData?.count || 0}
                    </p>
                    <p className={`text-xs ${accentClass}`}>
                      {formatAmount(statusData?.totalAmount || 0)}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
