import React from "react";
import { FarmDailyReport as FarmDailyReportType } from "@/types";
import FarmReportSummary from "./FarmReportSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building2 } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";

type Props = {
  report: FarmDailyReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const FarmDailyReport = ({ report, isLoading, isError, error }: Props) => {
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
          {report.farm && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{report.farm.name}</p>
                  <p className="text-sm text-muted-foreground">Farm Name</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <FarmReportSummary summary={report.summary} title="Daily Summary" />

      {/* <LedgersTable
        ledgers={report.transactions}
        isLoading={false}
        isError={false}
        error=""
      /> */}
    </div>
  );
};

export default FarmDailyReport;
