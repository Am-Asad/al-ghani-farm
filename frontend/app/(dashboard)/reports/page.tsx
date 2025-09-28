"use client";
import React from "react";
import ReportFilters from "@/features/reports/components/ReportFilters";
import ReportsTable from "@/features/reports/components/ReportsTable";
import ReportsSummary from "@/features/reports/components/ReportsSummary";
import { useReportQueryParams } from "@/features/reports/hooks/useReportQueryParams";
import {
  useGetReports,
  ReportTransaction,
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

  // Handle simplified ReportData structure
  const transactions =
    (reportData as { transactions: ReportTransaction[] })?.transactions || [];
  const summary = reportData?.summary;
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
          </p>
        </div>
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

          {/* Transactions Table */}
          <ReportsTable
            transactions={transactions}
            isLoading={reportsLoading}
            includeDetails={query.includeDetails === "true"}
          />

          {/* Pagination */}
          {query.includeDetails === "true" && pagination.totalCount > 0 && (
            <Pagination
              page={pagination.page || 1}
              limit={pagination.limit || 10}
              hasMore={pagination.hasMore}
              onChangePage={(p) => setPage(p)}
              onChangeLimit={(l) => setLimit(l)}
            />
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
