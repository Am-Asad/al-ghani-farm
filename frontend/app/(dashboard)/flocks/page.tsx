"use client";
import { useGetAllFlocks } from "@/features/admin/flocks/hooks/useGetAllFlocks";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import CreateEditFlockForm from "@/features/admin/flocks/components/CreateEditFlockForm";
import { Building2 } from "lucide-react";
import React, { useState } from "react";
import FlockCard from "@/features/admin/flocks/components/FlockCard";
import FlockHeader from "@/features/admin/flocks/components/FlockHeader";

const FlocksPage = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetAllFlocks();

  const flocks = data?.data || [];
  const filteredFlocks = flocks.filter((flock) =>
    flock.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Flocks"
          description="Manage your flocks"
          buttonText="Add Flock"
          error={error?.message || "Failed to load flocks"}
        />
      </div>
    );
  }

  if (flocks.length === 0) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="flocks" icon={<Building2 className="w-10 h-10" />}>
          <CreateEditFlockForm />
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1">
      {/* Page header */}
      <FlockHeader totalFlocks={flocks.length} showActions={false} />

      {/* Users grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {filteredFlocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlocks.map((flock) => (
              <FlockCard key={flock._id} flock={flock} showActions={false} />
            ))}
          </div>
        ) : (
          <DataNotFound
            title="flocks"
            icon={<Building2 className="w-10 h-10" />}
          />
        )}
      </div>
    </div>
  );
};

export default FlocksPage;
