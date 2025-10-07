"use client";
import { useGetShedById } from "@/features/admin/sheds/hooks/useShedHooks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Warehouse } from "lucide-react";
import ShedDetailsCard from "@/features/admin/sheds/components/ShedDetailsCard";
import { Button } from "@/components/ui/button";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useLedgerHooks";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import { useShedLedgerQueryParams } from "@/features/admin/ledgers/hooks/useShedLedgerQueryParams";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";

const ShedDetailsPage = () => {
  const router = useRouter();
  const { shedId } = useParams();
  const queryParams = useShedLedgerQueryParams(shedId as string);
  const { query, setPage, setLimit } = queryParams;
  const { data, isLoading, isError, error } = useGetShedById(shedId as string);
  const shed = data?.data;

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
          title="Shed Details"
          description="Failed to load shed details"
          buttonText="Go Back"
          error={
            error?.message ||
            ledgersErrorMsg?.message ||
            "Failed to load shed details"
          }
        />
      </div>
    );
  }

  if (!shed) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="shed" icon={<Warehouse className="w-10 h-10" />} />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sheds
        </Button>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <ShedDetailsCard shed={shed} />
        <ConfigurableFilters
          config={createCustomFilterConfig(ENTITY_FILTER_PRESETS.SHED_LEDGERS, {
            searchPlaceholder: `Search ledgers for ${shed.name}...`,
          })}
          queryParams={queryParams}
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

export default ShedDetailsPage;
