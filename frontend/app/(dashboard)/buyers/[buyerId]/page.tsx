"use client";
import { useGetBuyerById } from "@/features/admin/buyers/hooks/useBuyerHooks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import BuyerDetailsCard from "@/features/admin/buyers/components/BuyerDetailsCard";
import { Button } from "@/components/ui/button";
import LedgersTable from "@/features/admin/ledgers/components/LedgersTable";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useLedgerHooks";
import ConfigurableFilters from "@/features/shared/components/ConfigurableFilters";
import { ENTITY_FILTER_PRESETS } from "@/features/shared/utils/filterPresets";
import Pagination from "@/features/shared/components/Pagination";
import { useBuyerLedgerQueryParams } from "@/features/admin/ledgers/hooks/useBuyerLedgerQueryParams";
import { createCustomFilterConfig } from "@/features/shared/utils/filterPresets";

const BuyerDetailsPage = () => {
  const router = useRouter();
  const { buyerId } = useParams();
  const { query, setPage, setLimit } = useBuyerLedgerQueryParams(
    buyerId as string
  );
  const { data, isLoading, isError, error } = useGetBuyerById(
    buyerId as string
  );
  const buyer = data?.data;

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
          title="Buyer Details"
          description="Failed to load buyer details"
          buttonText="Go Back"
          error={
            error?.message ||
            ledgersErrorMsg?.message ||
            "Failed to load buyer details"
          }
        />
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound
          title="buyer"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button and Report button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Buyers
        </Button>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <BuyerDetailsCard buyer={buyer} />
        <ConfigurableFilters
          config={createCustomFilterConfig(
            ENTITY_FILTER_PRESETS.BUYER_LEDGERS,
            {
              showBuyers: false, // Hide normal buyer filter
              showBuyersReadOnly: true, // Show buyer filter as read-only
              searchPlaceholder: `Search ledgers for ${buyer.name}...`,
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

export default BuyerDetailsPage;
