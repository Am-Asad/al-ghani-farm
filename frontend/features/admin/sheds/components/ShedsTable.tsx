"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate, formatSingleDigit } from "@/utils/formatting";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Shed as ShedType } from "@/types";
import { useDeleteShed } from "../hooks/useDeleteShed";
import CreateEditShedForm from "./CreateEditShedForm";
import { useDeleteBulkSheds } from "../hooks/useDeleteBulkSheds";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import RoleGuard from "@/features/shared/components/RoleGuard";

type ShedsTableProps = {
  sheds: ShedType[];
};

const ShedsTable = ({ sheds }: ShedsTableProps) => {
  const [selectedSheds, setSelectedSheds] = useState<ShedType[]>([]);
  const { mutate: deleteShed } = useDeleteShed();
  const { mutate: deleteBulkSheds } = useDeleteBulkSheds();
  const router = useRouter();

  const columns: Column<ShedType>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      visible: true,
    },
    {
      id: "capacity",
      header: "Capacity",
      accessorKey: "capacity",
      visible: true,
    },
    {
      id: "farmName",
      header: "Farm Name",
      accessorKey: "farmId.name" as keyof ShedType,
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.farmId.name);
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt",
      visible: true,
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
  ];

  const rowActions: RowAction<ShedType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: ShedType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => router.push(`/sheds/${row._id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: ShedType) => (
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditShedForm
            selectedShed={row}
            triggerButton={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Shed
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
      component: (row: ShedType) => (
        <RoleGuard requiredRole={["admin"]}>
          <ConfirmationDialog
            title="Delete Shed"
            description="Are you sure you want to delete this shed?"
            confirmationText={row.name}
            onConfirm={() => deleteShed(row._id)}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive/80"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Shed
              </Button>
            }
          />
        </RoleGuard>
      ),
    },
  ];

  const handleSelectionChange = (selected: ShedType[]) => {
    setSelectedSheds(selected);
  };

  const handleRowClick = (shed: ShedType) => {
    router.push(`/sheds/${shed._id}`);
  };

  return (
    <DataTable
      data={sheds}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      onRowClick={handleRowClick}
      rowActions={rowActions}
      emptyMessage="No sheds found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedSheds}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Sheds (${selectedSheds.length})`}
          description="Are you sure you want to delete the selected sheds?"
          onConfirm={() => {
            setSelectedSheds([]);
            deleteBulkSheds(selectedSheds.map((shed) => shed._id));
          }}
          confirmationText="Delete_Bulk_Sheds"
        />
      }
    />
  );
};

export default ShedsTable;
