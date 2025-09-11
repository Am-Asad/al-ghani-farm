import React, { useState } from "react";
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
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const CreateBulkFarms = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Add Farms in Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader>
          <DialogTitle>Add Farms in Bulk</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create multiple farms at once
          </DialogDescription>
        </DialogHeader>
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
          onSuccess={() => setIsOpen(false)}
          uploadTitle="Upload Farm Data"
          uploadDescription="Upload a CSV or Excel file with farm information"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkFarms;
