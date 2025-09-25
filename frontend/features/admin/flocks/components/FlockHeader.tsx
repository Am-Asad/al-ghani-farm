"use client";
import React from "react";
import Searchbar from "@/features/shared/components/Searchbar";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditFlockForm from "./CreateEditFlockForm";
import CreateBulkFlocks from "./CreateBulkFlocks";
import { useParams } from "next/navigation";
import { useDeleteBulkFlocks } from "../hooks/useDeleteBulkFlocks";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useGetAllFarms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FlockHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
  selectedFarm: string;
  setSelectedFarm: (farmId: string) => void;
  totalFlocks: number;
  showActions?: boolean;
};

const FlockHeader = ({
  search,
  setSearch,
  selectedFarm,
  setSelectedFarm,
  totalFlocks,
  showActions = true,
}: FlockHeaderProps) => {
  const { farmId } = useParams() as { farmId: string };
  const { mutate: deleteBulkFlocks } = useDeleteBulkFlocks();
  const { data: farmsData } = useGetAllFarms();
  const farms = farmsData?.data || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Flocks</h1>
          <p className="text-muted-foreground">
            Manage system flocks and their operations
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={selectedFarm}
            onValueChange={(value) =>
              setSelectedFarm(value === "All Farms" ? "" : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by farm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Farms">All Farms</SelectItem>
              {farms.map((farm) => (
                <SelectItem key={farm._id} value={farm._id}>
                  {farm.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Searchbar
            search={search}
            setSearch={setSearch}
            placeholder="Search flocks"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        {totalFlocks > 0 && showActions && (
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title={`Delete All Flocks (${totalFlocks})`}
              description={`Are you sure you want to delete all ${totalFlocks} flocks?`}
              confirmationText="Delete_All_Flocks"
              onConfirm={() => deleteBulkFlocks({ farmId })}
              trigger={
                <Button className="w-fit">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete All Flocks ({totalFlocks})
                </Button>
              }
            />
          </RoleGuard>
        )}

        {showActions && (
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditFlockForm />
            <CreateBulkFlocks />
          </RoleGuard>
        )}
      </div>
    </div>
  );
};

export default FlockHeader;
