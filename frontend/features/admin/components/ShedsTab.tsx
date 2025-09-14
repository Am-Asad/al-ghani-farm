"use client";
import React, { useState } from "react";
import { useGetAllSheds } from "../sheds/hooks/useGetAllSheds";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import { Building2 } from "lucide-react";
import DataNotFound from "@/features/shared/components/DataNotFound";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditShedForm from "../sheds/components/CreateEditShedForm";
import ShedCard from "../sheds/components/ShedCard";
import ShedsHeader from "../sheds/components/ShedHeader";

const ShedsTab = () => {
  const [search, setSearch] = useState("");
  const {
    data: shedsData,
    isLoading: shedsLoading,
    isError: shedsError,
    error: shedsErrorMsg,
  } = useGetAllSheds();

  const sheds = shedsData?.data || [];
  const filteredSheds = sheds.filter((shed) =>
    shed.name.toLowerCase().includes(search.toLowerCase())
  );

  if (shedsLoading) return <CardsSkeleton />;
  if (shedsError) {
    return (
      <ErrorFetchingData
        title="Sheds"
        description="Manage your sheds"
        buttonText="Add Shed"
        error={(shedsErrorMsg as Error)?.message || "Failed to load sheds"}
      />
    );
  }
  if (sheds.length === 0) {
    return (
      <DataNotFound title="sheds" icon={<Building2 className="w-10 h-10" />}>
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditShedForm />
        </RoleGuard>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <ShedsHeader
        search={search}
        setSearch={setSearch}
        totalSheds={sheds.length}
      />

      {filteredSheds.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default ShedsTab;
