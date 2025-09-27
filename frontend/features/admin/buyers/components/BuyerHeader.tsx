import RoleGuard from "@/features/shared/components/RoleGuard";
import React from "react";
import CreateEditBuyerForm from "./CreateEditBuyerForm";

type BuyersHeaderProps = {
  showActions?: boolean;
};

const BuyersHeader = ({ showActions = true }: BuyersHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Buyers</h1>
        <p className="text-muted-foreground">
          Manage system buyers and their operations
        </p>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {/* {totalBuyers > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Buyers (${totalBuyers})`}
              description={`Are you sure you want to delete all ${totalBuyers} buyers?`}
              confirmationText={"Delete_All_Buyers"}
              onConfirm={() => deleteBulkBuyers([])}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Buyers ({totalBuyers})
                </Button>
              }
            />
          </RoleGuard>
        )} */}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditBuyerForm />
            {/* <CreateBulkBuyers /> */}
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default BuyersHeader;
