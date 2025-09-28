"use client";
import React, { useState } from "react";
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
  formatDateCompact,
  formatSingleDigit,
} from "@/utils/formatting";
import { cn } from "@/lib/utils";

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
  includeDetails = true,
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

  const getPaymentStatusBadge = (amountPaid: number, totalAmount: number) => {
    if (amountPaid === totalAmount) {
      return <Badge variant="default">Paid</Badge>;
    } else if (amountPaid > 0 && amountPaid < totalAmount) {
      return <Badge variant="secondary">Partial</Badge>;
    } else {
      return <Badge variant="destructive">Unpaid</Badge>;
    }
  };

  const renderTransactionRow = (transaction: ReportTransaction) => (
    <div
      key={transaction._id}
      className="grid grid-cols-12 gap-2 p-3 border-b border-muted/50 text-sm"
    >
      <div className="col-span-2">{formatDateCompact(transaction.date)}</div>
      <div className="col-span-2">
        <div className="font-medium">
          {formatSingleDigit(transaction.vehicleNumber)}
        </div>
        <div className="text-muted-foreground text-xs">
          {formatSingleDigit(transaction.driverName)}
        </div>
      </div>
      <div className="col-span-2">
        <div className="font-medium">
          {formatSingleDigit(transaction.farmInfo.name)}
        </div>
        <div className="text-muted-foreground text-xs">
          {formatSingleDigit(transaction.flockInfo.name)}
        </div>
      </div>
      <div className="col-span-1 text-center">
        {(transaction.numberOfBirds || 0).toLocaleString()}
      </div>
      <div className="col-span-1 text-center">
        {(transaction.netWeight || 0).toLocaleString()} kg
      </div>
      <div className="col-span-1 text-center">
        {formatAmount(transaction.rate || 0)}
      </div>
      <div className="col-span-1 text-center font-medium">
        {formatAmount(transaction.totalAmount || 0)}
      </div>
      <div className="col-span-1 text-center">
        {formatAmount(transaction.amountPaid || 0)}
      </div>
      <div className="col-span-1 text-center">
        <span
          className={cn(
            transaction.balance > 0 ? "text-destructive" : "text-chart-2"
          )}
        >
          {formatAmount(transaction.balance || 0)}
        </span>
      </div>
    </div>
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
                <CardContent className="pt-0">
                  {/* Group Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
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
                        {group.summary.totalBirds.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Birds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {group.summary.totalNetWeight.toLocaleString()} kg
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Net Weight
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {formatAmount(group.summary.totalAmount)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Amount
                      </div>
                    </div>
                  </div>

                  {/* Transactions Table */}
                  {includeDetails && group.transactions.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium border-b">
                        <div className="col-span-2">Date</div>
                        <div className="col-span-2">Vehicle/Driver</div>
                        <div className="col-span-2">Farm/Flock</div>
                        <div className="col-span-1 text-center">Birds</div>
                        <div className="col-span-1 text-center">Weight</div>
                        <div className="col-span-1 text-center">Rate</div>
                        <div className="col-span-1 text-center">Total</div>
                        <div className="col-span-1 text-center">Paid</div>
                        <div className="col-span-1 text-center">Balance</div>
                      </div>

                      {/* Table Body */}
                      <div className="max-h-96 overflow-y-auto">
                        {group.transactions.map(renderTransactionRow)}
                      </div>
                    </div>
                  )}

                  {includeDetails && group.transactions.length === 0 && (
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
