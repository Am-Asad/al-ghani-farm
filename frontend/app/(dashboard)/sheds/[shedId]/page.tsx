"use client";
import { Button } from "@/components/ui/button";
import { useGetShedById } from "@/features/admin/sheds/hooks/useGetShedById";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { ArrowLeft, Building2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ShedDetailsCard from "@/features/admin/sheds/components/ShedDetailsCard";
// import ShedReportDialog from "@/features/reports/sheds/components/ShedReportDialog";

const ShedDetailsPage = () => {
  const router = useRouter();
  const { shedId } = useParams();
  const { data, isLoading, isError, error } = useGetShedById(shedId as string);
  const shed = data?.data;

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Shed Details"
          description="Failed to load shed details"
          buttonText="Go Back"
          error={error?.message || "Failed to load shed details"}
        />
      </div>
    );
  }

  if (!shed) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="shed" icon={<Building2 className="w-10 h-10" />} />
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
      {/* Header with Back button and Report button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="w-fit">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sheds
        </Button>

        {/* {shed && (
          <ShedReportDialog shedId={shed._id} shedName={shed.name}>
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Reports
            </Button>
          </ShedReportDialog>
        )} */}
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <ShedDetailsCard shed={shed} />
      </div>
    </div>
  );
};

export default ShedDetailsPage;
