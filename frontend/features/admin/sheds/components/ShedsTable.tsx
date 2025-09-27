"use client";
import React, { useState } from "react";
import DataTable from "@/features/shared/components/DataTable";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate } from "@/utils/format-date";
import { formatSingleDigit } from "@/utils/format-single-digit";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Shed as ShedType } from "@/types";
import { useDeleteShed } from "../hooks/useDeleteShed";
import CreateEditShedForm from "./CreateEditShedForm";

type ShedsTableProps = {
  sheds: ShedType[];
};

const ShedsTable = ({ sheds }: ShedsTableProps) => {
  const [selectedSheds, setSelectedSheds] = useState<ShedType[]>([]);
  const { mutate: deleteShed } = useDeleteShed();

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
    {
      id: "updatedAt",
      header: "Updated At",
      accessorKey: "updatedAt",
      visible: true,
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
  ];

  const rowActions = [
    { label: "View Details", value: "view" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete", variant: "destructive" as const },
  ];

  const handleSelectionChange = (selected: ShedType[]) => {
    setSelectedSheds(selected);
    console.log("Selected rows:", selected);
  };

  const handleRowAction = (action: string, row: ShedType) => {
    console.log(`Action: ${action}`, row);

    switch (action) {
      case "view":
        alert(`Viewing details for ${row.name}`);
        break;
      case "edit":
        <CreateEditShedForm selectedShed={row} />;
        break;
      case "delete":
        <ConfirmationDialog
          title="Delete Shed"
          description="Are you sure you want to delete this shed?"
          confirmationText={row.name}
          onConfirm={() => deleteShed(row._id)}
        />;
        break;
    }
  };

  return (
    <DataTable
      data={sheds}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      onRowAction={handleRowAction}
      rowActions={rowActions}
      emptyMessage="No sheds found"
      showColumnVisibilityToggle={true}
    />
  );
};

export default ShedsTable;
