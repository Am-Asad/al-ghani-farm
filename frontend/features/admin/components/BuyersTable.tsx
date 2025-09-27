"use client";
import React, { useState } from "react";
import DataTable from "@/features/shared/components/DataTable";
import { Buyer as BuyerType } from "@/types";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate } from "@/utils/format-date";
import CreateEditBuyerForm from "../buyers/components/CreateEditBuyerForm";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { useDeleteBuyer } from "../buyers/hooks/useDeleteBuyer";
import { Phone } from "lucide-react";

type BuyersTableProps = {
  buyers: BuyerType[];
};

const BuyersTable = ({ buyers }: BuyersTableProps) => {
  const [selectedBuyers, setSelectedBuyers] = useState<BuyerType[]>([]);
  const { mutate: deleteBuyer } = useDeleteBuyer();

  const columns: Column<BuyerType>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      visible: true,
    },
    {
      id: "contactNumber",
      header: "Contact Number",
      accessorKey: "contactNumber",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="truncate flex items-center gap-2">
            <Phone className="w-4 h-4" /> {row.original.contactNumber || "N/A"}
          </span>
        );
      },
    },
    {
      id: "address",
      header: "Address",
      accessorKey: "address",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="truncate">{row.original.address || "N/A"}</span>
        );
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
        return formatDate(row.original.updatedAt);
      },
    },
  ];

  const rowActions = [
    { label: "View Details", value: "view" },
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete", variant: "destructive" as const },
  ];

  const handleSelectionChange = (selected: BuyerType[]) => {
    setSelectedBuyers(selected);
  };

  const handleRowAction = (action: string, row: BuyerType) => {
    switch (action) {
      case "view":
        alert(`Viewing details for ${row.name}`);
        break;
      case "edit":
        <CreateEditBuyerForm selectedBuyer={row} />;
        break;
      case "delete":
        <ConfirmationDialog
          title="Delete Buyer"
          description="Are you sure you want to delete this buyer?"
          confirmationText={row.name}
          onConfirm={() => deleteBuyer(row._id)}
        />;
        break;
    }
  };

  return (
    <DataTable
      data={buyers}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      onRowAction={handleRowAction}
      rowActions={rowActions}
      emptyMessage="No buyers found"
      showColumnVisibilityToggle={true}
    />
  );
};

export default BuyersTable;
