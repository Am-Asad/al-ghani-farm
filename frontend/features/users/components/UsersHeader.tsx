"use client";
import React from "react";
import CreateUserForm from "@/features/users/components/CreateUserForm";
import Searchbar from "@/features/shared/components/Searchbar";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { useDeleteBulkUsers } from "../hooks/useDeleteBulkUsers";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";

type UsersHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  totalUsers: number;
};

const UsersHeader = ({ search, setSearch, totalUsers }: UsersHeaderProps) => {
  const { mutate: deleteBulkUsers } = useDeleteBulkUsers();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage system users and their permissions
        </p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center space-x-2 justify-end">
        <Searchbar
          search={search}
          setSearch={setSearch}
          placeholder="Search users"
        />
        {totalUsers > 0 && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Users (${totalUsers})`}
              description={`Are you sure you want to delete all ${totalUsers} users?`}
              onConfirm={() => deleteBulkUsers()}
              trigger={
                <Button size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Users ({totalUsers})
                </Button>
              }
            />
          </RoleGuard>
        )}
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateUserForm />
        </RoleGuard>
      </div>
    </div>
  );
};

export default UsersHeader;
