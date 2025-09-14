"use client";
import { useGetBuyerById } from "@/features/admin/buyers/hooks/useGetBuyerById";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import DataNotFound from "@/features/shared/components/DataNotFound";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { ArrowLeft, Building2, FileText } from "lucide-react";
import BuyerDetailsCard from "@/features/admin/buyers/components/BuyerDetailsCard";
import { Button } from "@/components/ui/button";
import { useGetAllLedgers } from "@/features/ledgers/hooks/useGetAllLedgers";
import LedgersTable from "@/features/ledgers/components/LedgersTable";
import BuyerReportDialog from "@/features/reports/buyers/components/BuyerReportDialog";

const BuyerDetailsPage = () => {
  const router = useRouter();
  const { buyerId } = useParams();
  const { data, isLoading, isError, error } = useGetBuyerById(
    buyerId as string
  );
  const {
    data: ledgersData,
    isLoading: isLedgersLoading,
    isError: isLedgersError,
    error: ledgersError,
  } = useGetAllLedgers({
    buyerId: buyerId as string,
  });

  const buyer = data?.data;
  const ledgers = ledgersData?.data || [];

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Buyer Details"
          description="Failed to load buyer details"
          buttonText="Go Back"
          error={error?.message || "Failed to load buyer details"}
        />
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound
          title="buyer"
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
          Back to Buyers
        </Button>

        {buyer && (
          <BuyerReportDialog buyerId={buyer._id} buyerName={buyer.name}>
            <Button className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generate Reports
            </Button>
          </BuyerReportDialog>
        )}
      </div>

      <div className="flex flex-col gap-6 flex-1 overflow-y-scroll">
        <BuyerDetailsCard buyer={buyer} />
        <LedgersTable
          ledgers={ledgers}
          isLoading={isLedgersLoading}
          isError={isLedgersError}
          error={ledgersError?.message || "Failed to load ledgers"}
        />
      </div>
    </div>
  );
};

export default BuyerDetailsPage;
