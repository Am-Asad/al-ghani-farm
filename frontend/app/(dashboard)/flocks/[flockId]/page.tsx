"use client";
import { Button } from "@/components/ui/button";
import FlockDetailsCard from "@/features/flocks/components/FlockDetailsCard";
import { useGetFlockById } from "@/features/flocks/hooks/useGetFlockById";
import ShedCard from "@/features/sheds/components/ShedCard";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFeatchingData from "@/features/shared/components/ErrorFetchingData";
import ShedHeader from "@/features/sheds/components/ShedHeader";
import { ArrowLeft, Building2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

const FlocksDetailsPage = () => {
  const { flockId } = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error } = useGetFlockById(
    flockId as string
  );

  const flock = data?.data;
  const sheds = flock?.sheds || [];

  const filteredSheds = sheds.filter((shed) =>
    shed.name.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFeatchingData
          title="Flock Details"
          description="Failed to load flock information"
          buttonText="Go Back"
          error={error?.message || "Failed to load flock details"}
        />
      </div>
    );
  }

  if (!flock) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="flock" icon={<Building2 className="w-10 h-10" />}>
          {/* <CreateEditFlockForm /> */}
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => router.back()} className="w-fit">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Flocks
      </Button>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <FlockDetailsCard flock={flock} />

        <ShedHeader
          search={search}
          setSearch={setSearch}
          totalSheds={sheds.length}
        />

        {/* Sheds grid */}
        {filteredSheds.length > 0 ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSheds.map((shed) => (
              <ShedCard key={shed._id} shed={shed} />
            ))}
          </div>
        ) : (
          <DataNotFound
            title="sheds"
            icon={<Building2 className="w-10 h-10" />}
          />
        )}
      </div>
    </div>
  );
};

export default FlocksDetailsPage;
