"use client";
import { Shed } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Users } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { formatDate, formatSingleDigit } from "@/utils/formatting";
import { formatAmount } from "@/utils/formatting";
import { useDeleteShed } from "../hooks/useDeleteShed";
import CreateEditShedForm from "./CreateEditShedForm";
import ShowOptionsDropdown from "@/features/shared/components/ShowOptionsDropdown";

type ShedCardProps = {
  shed: Shed;
  showActions?: boolean;
};

const ShedCard = ({ shed, showActions = true }: ShedCardProps) => {
  const { mutate: deleteShed } = useDeleteShed();
  return (
    <Card className="hover:shadow-md transition-shadow h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{shed.name}</CardTitle>
          </div>
          {!showActions && (
            <ShowOptionsDropdown
              options={[
                { label: "See Shed Details", href: `/sheds/${shed._id}` },
                { label: "See Ledgers", href: `/ledgers?shedId=${shed._id}` },
              ]}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Capacity</p>
            <p className="font-medium">
              {shed?.capacity
                ? formatSingleDigit(formatAmount(shed.capacity))
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Farm</p>
            <p className="font-medium">
              {shed?.farmId?.name ? shed.farmId.name : "N/A"}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created At</p>
          <p className="text-sm font-medium">{formatDate(shed.createdAt)}</p>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <RoleGuard requiredRole={["admin", "manager"]}>
              <CreateEditShedForm selectedShed={shed} />
            </RoleGuard>
            <RoleGuard requiredRole={["admin"]}>
              <ConfirmationDialog
                title="Delete Shed"
                description="Are you sure you want to delete this shed?"
                confirmationText={shed.name}
                onConfirm={() => {
                  deleteShed(shed._id);
                }}
              />
            </RoleGuard>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShedCard;
