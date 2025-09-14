"use client";
import CreateEditFlockForm from "@/features/admin/flocks/components/CreateEditFlockForm";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useGetAllFlocks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import RoleGuard from "@/features/shared/components/RoleGuard";
import React, { useState } from "react";
import { Building2 } from "lucide-react";
import FlockHeader from "@/features/admin/flocks/components/FlockHeader";
import FlockCard from "@/features/admin/flocks/components/FlockCard";

const FlocksTab = () => {
  const [search, setSearch] = useState("");
  const {
    data: flocksData,
    isLoading: flocksLoading,
    isError: flocksError,
    error: flocksErrorMsg,
  } = useGetAllFlocks();

  const flocks = flocksData?.data || [];
  const filteredFlocks = flocks.filter((flock) =>
    flock.name.toLowerCase().includes(search.toLowerCase())
  );

  if (flocksLoading) return <CardsSkeleton />;
  if (flocksError) {
    return (
      <ErrorFetchingData
        title="Flocks"
        description="Manage your flocks"
        buttonText="Add Flock"
        error={(flocksErrorMsg as Error)?.message || "Failed to load flocks"}
      />
    );
  }
  if (flocks.length === 0) {
    return (
      <DataNotFound title="flocks" icon={<Building2 className="w-10 h-10" />}>
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditFlockForm />
        </RoleGuard>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <FlockHeader
        search={search}
        setSearch={setSearch}
        totalFlocks={flocks.length}
      />

      {filteredFlocks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFlocks.map((flock) => (
            <FlockCard key={flock._id} flock={flock} />
          ))}
        </div>
      ) : (
        <DataNotFound
          title="flocks"
          icon={<Building2 className="w-10 h-10" />}
        />
      )}
    </div>
  );
};

export default FlocksTab;
