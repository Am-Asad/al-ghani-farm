"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import { ReportTransaction } from "../hooks/useGetReports";
import {
  formatAmount,
  formatDateCompact,
  formatSingleDigit,
} from "@/utils/formatting";
import { cn } from "@/lib/utils";

type ReportsTableProps = {
  transactions: ReportTransaction[];
  isLoading?: boolean;
  includeDetails?: boolean;
};

const ReportsTable = ({
  transactions,
  isLoading,
  includeDetails = true,
}: ReportsTableProps) => {
  const getPaymentStatusBadge = (amountPaid: number, totalAmount: number) => {
    if (amountPaid === totalAmount) {
      return <Badge variant="default">Paid</Badge>;
    } else if (amountPaid > 0 && amountPaid < totalAmount) {
      return <Badge variant="secondary">Partial</Badge>;
    } else {
      return <Badge variant="destructive">Unpaid</Badge>;
    }
  };

  const columns: Column<ReportTransaction>[] = [
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
      id: "buyer",
      header: "Buyer",
      accessorKey: "buyerInfo" as keyof ReportTransaction,
      visible: true,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {formatSingleDigit(row.original.buyerInfo.name)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatSingleDigit(row.original.buyerInfo.contactNumber)}
            </div>
          </div>
        );
      },
    },
    {
      id: "farm",
      header: "Farm",
      accessorKey: "farmInfo" as keyof ReportTransaction,
      visible: true,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {formatSingleDigit(row.original.farmInfo.name)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatSingleDigit(row.original.farmInfo.supervisor)}
            </div>
          </div>
        );
      },
    },
    {
      id: "flock",
      header: "Flock",
      accessorKey: "flockInfo" as keyof ReportTransaction,
      visible: true,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {formatSingleDigit(row.original.flockInfo.name)}
            </div>
            <Badge variant="outline" className="text-xs">
              {formatSingleDigit(row.original.flockInfo.status)}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "shed",
      header: "Shed",
      accessorKey: "shedInfo" as keyof ReportTransaction,
      visible: true,
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {formatSingleDigit(row.original.shedInfo.name)}
            </div>
            <div className="text-sm text-muted-foreground">
              Cap: {formatSingleDigit(row.original.shedInfo.capacity)}
            </div>
          </div>
        );
      },
    },
    {
      id: "vehicle",
      header: "Vehicle",
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
      id: "birds",
      header: "Birds",
      accessorKey: "numberOfBirds",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="text-center">
            {(row.original.numberOfBirds || 0).toLocaleString()}
          </span>
        );
      },
    },
    {
      id: "netWeight",
      header: "Net Weight",
      accessorKey: "netWeight",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="text-center">
            {(row.original.netWeight || 0).toLocaleString()} kg
          </span>
        );
      },
    },
    {
      id: "rate",
      header: "Rate",
      accessorKey: "rate",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="text-center">
            {formatAmount(row.original.rate || 0)}
          </span>
        );
      },
    },
    {
      id: "totalAmount",
      header: "Total Amount",
      accessorKey: "totalAmount",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="text-center font-medium">
            {formatAmount(row.original.totalAmount || 0)}
          </span>
        );
      },
    },
    {
      id: "amountPaid",
      header: "Paid",
      accessorKey: "amountPaid",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="text-center">
            {formatAmount(row.original.amountPaid || 0)}
          </span>
        );
      },
    },
    {
      id: "balance",
      header: "Balance",
      accessorKey: "balance",
      visible: true,
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              "text-center",
              row.original.balance > 0 ? "text-destructive" : "text-chart-2"
            )}
          >
            {formatAmount(row.original.balance || 0)}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "totalAmount" as keyof ReportTransaction,
      visible: true,
      cell: ({ row }) => {
        return getPaymentStatusBadge(
          row.original.amountPaid || 0,
          row.original.totalAmount || 0
        );
      },
    },
  ];

  const rowActions: RowAction<ReportTransaction>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: ReportTransaction) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => {
            // TODO: Implement view details functionality
            console.log("View transaction details:", row._id);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
  ];

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

  return (
    <div>
      {/* Transactions Table */}
      {includeDetails && (
        <DataTable
          data={transactions}
          columns={columns}
          getRowId={(row) => row._id}
          rowActions={rowActions}
          emptyMessage="No transactions found"
          showColumnVisibilityToggle={true}
        />
      )}
    </div>
  );
};

export default ReportsTable;
