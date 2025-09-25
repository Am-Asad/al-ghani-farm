"use client";
import React from "react";
import { useDeleteBulkFarms } from "@/features/admin/farms/hooks/useDeleteBulkFarms";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateBulkFarms from "./CreateBulkFarms";
import CreateEditFarmForm from "./CreateEditFarmForm";

type FarmHeaderProps = {
  totalFarms: number;
  showActions?: boolean;
};

const FarmHeader = ({ totalFarms, showActions = true }: FarmHeaderProps) => {
  const { mutate: deleteBulkFarms } = useDeleteBulkFarms();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Farms</h1>
        <p className="text-muted-foreground">
          Manage system farms and their operations
        </p>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {totalFarms > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Farms (${totalFarms})`}
              description={`Are you sure you want to delete all ${totalFarms} farms?`}
              confirmationText={"Delete_All_Farms"}
              onConfirm={() => deleteBulkFarms()}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Farms ({totalFarms})
                </Button>
              }
            />
          </RoleGuard>
        )}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditFarmForm />
            <CreateBulkFarms />
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default FarmHeader;
