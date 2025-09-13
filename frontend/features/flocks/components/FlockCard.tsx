"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Flock } from "@/types";
import { formatDate } from "@/utils/format-date";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditFlockForm from "./CreateEditFlockForm";
import { useDeleteFlock } from "../hooks/useDeleteFlock";
import { formatSingleDigit } from "@/utils/format-single-digit";
import { useRouter } from "next/navigation";

type FlockCardProps = {
  flock: Flock;
};

const FlockCard = ({ flock }: FlockCardProps) => {
  const router = useRouter();
  const { mutate: deleteFlock } = useDeleteFlock(flock.farmId);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "inactive":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow h-fit cursor-pointer"
      onClick={() => router.push(`/flocks/${flock._id}`)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{flock.name}</CardTitle>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              flock.status
            )}`}
          >
            {flock.status}
          </span>
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
              <p className="text-sm text-muted-foreground">Total Sheds</p>
            </div>
            <p className="text-lg font-semibold text-primary">
              {formatSingleDigit(flock.shedsCount?.toLocaleString() || 0)}
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

        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <RoleGuard requiredRole={["admin", "manager"]}>
            <CreateEditFlockForm selectedFlock={flock} />
          </RoleGuard>
          <RoleGuard requiredRole={["admin"]}>
            <ConfirmationDialog
              title="Delete Flock"
              description="Are you sure you want to delete this flock?"
              confirmationText={flock.name}
              onConfirm={() => {
                deleteFlock({ id: flock._id });
              }}
            />
          </RoleGuard>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlockCard;
