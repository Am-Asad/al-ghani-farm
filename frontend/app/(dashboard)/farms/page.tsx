"use client";

import { Building2 } from "lucide-react";
import FarmCard from "@/features/admin/farms/components/FarmCard";
import { useGetAllFarms } from "@/features/admin/farms/hooks/useGetAllFarms";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import FarmHeader from "@/features/admin/farms/components/FarmHeader";
import { useState } from "react";
import CreateEditFarmForm from "@/features/admin/farms/components/CreateEditFarmForm";

export default function FarmsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetAllFarms();

  const farms = data?.data || [];
  const filteredFarms = farms.filter((farm) =>
    farm.name.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Page header */}
      <FarmHeader
        search={search}
        setSearch={setSearch}
        totalFarms={farms.length}
      />

      {/* Farms grid */}
      {filteredFarms.length > 0 ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
}
