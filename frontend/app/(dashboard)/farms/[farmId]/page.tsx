"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Building2, Users, ArrowLeft } from "lucide-react";
import FlockCard from "@/features/flocks/components/FlockCard";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FarmDetailsCard from "@/features/farms/components/FarmDetailsCard";
import FlockHeader from "@/features/flocks/components/FlockHeader";
import { useGetFarmById } from "@/features/farms/hooks/useGetFarmById";
import CreateEditFlockForm from "@/features/flocks/components/CreateEditFlockForm";

const FarmDetailsPage = () => {
  const { farmId } = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetFarmById(farmId as string);

  const farm = data?.data;
  const flocks = data?.data?.flocks || [];

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
          title="Farm Details"
          description="Failed to load farm and flock information"
          buttonText="Go Back"
          error={error?.message || "Failed to load farm details"}
        />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="farm" icon={<Building2 className="w-10 h-10" />}>
          <CreateEditFlockForm />
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Farms
      </Button>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <FarmDetailsCard farm={farm} />

        <FlockHeader
          search={search}
          setSearch={setSearch}
          totalFlocks={flocks.length}
        />

        {/* Flocks grid */}
        {filteredFlocks.length > 0 ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlocks.map((flock) => (
              <FlockCard key={flock._id} flock={flock} />
            ))}
          </div>
        ) : (
          <DataNotFound title="flocks" icon={<Users className="w-10 h-10" />} />
        )}
      </div>
    </div>
  );
};

export default FarmDetailsPage;
