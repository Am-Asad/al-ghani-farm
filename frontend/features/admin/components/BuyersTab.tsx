"use client";
import React from "react";
import { useGetAllBuyers } from "../buyers/hooks/useGetAllBuyers";
import CreateEditBuyerForm from "../buyers/components/CreateEditBuyerForm";
import RoleGuard from "@/features/shared/components/RoleGuard";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import ErrorFeatchingData from "@/features/shared/components/ErrorFetchingData";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import BuyersHeader from "../buyers/components/BuyerHeader";
import BuyerCard from "../buyers/components/BuyerCard";
import { useBuyersQueryParams } from "../buyers/hooks/useBuyersQueryParams";
import BuyersFilters from "../buyers/components/BuyersFilters";
import Pagination from "@/features/shared/components/Pagination";

const BuyersTab = () => {
  const { query, setPage, setLimit } = useBuyersQueryParams();
  const {
    data: buyersData,
    isLoading: buyersLoading,
    isError: buyersError,
    error: buyersErrorMsg,
  } = useGetAllBuyers(query);

  const pagination = buyersData?.pagination || {
    page: 1,
    limit: 1,
    totalCount: 0,
    hasMore: false,
  };

  const buyers = buyersData?.data || [];

  if (buyersLoading) return <CardsSkeleton />;
  if (buyersError) {
    return (
      <ErrorFeatchingData
        title="Buyers"
        description="Manage your buyers"
        buttonText="Add Buyer"
        error={(buyersErrorMsg as Error)?.message || "Failed to load buyers"}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Buyers header */}
      <BuyersHeader totalBuyers={buyers.length} />
      {/* Filters */}
      <BuyersFilters />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {/* Buyers grid */}
        {buyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((buyer) => (
              <BuyerCard key={buyer._id} buyer={buyer} />
            ))}
          </div>
        ) : (
          <DataNotFound
            title="buyers"
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

export default BuyersTab;
