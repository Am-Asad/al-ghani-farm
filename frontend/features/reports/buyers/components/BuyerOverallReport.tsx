import React from "react";
import { BuyerOverallReport as BuyerOverallReportType } from "@/types";
import BuyerReportSummary from "./BuyerReportSummary";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, User, Phone, MapPin } from "lucide-react";

type BuyerOverallReportProps = {
  report: BuyerOverallReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const BuyerOverallReport = ({
  report,
  isLoading,
  isError,
  error,
}: BuyerOverallReportProps) => {
  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading report: {error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No report data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Overall Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.buyer && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.buyer.name}</p>
                  <p className="text-sm text-muted-foreground">Buyer Name</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.buyer.contactNumber}</p>
                  <p className="text-sm text-muted-foreground">Contact</p>
                </div>
              </div>
              {report.buyer.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.buyer.address}</p>
                    <p className="text-sm text-muted-foreground">Address</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <BuyerReportSummary
        summary={report.summary}
        title="Overall Summary"
        dateRange={report.summary.dateRange}
      />

      {/* Transactions */}
      <LedgersTable
        ledgers={report.transactions}
        isLoading={false}
        isError={false}
        error=""
      />
    </div>
  );
};

export default BuyerOverallReport;
