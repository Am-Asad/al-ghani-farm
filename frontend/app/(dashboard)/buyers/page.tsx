"use client";
import BuyerHeader from "@/features/admin/buyers/components/BuyerHeader";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import React from "react";
import { useGetAllBuyers } from "@/features/admin/buyers/hooks/useGetAllBuyers";
import BuyerCard from "@/features/admin/buyers/components/BuyerCard";
import { Building2 } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";

const BuyersPage = () => {
  const { data, isLoading, isError, error } = useGetAllBuyers();
  const buyers = data?.data || [];

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
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <BuyerHeader totalBuyers={buyers.length} showActions={false} />

      {/* Users grid */}
      <div className="flex-1 overflow-y-scroll">
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
    </div>
  );
};

export default BuyersPage;
