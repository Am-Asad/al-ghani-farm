"use client";
import React from "react";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useFlockHooks";
import FlocksTable from "@/features/admin/flocks/components/FlocksTable";
import TableSkeleton from "@/features/shared/components/TableSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import { useFlockQueryParams } from "@/features/admin/flocks/hooks/useFlockQueryParams";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";

type FarmFlocksProps = {
  farmId: string;
};

const FarmFlocks = ({ farmId }: FarmFlocksProps) => {
  const { query, setPage, setLimit } = useFlockQueryParams();

  // Override the farmId in the query to filter by the selected farm
  const farmSpecificQuery = { ...query, farmId };

  const { data, isLoading, isError } = useGetAllFlocks(farmSpecificQuery);

  const flocks = data?.data || [];
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
          title="flocks"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ConfigurableFilters
        config={createCustomFilterConfig(ENTITY_FILTER_PRESETS.FLOCKS, {
          showFarms: false, // Hide farm filter since farm is already selected
          searchPlaceholder: "Search flocks in this farm...",
        })}
        queryParams={farmSpecificQuery}
      />

      {/* Flocks Table */}
      <div className="flex-1 pb-1 my-4">
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

export default FarmFlocks;
