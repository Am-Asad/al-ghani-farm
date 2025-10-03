"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Ledger as LedgerType } from "@/types";
import { useDeleteLedger } from "../hooks/useDeleteLedger";
import { useDeleteBulkLedgers } from "../hooks/useDeleteBulkLedgers";
import CreateEditLedgerForm from "./CreateEditLedgerForm";
import {
  formatAmount,
  formatCurrency,
  formatDateCompact,
} from "@/utils/formatting";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RoleGuard from "@/features/shared/components/RoleGuard";

type LedgersTableProps = {
  ledgers: LedgerType[];
};

const LedgersTable = ({ ledgers }: LedgersTableProps) => {
  const [selectedLedgers, setSelectedLedgers] = useState<LedgerType[]>([]);
  const { mutate: deleteLedger } = useDeleteLedger();
  const { mutate: deleteBulkLedgers } = useDeleteBulkLedgers();

  const columns: Column<LedgerType>[] = [
    {
      id: "farmName",
      header: "Farm Name",
      accessorKey: "farmId",
      visible: true,
      width: "180px",
      cell: ({ row }) => {
        return row.original.farmId?.name || "N/A";
      },
    },
    {
      id: "shedName",
      header: "Shed Name",
      accessorKey: "shedId",
      visible: true,
      width: "180px",
      cell: ({ row }) => {
        return row.original.shedId?.name || "N/A";
      },
    },
    {
      id: "flockName",
      header: "Flock Name",
      accessorKey: "flockId",
      visible: true,
      width: "180px",
      cell: ({ row }) => {
        return row.original.flockId?.name || "N/A";
      },
    },
    {
      id: "buyerName",
      header: "Buyer Name",
      accessorKey: "buyerId",
      visible: true,
      width: "180px",
      cell: ({ row }) => {
        return row.original.buyerId?.name || "N/A";
      },
    },
    {
      id: "vehicleNumber",
      header: "Vehicle Number",
      accessorKey: "vehicleNumber",
      visible: true,
      width: "150px",
    },
    {
      id: "driverName",
      header: "Driver Name",
      accessorKey: "driverName",
      visible: true,
      width: "150px",
    },
    {
      id: "driverContact",
      header: "Driver Contact",
      accessorKey: "driverContact",
      visible: true,
      width: "150px",
    },
    {
      id: "accountantName",
      header: "Accountant Name",
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
      width: "150px",
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
      header: "Amount Paid",
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
    {
      id: "date",
      header: "Date",
      accessorKey: "date",
      visible: true,
      width: "120px",
      cell: ({ row }) => {
        return formatDateCompact(row.original.date);
      },
    },
  ];

  const rowActions: RowAction<LedgerType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: LedgerType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() =>
            alert(`Viewing details for ${Object.values(row).join(", ")}`)
          }
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: LedgerType) => (
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditLedgerForm
            selectedLedger={row}
            triggerButton={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Ledger
              </Button>
            }
          />
        </RoleGuard>
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive" as const,
      component: (row: LedgerType) => (
        <RoleGuard requiredRole={["admin"]}>
          <ConfirmationDialog
            title="Delete Ledger"
            description="Are you sure you want to delete this ledger?"
            confirmationText={row._id}
            onConfirm={() => deleteLedger(row._id)}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive/80"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Ledger
              </Button>
            }
          />
        </RoleGuard>
      ),
    },
  ];

  const handleSelectionChange = (selected: LedgerType[]) => {
    setSelectedLedgers(selected);
  };

  return (
    <DataTable
      data={ledgers}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      rowActions={rowActions}
      emptyMessage="No ledgers found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedLedgers}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Ledgers (${selectedLedgers.length})`}
          description="Are you sure you want to delete the selected ledgers?"
          onConfirm={() => {
            setSelectedLedgers([]);
            deleteBulkLedgers(selectedLedgers.map((ledger) => ledger._id));
          }}
          confirmationText="Delete_Bulk_Ledgers"
        />
      }
    />
  );
};

export default LedgersTable;
