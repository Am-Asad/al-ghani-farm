"use client";
import BuyerHeader from "@/features/admin/buyers/components/BuyerHeader";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import React from "react";
import { useGetAllBuyers } from "@/features/admin/buyers/hooks/useGetAllBuyers";
import BuyerCard from "@/features/admin/buyers/components/BuyerCard";
import { Building2 } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useBuyersQueryParams } from "@/features/admin/buyers/hooks/useBuyersQueryParams";
import BuyersFilters from "@/features/admin/buyers/components/BuyersFilters";
import Pagination from "@/features/shared/components/Pagination";

const BuyersPage = () => {
  const { query, setPage, setLimit } = useBuyersQueryParams();
  const { data, isLoading, isError, error } = useGetAllBuyers(query);

  const buyers = data?.data || [];
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
          title="Buyers"
          description="Manage system users and their permissions"
          buttonText="Add User"
          error={error?.message || "Failed to load buyers"}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1">
      {/* Page header */}
      <BuyerHeader totalBuyers={buyers.length} showActions={false} />
      {/* Filters */}
      <BuyersFilters />
      {/* Grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {buyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyers.map((buyer) => (
              <BuyerCard key={buyer._id} buyer={buyer} showActions={false} />
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

export default BuyersPage;
