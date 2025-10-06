"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import { ReportTransaction } from "../hooks/useGetReports";
import {
  formatAmount,
  formatCurrency,
  formatDateCompact,
  formatSingleDigit,
} from "@/utils/formatting";
import { cn } from "@/lib/utils";

type ReportsTableProps = {
  transactions: ReportTransaction[];
  isLoading?: boolean;
};

const ReportsTable = ({ transactions, isLoading }: ReportsTableProps) => {
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

      <DataTable
        data={transactions}
        columns={columns}
        getRowId={(row) => row._id}
        selectionMode="none"
        emptyMessage="No transactions found"
        showColumnVisibilityToggle={true}
      />
    </div>
  );
};

export default ReportsTable;
