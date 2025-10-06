"use client";

import { Building2 } from "lucide-react";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useFarmHooks";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import FarmHeader from "@/features/admin/farms/components/FarmHeader";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import { useFarmQueryParams } from "@/features/admin/farms/hooks/useFarmQueryParams";
import FarmsTable from "@/features/admin/farms/components/FarmsTable";
import TableSkeleton from "@/features/shared/components/TableSkeleton";

export default function FarmsPage() {
  const queryParams = useFarmQueryParams();
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetAllFarms(query);

  const farms = data?.data || [];
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
          title="Farms"
          description="Manage your poultry farm locations and operations"
          buttonText="Add Farm"
          error={error?.message || "Failed to load farms"}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col flex-1 overflow-y-scroll">
      <FarmHeader showActions={false} />
      {/* Filters */}
      <ConfigurableFilters
        config={ENTITY_FILTER_PRESETS.FARMS}
        queryParams={queryParams}
      />
      {/* Grid */}
      <div className="flex-1 pb-1 my-4">
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
}
