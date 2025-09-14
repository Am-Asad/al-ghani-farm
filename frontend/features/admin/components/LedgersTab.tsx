"use client";
import { useGetAllLedgers } from "@/features/admin/ledgers/hooks/useGetAllLedgers";
import CardsSkeleton from "@/features/shared/components/CardsSkeleton";
import DataNotFound from "@/features/shared/components/DataNotFound";
import ErrorFetchingData from "@/features/shared/components/ErrorFetchingData";
import RoleGuard from "@/features/shared/components/RoleGuard";
import { Building2 } from "lucide-react";
import React, { useState } from "react";
import CreateEditLedgerForm from "../ledgers/components/CreateEditLedgerForm";
import LedgerHeader from "../ledgers/components/LedgerHeader";
import LedgerCard from "../ledgers/components/LedgerCard";

const LedgersTab = () => {
  const [search, setSearch] = useState("");
  const {
    data: ledgersData,
    isLoading: ledgersLoading,
    isError: ledgersError,
    error: ledgersErrorMsg,
  } = useGetAllLedgers();
  console.log("🚀 ~ LedgersTab ~ ledgersData:", ledgersData);

  const ledgers = ledgersData?.data || [];

  const filteredLedgers = ledgers.filter((ledger) =>
    ledger.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  );

  if (ledgersLoading) return <CardsSkeleton />;
  if (ledgersError) {
    return (
      <ErrorFetchingData
        title="Ledgers"
        description="Manage your ledgers"
        buttonText="Add Ledger"
        error={(ledgersErrorMsg as Error)?.message || "Failed to load ledgers"}
      />
    );
  }
  if (ledgers.length === 0) {
    return (
      <DataNotFound title="ledgers" icon={<Building2 className="w-10 h-10" />}>
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditLedgerForm />
        </RoleGuard>
      </DataNotFound>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <LedgerHeader search={search} setSearch={setSearch} />

      {filteredLedgers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLedgers.map((ledger) => (
            <LedgerCard key={ledger._id} ledger={ledger} />
          ))}
        </div>
      ) : (
        <DataNotFound
          title="ledgers"
          icon={<Building2 className="w-10 h-10" />}
        />
      )}
    </div>
  );
};

export default LedgersTab;
