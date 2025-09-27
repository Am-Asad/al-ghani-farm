"use client";
import { useParams } from "next/navigation";
import React from "react";
import { Building2, ArrowLeft } from "lucide-react";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FarmDetailsCard from "@/features/admin/farms/components/FarmDetailsCard";
import { useGetFarmById } from "@/features/admin/farms/hooks/useGetFarmById";
import FarmReportDialog from "@/features/reports/farms/components/FarmReportDialog";

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
          description="Failed to load farm and ledger information"
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
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Header with Back button and Report button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Farms
        </Button>
        {farm && (
          <FarmReportDialog farmId={farm._id} farmName={farm.name}>
            <Button>Generate Reports</Button>
          </FarmReportDialog>
        )}
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <FarmDetailsCard farm={farm} />
      </div>
    </div>
  );
};

export default FarmDetailsPage;
