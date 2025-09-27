"use client";
import React from "react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditUserForm from "./CreateEditUserForm";

type UsersHeaderProps = {
  showActions?: boolean;
};

const UsersHeader = ({ showActions = true }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage system users and their permissions
        </p>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {/* {totalUsers > 0 && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Users (${totalUsers})`}
              description={`Are you sure you want to delete all ${totalUsers} users?`}
              confirmationText={`Delete All Users (${totalUsers})`}
              onConfirm={() => deleteAllUsers([])}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Users ({totalUsers})
                </Button>
              }
            />
          </RoleGuard>
        )} */}
        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditUserForm />
            {/* <CreateBulkUsers /> */}
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default UsersHeader;
