import React from "react";
import { LedgerResponse as LedgerResponseType } from "@/types";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Truck,
  User,
  Calculator,
  Calendar,
  DollarSign,
} from "lucide-react";
import { formatAmount } from "@/utils/format-amount";
import { formatDate } from "@/utils/format-date";

type LedgersTableProps = {
  ledgers: LedgerResponseType[];
  isLoading: boolean;
  isError: boolean;
  error: string;
  //   search?: string;
};

const LedgersTable = ({
  ledgers,
  isLoading,
  isError,
  error,
}: LedgersTableProps) => {
  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <ErrorFetchingData
        title="Ledgers"
        description="Ledgers"
        buttonText="Add Ledger"
        error={error}
      />
    );
  }

  if (ledgers.length === 0) {
    return (
      <DataNotFound title="ledgers" icon={<FileText className="w-10 h-10" />} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ledger Entries ({ledgers.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Table Body */}
      <div className="space-y-3">
        {ledgers.map((ledger) => (
          <Card key={ledger?._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date & Vehicle Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(ledger?.date) || "N/A"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                    <Truck className="w-4 h-4" />
                    <span>Vehicle</span>
                  </div>
                  <p className="font-medium">
                    {ledger?.vehicleNumber || "N/A"}
                  </p>
                </div>

                {/* Driver & Accountant Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Driver</span>
                  </div>
                  <p className="font-medium">{ledger?.driverName || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">
                    {ledger?.driverContact || "N/A"}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                    <Calculator className="w-4 h-4" />
                    <span>Accountant</span>
                  </div>
                  <p className="font-medium">
                    {ledger?.accountantName || "N/A"}
                  </p>
                </div>

                {/* Weight & Birds Info */}
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Weight Details
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Empty:</span>
                      <span className="font-medium">
                        {ledger?.emptyVehicleWeight || "N/A"} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Gross:</span>
                      <span className="font-medium">
                        {ledger?.grossWeight || "N/A"} kg
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Net:</span>
                      <span className="font-medium">
                        {ledger?.netWeight || "N/A"} kg
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mt-3">
                    Birds
                  </div>
                  <p className="font-medium">
                    {ledger?.numberOfBirds || "N/A"} birds
                  </p>
                </div>

                {/* Financial Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    <span>Financial</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Rate:</span>
                      <span className="font-medium">
                        Rs. {formatAmount(ledger?.rate || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">
                        Rs. {formatAmount(ledger?.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Paid:</span>
                      <span className="font-medium">
                        Rs. {formatAmount(ledger?.amountPaid || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-1">
                      <span>Balance:</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ledger?.balance > 0
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        Rs. {formatAmount(ledger?.balance || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IDs Row */}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LedgersTable;
