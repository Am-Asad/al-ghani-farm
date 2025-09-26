import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { Trash } from "lucide-react";
import React from "react";
import CreateEditLedgerForm from "./CreateEditLedgerForm";
import { useDeleteBulkLedgers } from "../hooks/useDeleteBulkLedgers";
import { useParams } from "next/navigation";

type LedgerHeaderProps = {
  totalLedgers: number;
  showActions?: boolean;
};

const LedgerHeader = ({
  totalLedgers,
  showActions = true,
}: LedgerHeaderProps) => {
  const { farmId } = useParams() as { farmId: string };
  const { mutate: deleteBulkLedgers } = useDeleteBulkLedgers();

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Ledgers</h1>
        <p className="text-muted-foreground">
          Manage system ledgers and their operations
        </p>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {totalLedgers > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Ledgers (${totalLedgers})`}
              description={`Are you sure you want to delete all ${totalLedgers} ledgers?`}
              confirmationText="Delete_All_Ledgers"
              onConfirm={() => deleteBulkLedgers({ farmId })}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Ledgers ({totalLedgers})
                </Button>
              }
            />
          </RoleGuard>
        )}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditLedgerForm />
            {/* <CreateBulkLedgers /> */}
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default LedgerHeader;
