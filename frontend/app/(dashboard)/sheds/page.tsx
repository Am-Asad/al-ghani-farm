"use client";
import ShedCard from "@/features/admin/sheds/components/ShedCard";
import ShedsHeader from "@/features/admin/sheds/components/ShedHeader";
import { useGetAllSheds } from "@/features/admin/sheds/hooks/useGetAllSheds";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import { Building2 } from "lucide-react";
import React from "react";
import CreateEditShedForm from "@/features/admin/sheds/components/CreateEditShedForm";

const ShedsPage = () => {
  const { data, isLoading, isError, error } = useGetAllSheds();
  const sheds = data?.data || [];

  if (isLoading) {
    return <CardsSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <ErrorFetchingData
          title="Sheds"
          description="Manage your sheds"
          buttonText="Add User"
          error={error?.message || "Failed to load sheds"}
        />
      </div>
    );
  }

  if (sheds.length === 0) {
    return (
      <div className="p-6 overflow-hidden flex flex-col flex-1 space-y-6">
        <DataNotFound title="sheds" icon={<Building2 className="w-10 h-10" />}>
          <CreateEditShedForm />
        </DataNotFound>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-hidden flex flex-col flex-1">
      {/* Page header */}
      <ShedsHeader totalSheds={sheds.length} showActions={false} />

      {/* Users grid */}
      <div className="flex-1 overflow-y-scroll pb-1">
        {sheds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sheds.map((shed) => (
              <ShedCard key={shed._id} shed={shed} showActions={false} />
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

export default ShedsPage;
