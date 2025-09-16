import React from "react";
import { FlockDailyReport as FlockDailyReportType } from "@/types";
import FlockReportSummary from "./FlockReportSummary";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Layers } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";

type Props = {
  report: FlockDailyReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const FlockDailyReport = ({ report, isLoading, isError, error }: Props) => {
  if (isLoading) return <div>Loading report...</div>;
  if (isError)
    return (
      <ErrorFetchingData
        title="Daily Report"
        description="Daily Report"
        buttonText="Generate Report"
        error={error}
      />
    );
  if (!report)
    return (
      <DataNotFound
        title="Daily Report"
        icon={<Calendar className="w-10 h-10" />}
      >
        <p>No report data available</p>
      </DataNotFound>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Daily Report - {formatDate(report.date)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report.flock && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.flock.name}</p>
                  <p className="text-sm text-muted-foreground">Flock Name</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FlockReportSummary summary={report.summary} title="Daily Summary" />

      <LedgersTable
        ledgers={report.transactions}
        isLoading={false}
        isError={false}
        error=""
      />
    </div>
  );
};

export default FlockDailyReport;
