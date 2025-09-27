"use client";
import FarmFilters from "@/features/admin/farms/components/FarmFilters";
import FarmHeader from "@/features/admin/farms/components/FarmHeader";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useGetAllFarms";
import { useFarmQueryParams } from "@/features/admin/farms/hooks/useFarmQueryParams";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Building2 } from "lucide-react";
import React from "react";
import Pagination from "@/features/shared/components/Pagination";
import FarmsTable from "@/features/admin/farms/components/FarmsTable";

const FarmsTab = () => {
  const { query, setPage, setLimit } = useFarmQueryParams();
  const {
    data: farmsData,
    isLoading: farmsLoading,
    isError: farmsError,
    error: farmsErrorMsg,
  } = useGetAllFarms(query);

  const farms = farmsData?.data || [];
  const pagination = farmsData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (farmsLoading) return <CardsSkeleton />;
  if (farmsError) {
    return (
      <ErrorFetchingData
        title="Farms"
        description="Manage your farms"
        buttonText="Add Farm"
        error={(farmsErrorMsg as Error)?.message || "Failed to load farms"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Farms header */}
      <FarmHeader totalFarms={farms.length} />
      {/* Filters */}
      <FarmFilters />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {/* Farms grid */}
        {farms.length > 0 ? (
          <FarmsTable farms={farms} />
        ) : (
          <DataNotFound
            title="farms"
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

export default FarmsTab;
