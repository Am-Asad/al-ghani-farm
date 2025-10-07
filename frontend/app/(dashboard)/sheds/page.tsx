"use client";
import ShedsHeader from "@/features/admin/sheds/components/ShedHeader";
import { useGetAllSheds } from "@/features/admin/sheds/hooks/useShedHooks";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Warehouse } from "lucide-react";
import React from "react";
import { useShedQueryParams } from "@/features/admin/sheds/hooks/useShedQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import ShedsTable from "@/features/admin/sheds/components/ShedsTable";
import ShedsPageSkeleton from "@/features/admin/sheds/components/ShedsPageSkeleton";

const ShedsPage = () => {
  const queryParams = useShedQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetAllSheds(query);

  const sheds = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading) {
    return <ShedsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Sheds"
          description="Manage your sheds"
          buttonText="Add User"
          error={error?.message || "Failed to load sheds"}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col flex-1 overflow-y-scroll">
      {/* Sheds header */}
      <ShedsHeader showActions={false} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.SHEDS}
        queryParams={queryParams}
      />
      {/* Users grid */}
      <div className="flex-1 pb-1 my-4">
        {sheds.length > 0 ? (
          <ShedsTable sheds={sheds} />
        ) : (
          <DataNotFound
            title="sheds"
            icon={<Warehouse className="w-10 h-10" />}
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

export default ShedsPage;
