"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ReportTransaction, ReportSummary } from "../hooks/useGetReports";
import { formatAmount } from "@/utils/format-amount";
import { formatDate } from "@/utils/format-date";

type ReportsTableProps = {
  transactions: ReportTransaction[];
  summary: ReportSummary | undefined;
  isLoading?: boolean;
};

const ReportsTable = ({
  transactions,
  summary,
  isLoading,
}: ReportsTableProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-4 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Safety check for undefined summary
  if (!summary) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No summary data available
      </div>
    );
  }

  const getPaymentStatusBadge = (amountPaid: number, totalAmount: number) => {
    if (amountPaid === totalAmount) {
      return <Badge variant="default">Paid</Badge>;
    } else if (amountPaid > 0 && amountPaid < totalAmount) {
      return <Badge variant="secondary">Partial</Badge>;
    } else {
      return <Badge variant="destructive">Unpaid</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Transactions
          </h3>
          <p className="text-2xl font-bold">{summary.totalTransactions}</p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Amount
          </h3>
          <p className="text-2xl font-bold">
            {formatAmount(summary.totalAmount || 0)}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Birds
          </h3>
          <p className="text-2xl font-bold">
            {(summary.totalBirds || 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-4 rounded-lg border">
          <h3 className="text-sm font-medium text-muted-foreground">
            Net Weight (kg)
          </h3>
          <p className="text-2xl font-bold">
            {(summary.totalNetWeight || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      {transactions.length > 0 ? (
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Buyer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Farm
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Flock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Shed
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Vehicle
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Driver
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Birds
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Net Weight
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Rate
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Paid
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Balance
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-b hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-medium">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {transaction.buyerInfo.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.buyerInfo.contactNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {transaction.farmInfo.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.farmInfo.supervisor}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {transaction.flockInfo.name}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {transaction.flockInfo.status}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {transaction.shedInfo.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cap: {transaction.shedInfo.capacity}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {transaction.vehicleNumber}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">
                        {transaction.driverName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.driverContact}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {(transaction.numberOfBirds || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {(transaction.netWeight || 0).toLocaleString()} kg
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatAmount(transaction.rate || 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {formatAmount(transaction.totalAmount || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatAmount(transaction.amountPaid || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {formatAmount(transaction.balance || 0)}
                  </td>
                  <td className="px-4 py-3">
                    {getPaymentStatusBadge(
                      transaction.amountPaid || 0,
                      transaction.totalAmount || 0
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions found for the selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default ReportsTable;
