"use client";
import React from "react";
import ReportFilters from "@/features/reports/components/ReportFilters";
import ReportsTable from "@/features/reports/components/ReportsTable";
import GroupedReportsTable from "@/features/reports/components/GroupedReportsTable";
import ReportsSummary from "@/features/reports/components/ReportsSummary";
import { DownloadReportsButton } from "@/features/reports/components/DownloadReportsButton";
import { useReportQueryParams } from "@/features/reports/hooks/useReportQueryParams";
import {
  useGetReports,
  ReportTransaction,
  GroupedResult,
} from "@/features/reports/hooks/useGetReports";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import Pagination from "@/features/shared/components/Pagination";
import { FileText } from "lucide-react";

const ReportsPage = () => {
  const { query, setPage, setLimit } = useReportQueryParams();
  const {
    data: reportsData,
    isLoading: reportsLoading,
    isError: reportsError,
    error: reportsErrorMsg,
  } = useGetReports(query);
  const reportData = reportsData?.data;

  // Handle both grouped and non-grouped ReportData structure
  const transactions =
    (reportData as { transactions: ReportTransaction[] })?.transactions || [];
  const groupedResults =
    (reportData as { groupedResults: GroupedResult[] })?.groupedResults || [];
  const summary = reportData?.summary;
  const groupBy = (reportData as { groupBy?: string })?.groupBy || "none";
  const isGrouped = groupBy !== "none" && groupedResults.length > 0;

  const pagination = (
    reportData as {
      pagination?: {
        totalCount: number;
        hasMore: boolean;
        page: number;
        limit: number;
      };
    }
  )?.pagination || {
    totalCount: 0,
    hasMore: false,
    page: 1,
    limit: 10,
  };

  if (reportsLoading) return <TableSkeleton />;
  if (reportsError) {
    return (
      <div className="container mx-auto p-6">
        <ErrorFetchingData
          title="Reports"
          description="Generate comprehensive reports with flexible filtering"
          buttonText="Try Again"
          error={
            (reportsErrorMsg as Error)?.message || "Failed to load reports"
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-y-scroll">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports with flexible filtering and date
            ranges
            {isGrouped && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Grouped by {groupBy}
              </span>
            )}
          </p>
        </div>
        <DownloadReportsButton
          query={query}
          disabled={reportsLoading || !reportData?.summary}
        />
      </div>

      {/* Filters */}
      <ReportFilters />
      {/* Reports Content */}
      {reportData?.summary ? (
        <div className="space-y-6">
          {/* Summary Section */}
          <ReportsSummary
            summary={summary}
            isLoading={reportsLoading}
            reportTitle={reportData?.reportTitle}
            dateRange={reportData?.dateRange}
          />

          {/* Transactions Table or Grouped Results */}
          {isGrouped ? (
            <GroupedReportsTable
              groupedResults={groupedResults}
              groupBy={groupBy}
              isLoading={reportsLoading}
              includeDetails={query.includeDetails === "true"}
            />
          ) : (
            <>
              <ReportsTable
                transactions={transactions}
                isLoading={reportsLoading}
                includeDetails={query.includeDetails === "true"}
              />

              {/* Pagination - only for non-grouped results */}
              {query.includeDetails === "true" && pagination.totalCount > 0 && (
                <Pagination
                  page={pagination.page || 1}
                  limit={pagination.limit || 10}
                  hasMore={pagination.hasMore}
                  onChangePage={(p) => setPage(p)}
                  onChangeLimit={(l) => setLimit(l)}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <DataNotFound
          title="reports"
          icon={<FileText className="w-10 h-10" />}
        />
      )}
    </div>
  );
};

export default ReportsPage;
