"use client";
import CreateEditFarmForm from "@/features/admin/farms/components/CreateEditFarmForm";
import FarmCard from "@/features/admin/farms/components/FarmCard";
import FarmHeader from "@/features/admin/farms/components/FarmHeader";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useGetAllFarms";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { Building2 } from "lucide-react";
import React, { useState } from "react";

const FarmsTab = () => {
  const [search, setSearch] = useState("");
  const {
    data: farmsData,
    isLoading: farmsLoading,
    isError: farmsError,
    error: farmsErrorMsg,
  } = useGetAllFarms();

  const farms = farmsData?.data || [];
  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(search.toLowerCase())
  );

  if (farmsLoading) return <CardsSkeleton />;
  if (farmsError) {
    return (
      <ErrorFetchingData
        title="Farms"
        description="Manage your farms"
        buttonText="Add Farm"
        error={(farmsErrorMsg as Error)?.message || "Failed to load farms"}
      />
    );
  }
  if (farms.length === 0) {
    return (
      <DataNotFound title="farms" icon={<Building2 className="w-10 h-10" />}>
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditFarmForm />
        </RoleGuard>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <FarmHeader
        search={search}
        setSearch={setSearch}
        totalFarms={farms.length}
      />

      {filteredFarms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard key={farm._id} farm={farm} />
          ))}
        </div>
      ) : (
        <DataNotFound
          title="farms"
          icon={<Building2 className="w-10 h-10" />}
        />
      )}
    </div>
  );
};

export default FarmsTab;
