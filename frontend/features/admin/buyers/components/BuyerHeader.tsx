import RoleGuard from "@/features/shared/components/RoleGuard";
import Searchbar from "@/features/shared/components/Searchbar";
import React from "react";
import CreateEditBuyerForm from "./CreateEditBuyerForm";
import CreateBulkBuyers from "./CreateBulkBuyers";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteBulkBuyers } from "../hooks/useDeleteBulkBuyers";

type BuyersHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  totalBuyers: number;
  showActions?: boolean;
};

const BuyersHeader = ({
  search,
  setSearch,
  totalBuyers,
  showActions = true,
}: BuyersHeaderProps) => {
  const { mutate: deleteBulkBuyers } = useDeleteBulkBuyers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Buyers</h1>
          <p className="text-muted-foreground">
            Manage system buyers and their operations
          </p>
        </div>
        <Searchbar
          search={search}
          setSearch={setSearch}
          placeholder="Search buyers"
        />
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {totalBuyers > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Buyers (${totalBuyers})`}
              description={`Are you sure you want to delete all ${totalBuyers} buyers?`}
              confirmationText={"Delete_All_Buyers"}
              onConfirm={() => deleteBulkBuyers()}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Buyers ({totalBuyers})
                </Button>
              }
            />
          </RoleGuard>
        )}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditBuyerForm />
            <CreateBulkBuyers />
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default BuyersHeader;
