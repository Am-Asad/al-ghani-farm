import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShedReportSummary as ShedReportSummaryType } from "@/types";
import {
  Calculator,
  DollarSign,
  Package,
  Users,
  Weight,
  Calendar,
} from "lucide-react";
import { formatAmount } from "@/utils/format-amount";

type ShedReportSummaryProps = {
  summary: ShedReportSummaryType;
  title: string;
  dateRange?: {
    from: string;
    to: string;
  } | null;
};

const ShedReportSummary = ({
  summary,
  title,
  dateRange,
}: ShedReportSummaryProps) => {
  const {
    totalTransactions,
    totalEmptyVehicleWeight,
    totalGrossWeight,
    totalNetWeight,
    totalBirds,
    totalRate,
    totalAmount,
    totalPaid,
    totalBalance,
  } = summary;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          {title}
        </CardTitle>
        {dateRange?.from && dateRange?.to && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {dateRange?.from} to {dateRange?.to}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Transactions & Birds */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                <span>Total Transactions</span>
              </div>
              <p className="text-2xl font-bold">{totalTransactions}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Total Birds</span>
              </div>
              <p className="text-2xl font-bold">
                {totalBirds?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Weight Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Weight className="w-4 h-4" />
                <span>Total Empty Vehicle Weight</span>
              </div>
              <p className="text-xl font-bold">
                {totalEmptyVehicleWeight?.toFixed(2)} kg
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Weight className="w-4 h-4" />
                <span>Total Gross Weight</span>
              </div>
              <p className="text-xl font-bold">
                {totalGrossWeight?.toFixed(2)} kg
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Weight className="w-4 h-4" />
                <span>Total Net Weight</span>
              </div>
              <p className="text-xl font-bold">
                {totalNetWeight?.toFixed(2)} kg
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Total Rate</span>
              </div>
              <p className="text-xl font-bold">
                Rs. {formatAmount(totalRate || 0)}/kg
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Total Amount</span>
              </div>
              <p className="text-xl font-bold">
                Rs. {formatAmount(totalAmount || 0)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Total Paid</span>
              </div>
              <p className="text-xl font-bold">
                Rs. {formatAmount(totalPaid || 0)}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>Total Balance</span>
              </div>
              <p
                className={`text-xl font-bold ${
                  totalBalance && totalBalance > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                Rs. {formatAmount(totalBalance || 0)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShedReportSummary;
