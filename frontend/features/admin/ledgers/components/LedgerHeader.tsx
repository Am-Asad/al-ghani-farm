import React from "react";

// remove the mb-4
const LedgerHeader = () => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-foreground">Ledgers</h1>
        <p className="text-muted-foreground">
          Manage system ledgers and their operations
        </p>
      </div>
    </div>
  );
};

export default LedgerHeader;
