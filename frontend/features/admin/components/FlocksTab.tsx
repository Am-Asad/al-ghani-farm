"use client";
// import CreateEditFlockForm from "@/features/admin/flocks/components/CreateEditFlockForm";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useGetAllFlocks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import React from "react";
import { Building2 } from "lucide-react";
import FlockHeader from "@/features/admin/flocks/components/FlockHeader";
import FlockCard from "@/features/admin/flocks/components/FlockCard";
import { useFlockQueryParams } from "@/features/admin/flocks/hooks/useFlockQueryParams";
import Pagination from "@/features/shared/components/Pagination";
import FlockFilters from "@/features/admin/flocks/components/FlockFilters";

const FlocksTab = () => {
  const { query, setPage, setLimit } = useFlockQueryParams();
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

  if (flocksLoading) return <CardsSkeleton />;
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
      <FlockHeader totalFlocks={flocks.length} />
      {/* Filters */}
      <FlockFilters />
      {/* Flocks grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {flocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flocks.map((flock) => (
              <FlockCard key={flock._id} flock={flock} />
            ))}
          </div>
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
