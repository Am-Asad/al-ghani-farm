"use client";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useGetAllFlocks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Building2 } from "lucide-react";
import React from "react";
import FlockHeader from "@/features/admin/flocks/components/FlockHeader";
import { useFlockQueryParams } from "@/features/admin/flocks/hooks/useFlockQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import FlockFilters from "@/features/admin/flocks/components/FlockFilters";
import FlocksTable from "@/features/admin/flocks/components/FlocksTable";

const FlocksPage = () => {
  const { query, setPage, setLimit } = useFlockQueryParams();
  const { data, isLoading, isError, error } = useGetAllFlocks(query);

  const flocks = data?.data || [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Flocks"
          description="Manage your flocks"
          buttonText="Add Flock"
          error={error?.message || "Failed to load flocks"}
        />
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col flex-1 overflow-y-scroll">
      {/* Flocks header */}
      <FlockHeader totalFlocks={flocks.length} showActions={false} />
      {/* Filters */}
      <FlockFilters />
      {/* Flocks grid */}
      <div className="flex-1 overflow-y-scroll pb-1 mt-4">
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

export default FlocksPage;
