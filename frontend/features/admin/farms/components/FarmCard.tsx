"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Expand } from "lucide-react";
import { Farm } from "@/types";
import { formatDate } from "@/utils/format-date";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import CreateEditFarmForm from "./CreateEditFarmForm";
import { useDeleteFarm } from "../hooks/useDeleteFarm";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { useRouter } from "next/navigation";
import { formatSingleDigit } from "@/utils/format-single-digit";
import { Button } from "@/components/ui/button";

type FarmCardProps = {
  farm: Farm;
  showActions?: boolean;
};

const FarmCard = ({ farm, showActions = true }: FarmCardProps) => {
  const { mutate: deleteFarm } = useDeleteFarm();
  const router = useRouter();
  return (
    <Card className="hover:shadow-md transition-shadow h-fit cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{farm.name}</CardTitle>
          </div>
          {!showActions && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/farms/${farm._id}`)}
            >
              <Expand className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Flocks</p>
            <p className="font-medium">
              {formatSingleDigit(farm?.flocksCount || 0)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Supervisor</p>
            <p className="font-medium">{farm?.supervisor}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created At</p>
          <p className="text-sm font-medium">{formatDate(farm?.createdAt)}</p>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <RoleGuard requiredRole={["admin", "manager"]}>
              <CreateEditFarmForm selectedFarm={farm} />
            </RoleGuard>
            <RoleGuard requiredRole={["admin"]}>
              <ConfirmationDialog
                title="Delete Farm"
                description="Are you sure you want to delete this farm?"
                confirmationText={farm?.name}
                onConfirm={() => deleteFarm(farm._id)}
              />
            </RoleGuard>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarmCard;
