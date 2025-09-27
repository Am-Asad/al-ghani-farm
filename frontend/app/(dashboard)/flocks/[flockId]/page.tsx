"use client";
import { Button } from "@/components/ui/button";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { ArrowLeft, Building2, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useGetFlockById } from "@/features/admin/flocks/hooks/useGetFlockById";
import FlockReportDialog from "@/features/reports/flocks/components/FlockReportDialog";
import FlockDetailsCard from "@/features/admin/flocks/components/FlockDetailsCard";

const FlocksDetailsPage = () => {
  const router = useRouter();
  const { flockId } = useParams();
  const { data, isLoading, isError, error } = useGetFlockById(
    flockId as string
  );
  const flock = data?.data;

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Flock Details"
          description="Failed to load flock details"
          buttonText="Go Back"
          error={error?.message || "Failed to load flock details"}
        />
      </div>
    );
  }

  if (!flock) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound
          title="flock"
          icon={<Building2 className="w-10 h-10" />}
        />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Header with Back button and Report button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flocks
        </Button>

        {flock && (
          <FlockReportDialog flockId={flock._id} flockName={flock.name}>
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Reports
            </Button>
          </FlockReportDialog>
        )}
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <FlockDetailsCard flock={flock} />
      </div>
    </div>
  );
};

export default FlocksDetailsPage;
