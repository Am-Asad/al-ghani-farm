"use client";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Receipt } from "lucide-react";
import React from "react";
import { useLedgerQueryParams } from "@/features/admin/ledgers/hooks/useLedgerQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useLedgerHooks";
import LedgerHeader from "@/features/admin/ledgers/components/LedgerHeader";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";
import TableSkeleton from "@/features/shared/components/TableSkeleton";

const LedgersPage = () => {
  const queryParams = useLedgerQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetAllLedgers(query);

  const ledgers = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading) {
    return <TableSkeleton />;
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

      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.LEDGERS}
        queryParams={queryParams}
      />
      {/* Ledgers grid */}
      <div className="flex-1 pb-1 my-4">
        {ledgers.length > 0 ? (
          <LedgersTable ledgers={ledgers} />
        ) : (
          <DataNotFound
            title="ledgers"
            icon={<Receipt className="w-10 h-10" />}
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

export default LedgersPage;
