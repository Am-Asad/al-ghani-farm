import React from "react";
import BulkUpload from "@/features/shared/components/BulkUpload";
import {
  farmCSVConfig,
  farmColumns,
  farmTemplateHeaders,
  farmSampleData,
  transformFarmRecordsToAPI,
  FarmRecord,
} from "../utils/farmBulkConfig";
import { queryKeys } from "@/lib/query-client";

type CreateBulkFarmProps = {
  onSuccess?: () => void;
};

const CreateBulkFarm = ({ onSuccess }: CreateBulkFarmProps) => {
  return (
    <BulkUpload<FarmRecord>
      entityName="farm"
      csvConfig={farmCSVConfig}
      uploadConfig={{
        endpoint: "farms",
        queryKey: [...queryKeys.farms],
        transformData: transformFarmRecordsToAPI,
        successMessage: (count) =>
          `Successfully created ${count} farm${count > 1 ? "s" : ""}`,
        loadingMessage: "Creating farms in bulk...",
        errorMessage: "Failed to create farms",
      }}
      columns={farmColumns}
      templateHeaders={farmTemplateHeaders}
      sampleData={farmSampleData}
      onSuccess={onSuccess}
      uploadTitle="Upload Farm Data"
      uploadDescription="Upload a CSV or Excel file with farm information"
    />
  );
};

export default CreateBulkFarm;
