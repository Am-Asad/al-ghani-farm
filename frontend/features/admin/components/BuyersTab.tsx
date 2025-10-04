"use client";
import React from "react";
import { useGetAllBuyers } from "../buyers/hooks/useBuyerHooks";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import BuyersHeader from "../buyers/components/BuyerHeader";
import { useBuyersQueryParams } from "../buyers/hooks/useBuyersQueryParams";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import BuyersTable from "../buyers/components/BuyersTable";

const BuyersTab = () => {
  const { query, setPage, setLimit } = useBuyersQueryParams();
  const {
    data: buyersData,
    isLoading: buyersLoading,
    isError: buyersError,
    error: buyersErrorMsg,
  } = useGetAllBuyers(query);

  const pagination = buyersData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  const buyers = buyersData?.data || [];

  if (buyersLoading) return <TableSkeleton />;
  if (buyersError) {
    return (
      <ErrorFetchingData
        title="Buyers"
        description="Manage your buyers"
        buttonText="Add Buyer"
        error={(buyersErrorMsg as Error)?.message || "Failed to load buyers"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Buyers header */}
      <BuyersHeader showActions={true} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.BUYERS}
        queryParams={query}
      />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {/* Buyers grid */}
        {buyers.length > 0 ? (
          <BuyersTable buyers={buyers} />
        ) : (
          <DataNotFound
            title="buyers"
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

export default BuyersTab;
