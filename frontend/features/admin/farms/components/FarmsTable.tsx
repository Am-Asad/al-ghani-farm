"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Farm as FarmType } from "@/types";
import { Column } from "@/features/shared/components/DataTable";
import { formatDateCompact, formatSingleDigit } from "@/utils/formatting";
import CreateEditFarmForm from "./CreateEditFarmForm";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useDeleteFarm } from "../hooks/useDeleteFarm";
import { useDeleteBulkFarms } from "../hooks/useDeleteBulkFarms";
import { useRouter } from "next/navigation";

type FarmsTableProps = {
  farms: FarmType[];
};

const FarmsTable = ({ farms }: FarmsTableProps) => {
  const router = useRouter();
  const [selectedFarms, setSelectedFarms] = useState<FarmType[]>([]);
  const { mutate: deleteFarm } = useDeleteFarm();
  const { mutate: deleteBulkFarms } = useDeleteBulkFarms();

  const columns: Column<FarmType>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      visible: true,
    },
    {
      id: "supervisor",
      header: "Supervisor",
      accessorKey: "supervisor",
      visible: true,
    },
    {
      id: "totalSheds",
      header: "Total Sheds",
      accessorKey: "totalSheds",
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.totalSheds);
      },
    },
    {
      id: "totalFlocks",
      header: "Total Flocks",
      accessorKey: "totalFlocks",
      visible: true,
      cell: ({ row }) => {
        return formatSingleDigit(row.original.totalFlocks);
      },
    },
    {
      id: "createdAt",
      header: "Created At",
      accessorKey: "createdAt",
      visible: true,
      cell: ({ row }) => {
        return formatDateCompact(row.original.createdAt);
      },
    },
  ];

  // Enhanced row actions with custom components
  const rowActions: RowAction<FarmType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: FarmType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => router.push(`/farms/${row._id}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: FarmType) => (
        <CreateEditFarmForm
          selectedFarm={row}
          triggerButton={
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Farm
            </Button>
          }
        />
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive",
      component: (row: FarmType) => (
        <ConfirmationDialog
          title="Delete Farm"
          description="Are you sure you want to delete this farm?"
          confirmationText={row.name}
          onConfirm={() => deleteFarm(row._id)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive/80"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Farm
            </Button>
          }
        />
      ),
    },
  ];

  const handleSelectionChange = (selected: FarmType[]) => {
    setSelectedFarms(selected);
  };

  return (
    <DataTable
      data={farms}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      rowActions={rowActions}
      emptyMessage="No farms found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedFarms}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Farms (${selectedFarms.length})`}
          description="Are you sure you want to delete the selected farms?"
          onConfirm={() => {
            setSelectedFarms([]);
            deleteBulkFarms(selectedFarms.map((farm) => farm._id));
          }}
          confirmationText="Delete_Bulk_Farms"
        />
      }
    />
  );
};

export default FarmsTable;
