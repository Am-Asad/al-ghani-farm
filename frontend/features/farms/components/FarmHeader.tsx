"use client";
import React, { useState } from "react";
import CreateSingleBulkFormDialog from "@/features/shared/components/CreateSingleBulkFormDialog";
import { useDeleteBulkFarms } from "@/features/farms/hooks/useDeleteBulkFarms";
import Searchbar from "@/features/shared/components/Searchbar";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import CreateFarmForm from "./CreateFarmForm";
import CreateFarmBulk from "./CreateFarmBulk";
import RoleGuard from "@/features/shared/components/RoleGuard";

type FarmHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  totalFarms: number;
};

const FarmHeader = ({ search, setSearch, totalFarms }: FarmHeaderProps) => {
  const { mutate: deleteBulkFarms } = useDeleteBulkFarms();
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex gap-4 items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Farms</h1>
        <p className="text-muted-foreground">
          Manage system farms and their operations
        </p>
      </div>
      <div className="flex-1 flex flex-col sm:flex-row items-center space-x-2 justify-end">
        <Searchbar
          search={search}
          setSearch={setSearch}
          placeholder="Search farms"
        />
        {totalFarms > 0 && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Farms (${totalFarms})`}
              description={`Are you sure you want to delete all ${totalFarms} farms?`}
              onConfirm={() => deleteBulkFarms()}
              trigger={
                <Button size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Farms ({totalFarms})
                </Button>
              }
            />
          </RoleGuard>
        )}

        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateSingleBulkFormDialog
            trigger={
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Farm
              </Button>
            }
            entityType="farm"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            SingleEntityForm={<CreateFarmForm onSuccess={handleSuccess} />}
            BulkEntityForm={<CreateFarmBulk onSuccess={handleSuccess} />}
          />
        </RoleGuard>
      </div>
    </div>
  );
};

export default FarmHeader;
