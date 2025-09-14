import Searchbar from "@/features/shared/components/Searchbar";
import React from "react";
import RoleGuard from "@/features/shared/components/RoleGuard";
import CreateEditLedgerForm from "./CreateEditLedgerForm";

type LedgerHeaderProps = {
  search: string;
  setSearch: (search: string) => void;
};

const LedgerHeader = ({ search, setSearch }: LedgerHeaderProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ledgers</h1>
          <p className="text-muted-foreground">
            Manage system ledgers and their operations
          </p>
        </div>
        <Searchbar
          search={search}
          setSearch={setSearch}
          placeholder="Search ledgers "
        />
      </div>

      <div className="flex-1 flex gap-2 flex-wrap">
        <RoleGuard requiredRole={["admin", "manager"]}>
          <CreateEditLedgerForm />
        </RoleGuard>
      </div>
    </div>
  );
};

export default LedgerHeader;
