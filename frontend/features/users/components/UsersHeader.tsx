"use client";
import React from "react";
import Searchbar from "@/features/shared/components/Searchbar";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { useDeleteBulkUsers } from "../hooks/useDeleteBulkUsers";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditUserForm from "./CreateEditUserForm";
import CreateBulkUsers from "./CreateBulkUsers";

type UsersHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  totalUsers: number;
};

const UsersHeader = ({ search, setSearch, totalUsers }: UsersHeaderProps) => {
  const { mutate: deleteBulkUsers } = useDeleteBulkUsers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Searchbar
          search={search}
          setSearch={setSearch}
          placeholder="Search users"
        />
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {totalUsers > 0 && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Users (${totalUsers})`}
              description={`Are you sure you want to delete all ${totalUsers} users?`}
              onConfirm={() => deleteBulkUsers()}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Users ({totalUsers})
                </Button>
              }
            />
          </RoleGuard>
        )}
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditUserForm />
          <CreateBulkUsers />
        </RoleGuard>
      </div>
    </div>
  );
};

export default UsersHeader;
