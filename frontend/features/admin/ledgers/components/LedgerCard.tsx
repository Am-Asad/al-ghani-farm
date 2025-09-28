import React from "react";
import { Ledger as LedgerType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Truck, User, Weight, Calendar, Expand } from "lucide-react";
import { formatAmount, formatDate } from "@/utils/formatting";
import { cn } from "@/lib/utils";
import ConfirmationDialog from "@/features/shared/components/ConfirmationDialog";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditLedgerForm from "./CreateEditLedgerForm";
import { useDeleteLedger } from "../hooks/useDeleteLedger";
import { Button } from "@/components/ui/button";

type LedgerCardProps = {
  ledger: LedgerType;
  showActions?: boolean;
};

const LedgerCard = ({ ledger, showActions = true }: LedgerCardProps) => {
  const { mutate: deleteLedger } = useDeleteLedger();
  const balance = ledger.totalAmount - ledger.amountPaid;
  const isPaid = balance <= 0;
  const isOverdue = balance > 0;

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              {ledger.vehicleNumber}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(ledger.date)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                isPaid ? "default" : isOverdue ? "destructive" : "secondary"
              }
              className={cn(
                "text-xs",
                isPaid && "bg-chart-2/10 text-chart-2 hover:bg-chart-2/10",
                isOverdue &&
                  "bg-destructive/10 text-destructive hover:bg-destructive/10"
              )}
            >
              {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
            </Badge>
            {!showActions && (
              <Button variant="outline" size="icon">
                <Expand className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Information - Farm, Buyer, Net Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Building2 className="w-4 h-4" />
              Farm
            </div>
            <p className="text-sm font-medium">{ledger.farmId.name}</p>
            <p className="text-xs text-muted-foreground">
              {ledger.flockId.name} • {ledger.shedId.name}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="w-4 h-4" />
              Buyer
            </div>
            <p className="text-sm font-medium">{ledger.buyerId.name}</p>
            <p className="text-xs text-muted-foreground">
              {ledger.buyerId.contactNumber}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Weight className="w-4 h-4" />
              Net Weight
            </div>
            <p className="text-sm font-medium">
              {formatAmount(ledger.netWeight)} kg
            </p>
            <p className="text-xs text-muted-foreground">
              {formatAmount(ledger.numberOfBirds)} birds
            </p>
          </div>
        </div>

        {/* Financial Summary - Most Important */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
              <p className="text-lg font-semibold text-primary">
                {formatAmount(ledger.totalAmount)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
              <p className="text-lg font-semibold text-chart-2">
                {formatAmount(ledger.amountPaid)}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Balance</p>
              <p
                className={cn(
                  "text-lg font-semibold",
                  balance > 0 ? "text-destructive" : "text-chart-2"
                )}
              >
                {formatAmount(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex space-x-2">
            <RoleGuard requiredRole={["admin", "manager"]}>
              <CreateEditLedgerForm selectedLedger={ledger} />
            </RoleGuard>
            <RoleGuard requiredRole={["admin"]}>
              <ConfirmationDialog
                title="Delete Ledger"
                description="Are you sure you want to delete this ledger entry?"
                confirmationText={ledger.vehicleNumber}
                onConfirm={() => {
                  deleteLedger(ledger._id);
                }}
              />
            </RoleGuard>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LedgerCard;
