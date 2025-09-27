"use client";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Building2 } from "lucide-react";
import React from "react";
import { useLedgerQueryParams } from "@/features/admin/ledgers/hooks/useLedgerQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useGetAllLedgers";
import LedgerHeader from "@/features/admin/ledgers/components/LedgerHeader";
import LedgerFilters from "@/features/admin/flocks/components/LedgerFilters";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";

const LedgersPage = () => {
  const { query, setPage, setLimit } = useLedgerQueryParams();
  const { data, isLoading, isError, error } = useGetAllLedgers(query);

  const ledgers = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Ledgers"
          description="Manage your ledgers"
          buttonText="Add Ledger"
          error={error?.message || "Failed to load flocks"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col flex-1 overflow-y-scroll">
      {/* Ledgers header */}
      <LedgerHeader showActions={false} />
      <div className="flex-1 overflow-y-scroll pb-1">
        {/* Filters */}
        <LedgerFilters />
        {/* Ledgers grid */}
        <div className="flex-1 overflow-y-scroll overflow-x-hidden pb-1 mt-4">
          {ledgers.length > 0 ? (
            <LedgersTable ledgers={ledgers} />
          ) : (
            <DataNotFound
              title="ledgers"
              icon={<Building2 className="w-10 h-10" />}
            />
          )}
        </div>
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

export default LedgersPage;
