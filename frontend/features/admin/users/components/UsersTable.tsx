"use client";
import React, { useState } from "react";
import DataTable, { RowAction } from "@/features/shared/components/DataTable";
import { User as UserType } from "@/types";
import { Column } from "@/features/shared/components/DataTable";
import { formatDate } from "@/utils/formatting";
import CreateEditUserForm from "./CreateEditUserForm";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { useDeleteUser } from "../hooks/useDeleteUser";
import { Edit, Eye, Mail, Trash2, User } from "lucide-react";
import { useDeleteBulkUsers } from "../hooks/useDeleteBulkUsers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UsersTableProps = {
  users: UserType[];
};

const UsersTable = ({ users }: UsersTableProps) => {
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: deleteBulkUsers } = useDeleteBulkUsers();

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive";
      case "manager":
        return "bg-chart-2/40 text-primary";
      case "viewer":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const columns: Column<UserType>[] = [
    {
      id: "username",
      header: "Username",
      accessorKey: "username",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="truncate flex items-center gap-2">
            <User className="w-4 h-4" /> {row.original.username}
          </span>
        );
      },
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      visible: true,
      cell: ({ row }) => {
        return (
          <span className="truncate flex items-center gap-2">
            <Mail className="w-4 h-4" /> {row.original.email}
          </span>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      visible: true,
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              "px-2 py-1 text-xs rounded-full",
              getRoleColor(row.original.role)
            )}
          >
            {row.original.role}
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

  const rowActions: RowAction<UserType>[] = [
    {
      label: "View Details",
      value: "view",
      component: (row: UserType) => (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => alert(`Viewing details for ${row.username}`)}
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      ),
    },
    {
      label: "Edit",
      value: "edit",
      component: (row: UserType) => (
        <CreateEditUserForm
          selectedUser={row}
          triggerButton={
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Edit className="mr-2 h-4 w-4" />
              Edit User
            </Button>
          }
        />
      ),
    },
    {
      label: "Delete",
      value: "delete",
      variant: "destructive",
      component: (row: UserType) => (
        <ConfirmationDialog
          title="Delete User"
          description="Are you sure you want to delete this user?"
          confirmationText={row.username}
          onConfirm={() => deleteUser(row._id)}
          trigger={
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive/80"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          }
        />
      ),
    },
  ];

  const handleSelectionChange = (selected: UserType[]) => {
    setSelectedUsers(selected);
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      getRowId={(row) => row._id}
      selectionMode="multiple"
      onSelectionChange={handleSelectionChange}
      rowActions={rowActions}
      emptyMessage="No users found"
      showColumnVisibilityToggle={true}
      selectedRows={selectedUsers}
      deleteBulkRecords={
        <ConfirmationDialog
          title={`Delete Bulk Users (${selectedUsers.length})`}
          description="Are you sure you want to delete the selected users?"
          onConfirm={() => {
            const userIds = selectedUsers.map((user) => user._id);
            setSelectedUsers([]);
            deleteBulkUsers(userIds);
          }}
          confirmationText="Delete_Bulk_Users"
        />
      }
    />
  );
};

export default UsersTable;
