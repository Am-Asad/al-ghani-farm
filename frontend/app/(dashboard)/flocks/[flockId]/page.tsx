"use client";
import { useGetFlockById } from "@/features/admin/flocks/hooks/useFlockHooks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import FlockDetailsCard from "@/features/admin/flocks/components/FlockDetailsCard";
import { Button } from "@/components/ui/button";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useLedgerHooks";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import { useFlockLedgerQueryParams } from "@/features/admin/ledgers/hooks/useFlockLedgerQueryParams";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";

const FlockDetailsPage = () => {
  const router = useRouter();
  const { flockId } = useParams();
  const { query, setPage, setLimit } = useFlockLedgerQueryParams(
    flockId as string
  );
  const { data, isLoading, isError, error } = useGetFlockById(
    flockId as string
  );
  const flock = data?.data;

  const {
    data: ledgersData,
    isLoading: ledgersLoading,
    isError: ledgersError,
    error: ledgersErrorMsg,
  } = useGetAllLedgers(query);

  const ledgers = ledgersData?.data || [];
  const pagination = ledgersData?.pagination ?? {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  if (isLoading || ledgersLoading) {
    return <CardsSkeleton />;
  }

  if (isError || ledgersError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Flock Details"
          description="Failed to load flock details"
          buttonText="Go Back"
          error={
            error?.message ||
            ledgersErrorMsg?.message ||
            "Failed to load flock details"
          }
        />
      </div>
    );
  }

  if (!flock) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound
          title="flock"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flocks
        </Button>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <FlockDetailsCard flock={flock} />
        <ConfigurableFilters
          config={createCustomFilterConfig(
            ENTITY_FILTER_PRESETS.FLOCK_LEDGERS,
            {
              searchPlaceholder: `Search ledgers for ${flock.name}...`,
            }
          )}
          queryParams={query}
        />
        <LedgersTable ledgers={ledgers} />
        <Pagination
          page={pagination.page}
          limit={pagination.limit}
          hasMore={pagination.hasMore}
          onChangePage={(p) => setPage(p)}
          onChangeLimit={(l) => setLimit(l)}
        />
      </div>
    </div>
  );
};

export default FlockDetailsPage;
