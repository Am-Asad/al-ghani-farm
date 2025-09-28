"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate, formatSingleDigit } from "@/utils/formatting";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Flock as FlockType } from "@/types";
import { useDeleteFlock } from "../hooks/useDeleteFlock";
import { useDeleteBulkFlocks } from "../hooks/useDeleteBulkFlocks";
import CreateEditFlockForm from "./CreateEditFlockForm";
import { useRouter } from "next/navigation";

type FlocksTableProps = {
  flocks: FlockType[];
};

const FlocksTable = ({ flocks }: FlocksTableProps) => {
  const [selectedFlocks, setSelectedFlocks] = useState<FlockType[]>([]);
  const { mutate: deleteFlock } = useDeleteFlock();
  const { mutate: deleteBulkFlocks } = useDeleteBulkFlocks();
  const router = useRouter();

  const columns: Column<FlockType>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      visible: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      visible: true,
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.status === "active" ? "default" : "secondary"}
          >
            {row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "startDate",
      header: "Start Date",
      accessorKey: "startDate",
      visible: true,
      cell: ({ row }) => {
        return formatDate(row.original.startDate);
      },
    },
    {
      id: "endDate",
      header: "End Date",
      accessorKey: "endDate",
      visible: true,
      cell: ({ row }) => {
        return row.original?.endDate ? formatDate(row.original.endDate) : "N/A";
      },
    },
    {
      id: "totalChicks",
      header: "Total Chicks",
      accessorKey: "totalChicks",
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.totalChicks);
      },
    },
    {
      id: "farmName",
      header: "Farm Name",
      accessorKey: "farmId.name" as keyof FlockType,
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.farmId.name);
      },
    },
    {
      id: "farmSupervisor",
      header: "Farm Supervisor",
      accessorKey: "farmId.supervisor" as keyof FlockType,
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.farmId.supervisor);
      },
    },
  ];

  const rowActions: RowAction<FlockType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: FlockType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => router.push(`/flocks/${row._id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: FlockType) => (
        <CreateEditFlockForm
          selectedFlock={row}
          triggerButton={
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Flock
            </Button>
          }
        />
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive" as const,
      component: (row: FlockType) => (
        <ConfirmationDialog
          title="Delete Flock"
          description="Are you sure you want to delete this flock?"
          confirmationText={row.name}
          onConfirm={() => deleteFlock(row._id)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-800"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Flock
            </Button>
          }
        />
      ),
    },
  ];

  const handleSelectionChange = (selected: FlockType[]) => {
    setSelectedFlocks(selected);
  };

  return (
    <DataTable
      data={flocks}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      rowActions={rowActions}
      emptyMessage="No flocks found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedFlocks}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Flocks (${selectedFlocks.length})`}
          description="Are you sure you want to delete the selected flocks?"
          onConfirm={() => {
            setSelectedFlocks([]);
            deleteBulkFlocks(selectedFlocks.map((flock) => flock._id));
          }}
          confirmationText="Delete_Bulk_Flocks"
        />
      }
    />
  );
};

export default FlocksTable;
