"use client";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useGetAllLedgers";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Building2 } from "lucide-react";
import React from "react";
import LedgerHeader from "../ledgers/components/LedgerHeader";
import { useLedgerQueryParams } from "../ledgers/hooks/useLedgerQueryParams";
import LedgerFilters from "../flocks/components/LedgerFilters";
import Pagination from "@/features/shared/components/Pagination";
import LedgersTable from "../ledgers/components/LedgersTable";

const LedgersTab = () => {
  const { query, setPage, setLimit } = useLedgerQueryParams();
  const {
    data: ledgersData,
    isLoading: ledgersLoading,
    isError: ledgersError,
    error: ledgersErrorMsg,
  } = useGetAllLedgers(query);

  const ledgers = ledgersData?.data || [];
  const pagination = ledgersData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (ledgersLoading) return <CardsSkeleton />;
  if (ledgersError) {
    return (
      <ErrorFetchingData
        title="Ledgers"
        description="Manage your ledgers"
        buttonText="Add Ledger"
        error={(ledgersErrorMsg as Error)?.message || "Failed to load ledgers"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Ledgers header */}
      <LedgerHeader totalLedgers={ledgers.length} showActions={true} />
      {/* Filters */}
      <LedgerFilters />
      {/* Ledgers grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {ledgers.length > 0 ? (
          <LedgersTable ledgers={ledgers} />
        ) : (
          <DataNotFound
            title="ledgers"
            icon={<Building2 className="w-10 h-10" />}
          />
        )}
      </div>
      {/* Pagination */}
      <Pagination
        page={pagination.page}
        limit={pagination.limit}
        hasMore={pagination.hasMore}
        onChangePage={(p) => setPage(p)}
        onChangeLimit={(l) => setLimit(l)}
      />
    </div>
  );
};

export default LedgersTab;
