import React from "react";
import { ShedDailyReport as ShedDailyReportType } from "@/types";
import ShedReportSummary from "./ShedReportSummary";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building2, Users } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";

type ShedDailyReportProps = {
  report: ShedDailyReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const ShedDailyReport = ({
  report,
  isLoading,
  isError,
  error,
}: ShedDailyReportProps) => {
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
          {report.shed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.shed.name}</p>
                  <p className="text-sm text-muted-foreground">Shed Name</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.shed.totalChicks}</p>
                  <p className="text-sm text-muted-foreground">Total Chicks</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <ShedReportSummary summary={report.summary} title="Daily Summary" />

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

export default ShedDailyReport;
