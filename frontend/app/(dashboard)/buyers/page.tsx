"use client";
import BuyerHeader from "@/features/admin/buyers/components/BuyerHeader";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import React from "react";
import { useGetAllBuyers } from "@/features/admin/buyers/hooks/useBuyerHooks";
import { UserCheck } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useBuyersQueryParams } from "@/features/admin/buyers/hooks/useBuyersQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import BuyersTable from "@/features/admin/buyers/components/BuyersTable";
import BuyersPageSkeleton from "@/features/admin/buyers/components/BuyersPageSkeleton";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";

const BuyersPage = () => {
  const queryParams = useBuyersQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetAllBuyers(query);

  const buyers = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading) {
    return <BuyersPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Buyers"
          description="Manage system users and their permissions"
          buttonText="Add User"
          error={error?.message || "Failed to load buyers"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1">
      {/* Page header */}
      <BuyerHeader showActions={false} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.BUYERS}
        queryParams={queryParams}
      />
      {/* Grid */}
      <div className="flex-1 pb-1 my-4">
        {buyers.length > 0 ? (
          <BuyersTable buyers={buyers} />
        ) : (
          <DataNotFound
            title="buyers"
            icon={<UserCheck className="w-10 h-10" />}
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

export default BuyersPage;
