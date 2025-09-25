"use client";
import React from "react";
import { useGetAllSheds } from "../sheds/hooks/useGetAllSheds";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import { Building2 } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ShedCard from "../sheds/components/ShedCard";
import ShedsHeader from "../sheds/components/ShedHeader";
import { useShedQueryParams } from "../sheds/hooks/useShedQueryParams";
import ShedFilters from "../sheds/components/ShedFilters";
import Pagination from "@/features/shared/components/Pagination";

const ShedsTab = () => {
  const { query, setPage, setLimit } = useShedQueryParams();
  const {
    data: shedsData,
    isLoading: shedsLoading,
    isError: shedsError,
    error: shedsErrorMsg,
  } = useGetAllSheds(query);

  const sheds = shedsData?.data || [];
  const pagination = shedsData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (shedsLoading) return <CardsSkeleton />;
  if (shedsError) {
    return (
      <ErrorFetchingData
        title="Sheds"
        description="Manage your sheds"
        buttonText="Add Shed"
        error={(shedsErrorMsg as Error)?.message || "Failed to load sheds"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Sheds header */}
      <ShedsHeader totalSheds={sheds.length} />
      {/* Filters */}
      <ShedFilters />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {sheds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheds.map((shed) => (
              <ShedCard key={shed._id} shed={shed} />
            ))}
          </div>
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

export default ShedsTab;
