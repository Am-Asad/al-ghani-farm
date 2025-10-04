"use client";
import React from "react";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useGetAllLedgers";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import { useFarmLedgerQueryParams } from "@/features/admin/ledgers/hooks/useFarmLedgerQueryParams";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";

type FarmLedgersProps = {
  farmId: string;
};

const FarmLedgers = ({ farmId }: FarmLedgersProps) => {
  const { query, setPage, setLimit } = useFarmLedgerQueryParams(farmId);

  const { data, isLoading, isError } = useGetAllLedgers(query);

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
        <DataNotFound
          title="ledgers"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ConfigurableFilters
        config={createCustomFilterConfig(ENTITY_FILTER_PRESETS.FARM_LEDGERS, {
          searchPlaceholder: "Search ledgers for this farm...",
        })}
        queryParams={query}
      />

      {/* Ledgers Table */}
      <div className="flex-1 pb-1 my-4">
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

export default FarmLedgers;
