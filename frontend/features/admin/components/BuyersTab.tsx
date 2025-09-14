"use client";
import React, { useState } from "react";
import { useGetAllBuyers } from "../buyers/hooks/useGetAllBuyers";
import CreateEditBuyerForm from "../buyers/components/CreateEditBuyerForm";
import RoleGuard from "@/features/shared/components/RoleGuard";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Building2 } from "lucide-react";
import ErrorFeatchingData from "@/features/shared/components/ErrorFetchingData";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import BuyersHeader from "../buyers/components/BuyerHeader";
import BuyerCard from "../buyers/components/BuyerCard";

const BuyersTab = () => {
  const [search, setSearch] = useState("");
  const {
    data: buyersData,
    isLoading: buyersLoading,
    isError: buyersError,
    error: buyersErrorMsg,
  } = useGetAllBuyers();

  const buyers = buyersData?.data || [];
  const filteredBuyers = buyers.filter((buyer) =>
    buyer.name.toLowerCase().includes(search.toLowerCase())
  );

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
  if (buyers.length === 0) {
    return (
      <DataNotFound title="buyers" icon={<Building2 className="w-10 h-10" />}>
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditBuyerForm />
        </RoleGuard>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <BuyersHeader
        search={search}
        setSearch={setSearch}
        totalBuyers={buyers.length}
      />

      {filteredBuyers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default BuyersTab;
