"use client";
import { useGetFarmById } from "@/features/admin/farms/hooks/useGetFarmById";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import FarmDetailsCard from "@/features/admin/farms/components/FarmDetailsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FarmSheds from "@/features/admin/farms/components/FarmSheds";
import FarmFlocks from "@/features/admin/farms/components/FarmFlocks";
import FarmLedgers from "@/features/admin/farms/components/FarmLedgers";

const FarmDetailsPage = () => {
  const router = useRouter();
  const { farmId } = useParams();
  const { data, isLoading, isError, error } = useGetFarmById(farmId as string);
  const farm = data?.data;

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Farm Details"
          description="Failed to load farm details"
          buttonText="Go Back"
          error={error?.message || "Failed to load farm details"}
        />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="farm" icon={<Building2 className="w-10 h-10" />} />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-scroll flex flex-col flex-1 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Farms
        </Button>
      </div>

      <div className="flex flex-col gap-6 flex-1">
        <FarmDetailsCard farm={farm} />

        {/* Tabs for Sheds, Flocks, and Ledgers */}
        <Tabs defaultValue="sheds" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sheds">Sheds</TabsTrigger>
            <TabsTrigger value="flocks">Flocks</TabsTrigger>
            <TabsTrigger value="ledgers">Ledgers</TabsTrigger>
          </TabsList>

          <TabsContent value="sheds" className="mt-6">
            <FarmSheds farmId={farmId as string} />
          </TabsContent>

          <TabsContent value="flocks" className="mt-6">
            <FarmFlocks farmId={farmId as string} />
          </TabsContent>

          <TabsContent value="ledgers" className="mt-6">
            <FarmLedgers farmId={farmId as string} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmDetailsPage;
