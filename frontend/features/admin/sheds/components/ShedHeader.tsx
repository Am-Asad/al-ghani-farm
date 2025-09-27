import RoleGuard from "@/features/shared/components/RoleGuard";
import React from "react";
import CreateEditShedForm from "./CreateEditShedForm";

type ShedHeaderProps = {
  showActions?: boolean;
};

const ShedHeader = ({ showActions = true }: ShedHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sheds</h1>
          <p className="text-muted-foreground">
            Manage system sheds and their operations
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {/* {totalSheds > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Sheds (${totalSheds})`}
              description={`Are you sure you want to delete all ${totalSheds} sheds?`}
              confirmationText="Delete_All_Sheds"
              onConfirm={() => deleteBulkSheds([])}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Sheds ({totalSheds})
                </Button>
              }
            />
          </RoleGuard>
        )} */}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditShedForm />
            {/* <CreateBulkSheds /> */}
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default ShedHeader;
