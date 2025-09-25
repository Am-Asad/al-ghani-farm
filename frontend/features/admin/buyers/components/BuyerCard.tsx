"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Expand } from "lucide-react";
import { Buyer } from "@/types";
import { formatDate } from "@/utils/format-date";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { useRouter } from "next/navigation";
import { useDeleteBuyer } from "../hooks/useDeleteBuyer";
import CreateEditBuyerForm from "./CreateEditBuyerForm";
import { Button } from "@/components/ui/button";
import ShowOptionsDropdown from "@/features/shared/components/ShowOptionsDropdown";

type BuyerCardProps = {
  buyer: Buyer;
  showActions?: boolean;
};

const BuyerCard = ({ buyer, showActions = true }: BuyerCardProps) => {
  const { mutate: deleteBuyer } = useDeleteBuyer();
  const router = useRouter();

  return (
    <Card className="hover:shadow-md transition-shadow h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">{buyer.name}</CardTitle>
          </div>
          {!showActions && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/buyers/${buyer._id}`)}
            >
              <Expand className="w-4 h-4" />
            </Button>
          )}
          {!showActions && (
            <ShowOptionsDropdown
              options={[
                { label: "See Ledgers", href: `/ledgers?buyerId=${buyer._id}` },
              ]}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Contact Number</p>
            <p className="font-medium">{buyer?.contactNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{buyer?.address || "N/A"}</p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground mb-1">Created At</p>
          <p className="text-sm font-medium">{formatDate(buyer?.createdAt)}</p>
        </div>

        {showActions && (
          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
            <RoleGuard requiredRole={["admin", "manager"]}>
              <CreateEditBuyerForm selectedBuyer={buyer} />
            </RoleGuard>
            <RoleGuard requiredRole={["admin"]}>
              <ConfirmationDialog
                title="Delete Buyer"
                description="Are you sure you want to delete this buyer?"
                confirmationText={buyer?.name}
                onConfirm={() => deleteBuyer(buyer._id)}
              />
            </RoleGuard>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BuyerCard;
