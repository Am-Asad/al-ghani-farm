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
};

const ReportsSummary = ({
  summary,
  isLoading,
  reportTitle,
  dateRange,
}: ReportsSummaryProps) => {
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Total number of transactions",
    },
    {
      title: "Total Amount",
      value: formatAmount(summary.totalAmount || 0),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Total monetary value",
    },
    {
      title: "Total Birds",
      value: (summary.totalBirds || 0).toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Total number of birds",
    },
    {
      title: "Net Weight",
      value: `${(summary.totalNetWeight || 0).toLocaleString()} kg`,
      icon: Weight,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
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
      title: "Total Paid",
      value: formatAmount(summary.totalPaid || 0),
      icon: CreditCard,
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
                {dateRange && (
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                    </span>
                  </div>
                )}
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
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <CreditCard className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-700 font-medium">Total Paid</p>
              <p className="text-lg font-bold text-green-800">
                {formatAmount(summary.totalPaid || 0)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-700 font-medium">Balance Due</p>
              <p className="text-lg font-bold text-orange-800">
                {formatAmount(summary.totalBalance || 0)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-700 font-medium">Payment Rate</p>
              <p className="text-lg font-bold text-blue-800">
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
