"use client";
import { Shed } from "@/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Users } from "lucide-react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import { formatDate } from "@/utils/format-date";
import { formatSingleDigit } from "@/utils/format-single-digit";
import { formatAmount } from "@/utils/format-amount";
import { useDeleteShed } from "../hooks/useDeleteShed";
import CreateEditShedForm from "./CreateEditShedForm";

type ShedCardProps = {
  shed: Shed;
};

const ShedCard = ({ shed }: ShedCardProps) => {
  const router = useRouter();
  const { mutate: deleteShed } = useDeleteShed(shed.flockId);
  return (
    <Card
      className="hover:shadow-md transition-shadow h-fit cursor-pointer"
      onClick={() => router.push(`/sheds/${shed._id}`)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{shed.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Chicks</p>
            <p className="font-medium">
              {formatSingleDigit(formatAmount(shed?.totalChicks))}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created At</p>
          <p className="text-sm font-medium">{formatDate(shed.createdAt)}</p>
        </div>

        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditShedForm selectedShed={shed} />
          </RoleGuard>
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title="Delete Shed"
              description="Are you sure you want to delete this shed?"
              confirmationText={shed.name}
              onConfirm={() => {
                deleteShed({ shedId: shed._id });
              }}
            />
          </RoleGuard>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShedCard;
