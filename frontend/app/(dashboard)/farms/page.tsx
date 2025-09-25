"use client";

import { Building2 } from "lucide-react";
import FarmCard from "@/features/admin/farms/components/FarmCard";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useGetAllFarms";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import FarmHeader from "@/features/admin/farms/components/FarmHeader";
import CreateEditFarmForm from "@/features/admin/farms/components/CreateEditFarmForm";
import FarmFilters from "@/features/admin/farms/components/FarmFilters";
import Pagination from "@/features/shared/components/Pagination";
import { useFarmQueryParams } from "@/features/admin/farms/hooks/useFarmQueryParams";

export default function FarmsPage() {
  const { query, setPage, setLimit } = useFarmQueryParams();
  const { data, isLoading, isError, error } = useGetAllFarms(query);

  const farms = data?.data || [];
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
          title="Farms"
          description="Manage your poultry farm locations and operations"
          buttonText="Add Farm"
          error={error?.message || "Failed to load farms"}
        />
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="farms" icon={<Building2 className="w-10 h-10" />}>
          <CreateEditFarmForm />
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 flex flex-col flex-1 overflow-y-scroll">
      <FarmHeader totalFarms={farms.length} showActions={false} />
      {/* Filters */}
      <FarmFilters />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {/* Farms grid */}
        {farms.length > 0 ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <FarmCard key={farm._id} farm={farm} showActions={false} />
            ))}
          </div>
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
