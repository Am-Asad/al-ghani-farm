import React from "react";
import { BuyerDailyReport as BuyerDailyReportType } from "@/types";
import BuyerReportSummary from "./BuyerReportSummary";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Phone, MapPin } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";

type BuyerDailyReportProps = {
  report: BuyerDailyReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const BuyerDailyReport = ({
  report,
  isLoading,
  isError,
  error,
}: BuyerDailyReportProps) => {
  if (isLoading) {
    return <div>Loading report...</div>;
  }

  if (isError) {
    return (
      <ErrorFetchingData
        title="Daily Report"
        description="Daily Report"
        buttonText="Generate Report"
        error={error}
      />
    );
  }

  if (!report) {
    return (
      <DataNotFound
        title="Daily Report"
        icon={<Calendar className="w-10 h-10" />}
      >
        <p>No report data available</p>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Report - {formatDate(report.date)}
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
      <BuyerReportSummary summary={report.summary} title="Daily Summary" />

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

export default BuyerDailyReport;
