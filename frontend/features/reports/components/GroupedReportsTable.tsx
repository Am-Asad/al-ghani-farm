"use client";
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  GroupedResult,
  GroupInfo,
  ReportTransaction,
} from "../hooks/useGetReports";
import {
  formatAmount,
  formatCurrency,
  formatDateCompact,
  formatSingleDigit,
} from "@/utils/formatting";
import { cn } from "@/lib/utils";
import DataTable, { Column } from "@/features/shared/components/DataTable";

type GroupedReportsTableProps = {
  groupedResults: GroupedResult[];
  groupBy: string;
  isLoading?: boolean;
  includeDetails?: boolean;
};

const GroupedReportsTable = ({
  groupedResults,
  groupBy,
  isLoading,
}: GroupedReportsTableProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const getGroupTitle = (groupInfo: GroupInfo, groupBy: string) => {
    if (!groupInfo) return "Unknown";

    switch (groupBy) {
      case "buyer":
        return groupInfo.name || "Unknown Buyer";
      case "farm":
        return groupInfo.name || "Unknown Farm";
      case "flock":
        return groupInfo.name || "Unknown Flock";
      case "shed":
        return groupInfo.name || "Unknown Shed";
      case "driver":
        return groupInfo.driverName || "Unknown Driver";
      case "accountant":
        return groupInfo.accountantName || "Unknown Accountant";
      case "date":
        return groupInfo.date
          ? formatDateCompact(groupInfo.date)
          : "Unknown Date";
      default:
        return "Unknown";
    }
  };

  const getGroupSubtitle = (groupInfo: GroupInfo, groupBy: string) => {
    if (!groupInfo) return "";

    switch (groupBy) {
      case "buyer":
        return groupInfo.contactNumber || "";
      case "farm":
        return groupInfo.supervisor || "";
      case "flock":
        return groupInfo.status || "";
      case "shed":
        return `Capacity: ${groupInfo.capacity || 0}`;
      case "driver":
        return groupInfo.driverContact || "";
      case "accountant":
        return "";
      case "date":
        return "";
      default:
        return "";
    }
  };

  // Helper removed: status is rendered inline in column cells for clarity

  const columns: Column<ReportTransaction>[] = useMemo(
    () => [
      {
        id: "date",
        header: "Date",
        accessorKey: "date",
        visible: true,
        cell: ({ row }) => {
          return formatDateCompact(row.original.date);
        },
      },
      {
        id: "farm",
        header: "Farm",
        accessorKey: "farmInfo",
        visible: true,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">
                {formatSingleDigit(row.original.farmInfo?.name)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatSingleDigit(row.original.farmInfo?.supervisor)}
              </div>
            </div>
          );
        },
      },
      {
        id: "shed",
        header: "Shed",
        accessorKey: "shedInfo",
        visible: true,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">
                {formatSingleDigit(row.original.shedInfo?.name)}
              </div>
              <div className="text-sm text-muted-foreground">
                Cap: {formatSingleDigit(row.original.shedInfo?.capacity)}
              </div>
            </div>
          );
        },
      },
      {
        id: "flock",
        header: "Flock",
        accessorKey: "flockInfo",
        visible: true,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">
                {formatSingleDigit(row.original.flockInfo?.name)}
              </div>
              <Badge
                variant={
                  row.original.flockInfo?.status === "active"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {formatSingleDigit(row.original.flockInfo?.status)}
              </Badge>
            </div>
          );
        },
      },
      {
        id: "buyer",
        header: "Buyer",
        accessorKey: "buyerInfo",
        visible: true,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">
                {formatSingleDigit(row.original.buyerInfo?.name)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatSingleDigit(row.original.buyerInfo?.contactNumber)}
              </div>
              <div className="text-sm text-muted-foreground">
                {row.original.buyerInfo?.address}
              </div>
            </div>
          );
        },
      },
      {
        id: "vehicleNumber",
        header: "Vehicle Number",
        accessorKey: "vehicleNumber",
        visible: true,
        cell: ({ row }) => {
          return (
            <span className="font-mono text-sm">
              {formatSingleDigit(row.original.vehicleNumber)}
            </span>
          );
        },
      },
      {
        id: "driver",
        header: "Driver",
        accessorKey: "driverName",
        visible: true,
        cell: ({ row }) => {
          return (
            <div>
              <div className="font-medium">
                {formatSingleDigit(row.original.driverName)}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatSingleDigit(row.original.driverContact)}
              </div>
            </div>
          );
        },
      },
      {
        id: "accountant",
        header: "Accountant",
        accessorKey: "accountantName",
        visible: true,
        width: "180px",
      },
      {
        id: "emptyVehicleWeight",
        header: "Empty Vehicle Weight",
        accessorKey: "emptyVehicleWeight",
        visible: true,
        width: "200px",
        cell: ({ row }) => {
          return `${formatAmount(row.original.emptyVehicleWeight)} Kg`;
        },
      },
      {
        id: "grossWeight",
        header: "Gross Weight",
        accessorKey: "grossWeight",
        visible: true,
        width: "200px",
        cell: ({ row }) => {
          return `${formatAmount(row.original.grossWeight)} Kg`;
        },
      },
      {
        id: "netWeight",
        header: "Net Weight",
        accessorKey: "netWeight",
        visible: true,
        width: "140px",
        cell: ({ row }) => {
          return `${formatAmount(row.original.netWeight)} Kg`;
        },
      },
      {
        id: "numberOfBirds",
        header: "Number of Birds",
        accessorKey: "numberOfBirds",
        visible: true,
        width: "160px",
        cell: ({ row }) => {
          return `${formatAmount(row.original.numberOfBirds)} Kg`;
        },
      },
      {
        id: "rate",
        header: "Rate",
        accessorKey: "rate",
        visible: true,
        width: "120px",
        cell: ({ row }) => {
          return `${formatAmount(row.original.rate)} / kg`;
        },
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        accessorKey: "totalAmount",
        visible: true,
        width: "140px",
        cell: ({ row }) => {
          return `${formatCurrency(row.original.totalAmount)}`;
        },
      },
      {
        id: "amountPaid",
        header: "Paid",
        accessorKey: "amountPaid",
        visible: true,
        width: "140px",
        cell: ({ row }) => {
          return `${formatCurrency(row.original.amountPaid)}`;
        },
      },
      {
        id: "balance",
        header: "Balance",
        accessorKey: "balance",
        visible: true,
        width: "140px",
        cell: ({ row }) => {
          const balance = row.original.totalAmount - row.original.amountPaid;
          const isOverdue = balance > 0;
          return (
            <span
              className={
                isOverdue ? "text-destructive font-medium" : "text-chart-2"
              }
            >
              {formatCurrency(balance)}
            </span>
          );
        },
      },
      {
        id: "paymentStatus",
        header: "Payment Status",
        visible: true,
        width: "140px",
        cell: ({ row }) => {
          const balance = row.original.totalAmount - row.original.amountPaid;
          const isOverdue = balance > 0;
          return (
            <Badge
              variant={isOverdue ? "destructive" : "default"}
              className={cn(
                isOverdue
                  ? "bg-destructive/10 text-destructive"
                  : "bg-chart-2/10 text-chart-2"
              )}
            >
              {isOverdue ? "Overdue" : "Paid"}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!groupedResults || groupedResults.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No grouped results found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedResults.map((group, index) => {
        const groupId = group.groupId || `group-${index}`;
        const isExpanded = expandedGroups.has(groupId);
        const groupTitle = getGroupTitle(group.groupInfo || {}, groupBy);
        const groupSubtitle = getGroupSubtitle(group.groupInfo || {}, groupBy);

        return (
          <Card key={groupId} className="overflow-hidden">
            <Collapsible
              open={isExpanded}
              onOpenChange={() => toggleGroup(groupId)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {groupTitle}
                        </CardTitle>
                        {groupSubtitle && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {groupSubtitle}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-right">
                        <div className="font-medium">
                          {group.summary.totalTransactions} transactions
                        </div>
                        <div className="text-muted-foreground">
                          {formatAmount(group.summary.totalAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0 flex flex-col gap-4">
                  {/* Group Summary - show ALL summary fields similar to overall summary */}
                  <div className="space-y-4">
                    {/* Primary metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {group.summary.totalTransactions}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Transactions
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {group.summary.totalAmount
                            ? formatAmount(group.summary.totalAmount)
                            : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Amount
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {group.summary.totalBirds.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Birds
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {group.summary.totalNetWeight.toLocaleString()} kg
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Net Weight
                        </div>
                      </div>
                    </div>

                    {/* Additional metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Average Rate
                        </div>
                        <div className="text-lg font-semibold">
                          {formatAmount(group.summary.averageRate || 0)}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Average Weight
                        </div>
                        <div className="text-lg font-semibold">
                          {(group.summary.averageNetWeight || 0).toFixed(1)} kg
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Birds/Transaction
                        </div>
                        <div className="text-lg font-semibold">
                          {(
                            group.summary.averageBirdsPerTransaction || 0
                          ).toFixed(0)}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Total Rate
                        </div>
                        <div className="text-lg font-semibold">
                          {(group.summary.totalRate || 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Empty Vehicle Weight
                        </div>
                        <div className="text-lg font-semibold">
                          {(
                            group.summary.totalEmptyVehicleWeight || 0
                          ).toLocaleString()}{" "}
                          kg
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className="text-xs text-muted-foreground">
                          Gross Weight
                        </div>
                        <div className="text-lg font-semibold">
                          {(
                            group.summary.totalGrossWeight || 0
                          ).toLocaleString()}{" "}
                          kg
                        </div>
                      </div>
                    </div>

                    {/* Payment summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-chart-2/10 border border-chart-2/20">
                        <p className="text-sm text-chart-2 font-medium">
                          Total Paid
                        </p>
                        <p className="text-lg font-bold text-chart-2">
                          {formatAmount(group.summary.totalPaid || 0)}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-chart-4/10 border border-chart-4/20">
                        <p className="text-sm text-chart-4 font-medium">
                          Balance Due
                        </p>
                        <p className="text-lg font-bold text-chart-4">
                          {formatAmount(group.summary.totalBalance || 0)}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-chart-1/10 border border-chart-1/20">
                        <p className="text-sm text-chart-1 font-medium">
                          Payment Rate
                        </p>
                        <p className="text-lg font-bold text-chart-1">
                          {group.summary.totalAmount > 0
                            ? `${(
                                ((group.summary.totalPaid || 0) /
                                  (group.summary.totalAmount || 1)) *
                                100
                              ).toFixed(1)}%`
                            : "0%"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  {group.transactions.length > 0 && (
                    <DataTable
                      data={group.transactions}
                      columns={columns}
                      getRowId={(row) => row._id}
                      selectionMode="none"
                      emptyMessage="No transactions found"
                      showColumnVisibilityToggle={true}
                    />
                  )}

                  {group.transactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions found for this group
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
};

export default GroupedReportsTable;
