"use client";
import BuyerHeader from "@/features/buyers/components/BuyerHeader";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import React, { useState } from "react";
import { useGetAllBuyers } from "@/features/buyers/hooks/useGetAllBuyers";
import BuyerCard from "@/features/buyers/components/BuyerCard";
import { Building2 } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";

const BuyersPage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetAllBuyers();

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

  const buyers = data?.data || [];
  const filteredBuyers = buyers.filter((buyer) =>
    buyer.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <BuyerHeader
        search={search}
        setSearch={setSearch}
        totalBuyers={buyers.length}
      />

      {/* Users grid */}
      {filteredBuyers.length > 0 ? (
        <div className="flex-1 overflow-y-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuyers.map((buyer) => (
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
  );
};

export default BuyersPage;
