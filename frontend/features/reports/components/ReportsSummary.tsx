"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportSummary } from "../hooks/useGetReports";
import { formatAmount, formatDate } from "@/utils/formatting";
import {
  Receipt,
  DollarSign,
  Users,
  Weight,
  TrendingUp,
  Calendar,
  Package,
  CreditCard,
} from "lucide-react";

type ReportsSummaryProps = {
  summary: ReportSummary | undefined;
  isLoading?: boolean;
  reportTitle?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  duration?: string;
};

const ReportsSummary = ({
  summary,
  isLoading,
  reportTitle,
  dateRange,
  duration,
}: ReportsSummaryProps) => {
  // Helper function to get clarification message based on duration type
  const getDateRangeClarification = () => {
    if (!duration) return null;

    switch (duration) {
      case "yearly":
        return "Transactions found within the selected year (filter: January 1 - December 31)";
      case "monthly":
        return "Transactions found within the selected month (filter: first day to last day of month)";
      case "weekly":
        return "Transactions found within the selected week (week calculation: Sunday to Saturday)";
      case "daily":
        return "Transactions found for the selected day";
      case "custom":
        return "Transactions found within the selected date range";
      case "period":
        return "Transactions found within the specified period";
      default:
        return "Transactions found within the selected time period";
    }
  };
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  if (!summary) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">
            <Receipt className="w-8 h-8 mx-auto mb-2" />
            <p>No summary data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryCards = [
    {
      title: "Total Transactions",
      value: summary.totalTransactions,
      icon: Receipt,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
      description: "Total number of transactions",
    },
    {
      title: "Total Amount",
      value: formatAmount(summary.totalAmount || 0),
      icon: DollarSign,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      description: "Total monetary value",
    },
    {
      title: "Total Birds",
      value: (summary.totalBirds || 0).toLocaleString(),
      icon: Users,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      description: "Total number of birds",
    },
    {
      title: "Net Weight",
      value: `${(summary.totalNetWeight || 0).toLocaleString()} kg`,
      icon: Weight,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      description: "Total net weight",
    },
  ];

  const additionalMetrics = [
    {
      title: "Average Rate",
      value: formatAmount(summary.averageRate || 0),
      icon: TrendingUp,
    },
    {
      title: "Average Weight",
      value: `${(summary.averageNetWeight || 0).toFixed(1)} kg`,
      icon: Package,
    },
    {
      title: "Birds/Transaction",
      value: (summary.averageBirdsPerTransaction || 0).toFixed(0),
      icon: Users,
    },
    {
      title: "Total Rate",
      value: `${(summary.totalRate || 0).toLocaleString()}`,
      icon: TrendingUp,
    },
    {
      title: "Empty Vehicle Weight",
      value: `${(summary.totalEmptyVehicleWeight || 0).toLocaleString()} kg`,
      icon: Weight,
    },
    {
      title: "Gross Weight",
      value: `${(summary.totalGrossWeight || 0).toLocaleString()} kg`,
      icon: Weight,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Report Info */}
      {(reportTitle || dateRange) && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {reportTitle || "Report Summary"}
                </h3>
                <div className="mt-1 space-y-1">
                  {dateRange ? (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(dateRange.from)} -{" "}
                        {formatDate(dateRange.to)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        No transactions found for this period
                      </span>
                    </div>
                  )}
                  {getDateRangeClarification() && (
                    <div className="flex items-center gap-2 ml-6">
                      <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                      <span className="text-xs text-muted-foreground italic">
                        {getDateRangeClarification()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {summary.totalTransactions} transactions
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={index}
              className="relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold">{card.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {card.description}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Metrics */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Additional Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-sm font-medium">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardContent className="p-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">
            Payment Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <CreditCard className="w-6 h-6 text-chart-2 mx-auto mb-2" />
              <p className="text-sm text-chart-2 font-medium">Total Paid</p>
              <p className="text-lg font-bold text-chart-2">
                {formatAmount(summary.totalPaid || 0)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
              <DollarSign className="w-6 h-6 text-chart-4 mx-auto mb-2" />
              <p className="text-sm text-chart-4 font-medium">Balance Due</p>
              <p className="text-lg font-bold text-chart-4">
                {formatAmount(summary.totalBalance || 0)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <TrendingUp className="w-6 h-6 text-chart-1 mx-auto mb-2" />
              <p className="text-sm text-chart-1 font-medium">Payment Rate</p>
              <p className="text-lg font-bold text-chart-1">
                {summary.totalAmount > 0
                  ? `${(
                      (summary.totalPaid / summary.totalAmount) *
                      100
                    ).toFixed(1)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSummary;
