"use client";
import React from "react";
import { useGetAllSheds } from "@/features/admin/sheds/hooks/useShedHooks";
import ShedsTable from "@/features/admin/sheds/components/ShedsTable";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import { useShedQueryParams } from "@/features/admin/sheds/hooks/useShedQueryParams";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";

type FarmShedsProps = {
  farmId: string;
};

const FarmSheds = ({ farmId }: FarmShedsProps) => {
  const queryParams = useShedQueryParams();
  const { query, setPage, setLimit } = queryParams;

  // Override the farmId in the query to filter by the selected farm
  const farmSpecificQuery = { ...query, farmId };

  const { data, isLoading, isError } = useGetAllSheds(farmSpecificQuery);

  const sheds = data?.data || [];
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
          title="sheds"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ConfigurableFilters
        config={createCustomFilterConfig(ENTITY_FILTER_PRESETS.SHEDS, {
          showFarms: false, // Hide farm filter since farm is already selected
          searchPlaceholder: "Search sheds in this farm...",
        })}
        queryParams={{ ...queryParams, query: farmSpecificQuery }}
      />

      {/* Sheds Table */}
      <div className="flex-1 pb-1 my-4">
        {sheds.length > 0 ? (
          <ShedsTable sheds={sheds} />
        ) : (
          <DataNotFound
            title="sheds"
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

export default FarmSheds;
