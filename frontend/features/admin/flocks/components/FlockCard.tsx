"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Flock } from "@/types";
import { formatDate } from "@/utils/format-date";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditFlockForm from "./CreateEditFlockForm";
import { useDeleteFlock } from "../hooks/useDeleteFlock";
import { formatSingleDigit } from "@/utils/format-single-digit";
import ShowOptionsDropdown from "@/features/shared/components/ShowOptionsDropdown";

type FlockCardProps = {
  flock: Flock;
  showActions?: boolean;
};

const FlockCard = ({ flock, showActions = true }: FlockCardProps) => {
  const { mutate: deleteFlock } = useDeleteFlock();

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "inactive":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{flock.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(flock.status)}>
              {flock.status}
            </Badge>

            {!showActions && (
              <ShowOptionsDropdown
                options={[
                  {
                    label: "See Flock Details",
                    href: `/flocks/${flock._id}`,
                  },
                  {
                    label: "See Ledgers",
                    href: `/ledgers?flockId=${flock._id}`,
                  },
                ]}
              />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">{formatDate(flock.startDate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">End Date</p>
            <p className="font-medium">
              {flock?.endDate ? formatDate(flock.endDate) : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t">
          <div className="">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Allocations</p>
            </div>
            <p className="text-lg font-semibold text-primary">
              {formatSingleDigit(
                flock.allocations?.length?.toLocaleString() || 0
              )}
            </p>
          </div>
          <div className="">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">Total Chicks</p>
            </div>
            <p className="text-lg font-semibold text-primary">
              {formatSingleDigit(flock.totalChicks?.toLocaleString() || 0)}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created At</p>
          <p className="text-sm font-medium">{formatDate(flock.createdAt)}</p>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <RoleGuard requiredRole={["admin", "manager"]}>
              <CreateEditFlockForm selectedFlock={flock} />
            </RoleGuard>
            <RoleGuard requiredRole={["admin"]}>
              <ConfirmationDialog
                title="Delete Flock"
                description="Are you sure you want to delete this flock?"
                confirmationText={flock.name}
                onConfirm={() => {
                  deleteFlock(flock._id);
                }}
              />
            </RoleGuard>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlockCard;
