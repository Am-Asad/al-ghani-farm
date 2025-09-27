"use client";
import React from "react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditFlockForm from "./CreateEditFlockForm";

type FlockHeaderProps = {
  showActions?: boolean;
};

const FlockHeader = ({ showActions = true }: FlockHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Flocks</h1>
        <p className="text-muted-foreground">
          Manage system flocks and their operations
        </p>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {/* {totalFlocks > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Flocks (${totalFlocks})`}
              description={`Are you sure you want to delete all ${totalFlocks} flocks?`}
              confirmationText="Delete_All_Flocks"
              onConfirm={() => deleteBulkFlocks([])}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Flocks ({totalFlocks})
                </Button>
              }
            />
          </RoleGuard>
        )} */}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditFlockForm />
            {/* <CreateBulkFlocks /> */}
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default FlockHeader;
