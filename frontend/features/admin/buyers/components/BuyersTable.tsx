"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { Buyer as BuyerType } from "@/types";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate } from "@/utils/format-date";
import CreateEditBuyerForm from "./CreateEditBuyerForm";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { useDeleteBuyer } from "../hooks/useDeleteBuyer";
import { Edit, Eye, Phone, Trash2 } from "lucide-react";
import { useDeleteBulkBuyers } from "../hooks/useDeleteBulkBuyers";
import { Button } from "@/components/ui/button";

type BuyersTableProps = {
  buyers: BuyerType[];
};

const BuyersTable = ({ buyers }: BuyersTableProps) => {
  const [selectedBuyers, setSelectedBuyers] = useState<BuyerType[]>([]);
  const { mutate: deleteBuyer } = useDeleteBuyer();
  const { mutate: deleteBulkBuyers } = useDeleteBulkBuyers();

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
          <span className="truncate">
            {row.original.address ? row.original.address : "N/A"}
          </span>
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
  ];

  const rowActions: RowAction<BuyerType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: BuyerType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => alert(`Viewing details for ${row.name}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: BuyerType) => (
        <CreateEditBuyerForm
          selectedBuyer={row}
          triggerButton={
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit Buyer
            </Button>
          }
        />
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive",
      component: (row: BuyerType) => (
        <ConfirmationDialog
          title="Delete Buyer"
          description="Are you sure you want to delete this buyer?"
          confirmationText={row.name}
          onConfirm={() => deleteBuyer(row._id)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-800"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Buyer
            </Button>
          }
        />
      ),
    },
  ];

  const handleSelectionChange = (selected: BuyerType[]) => {
    setSelectedBuyers(selected);
  };

  return (
    <DataTable
      data={buyers}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      rowActions={rowActions}
      emptyMessage="No buyers found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedBuyers}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Buyers (${selectedBuyers.length})`}
          description="Are you sure you want to delete the selected buyers?"
          onConfirm={() => {
            setSelectedBuyers([]);
            deleteBulkBuyers(selectedBuyers.map((buyer) => buyer._id));
          }}
          confirmationText="Delete_Bulk_Buyers"
        />
      }
    />
  );
};

export default BuyersTable;
