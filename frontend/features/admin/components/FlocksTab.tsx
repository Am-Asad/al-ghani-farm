"use client";
// import CreateEditFlockForm from "@/features/admin/flocks/components/CreateEditFlockForm";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useFlockHooks";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import React from "react";
import { Building2 } from "lucide-react";
import FlockHeader from "@/features/admin/flocks/components/FlockHeader";
import { useFlockQueryParams } from "@/features/admin/flocks/hooks/useFlockQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import FlocksTable from "@/features/admin/flocks/components/FlocksTable";

const FlocksTab = () => {
  const queryParams = useFlockQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const {
    data: flocksData,
    isLoading: flocksLoading,
    isError: flocksError,
    error: flocksErrorMsg,
  } = useGetAllFlocks(query);

  const flocks = flocksData?.data || [];
  const pagination = flocksData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (flocksLoading) return <TableSkeleton />;
  if (flocksError) {
    return (
      <ErrorFetchingData
        title="Flocks"
        description="Manage your flocks"
        buttonText="Add Flock"
        error={(flocksErrorMsg as Error)?.message || "Failed to load flocks"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Flocks header */}
      <FlockHeader showActions={true} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.FLOCKS}
        queryParams={queryParams}
      />
      {/* Flocks grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {flocks.length > 0 ? (
          <FlocksTable flocks={flocks} />
        ) : (
          <DataNotFound
            title="flocks"
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

export default FlocksTab;
