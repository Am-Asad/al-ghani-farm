import React from "react";
import { FlockOverallReport as FlockOverallReportType } from "@/types";
import FlockReportSummary from "./FlockReportSummary";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Layers } from "lucide-react";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";

type Props = {
  report: FlockOverallReportType;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const FlockOverallReport = ({ report, isLoading, isError, error }: Props) => {
  if (isLoading) return <div>Loading report...</div>;
  if (isError)
    return (
      <ErrorFetchingData
        title="Overall Report"
        description="Overall Report"
        buttonText="Generate Report"
        error={error}
      />
    );
  if (!report)
    return (
      <DataNotFound
        title="Overall Report"
        icon={<BarChart3 className="w-10 h-10" />}
      >
        <p>No report data available</p>
      </DataNotFound>
    );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Overall Report
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

      <FlockReportSummary
        summary={report.summary}
        title="Overall Summary"
        dateRange={report.summary.dateRange || undefined}
      />

      <LedgersTable
        ledgers={report.transactions}
        isLoading={false}
        isError={false}
        error=""
      />
    </div>
  );
};

export default FlockOverallReport;
