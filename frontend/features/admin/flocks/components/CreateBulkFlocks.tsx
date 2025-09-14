import React, { useState } from "react";
import BulkUpload from "@/features/shared/components/BulkUpload";
import {
  flockCSVConfig,
  flockColumns,
  flockTemplateHeaders,
  flockSampleData,
  transformFlockRecordsToAPI,
  FlockRecord,
} from "../utils/flockBulkConfig";
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

const CreateBulkFlocks = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Add Flocks in Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader>
          <DialogTitle>Add Flocks in Bulk</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create multiple flocks at once
          </DialogDescription>
        </DialogHeader>
        <BulkUpload<FlockRecord>
          entityName="flock"
          csvConfig={flockCSVConfig}
          uploadConfig={{
            endpoint: "flocks",
            queryKey: [...queryKeys.flocks],
            transformData: transformFlockRecordsToAPI,
            successMessage: (count) =>
              `Successfully created ${count} flock${count > 1 ? "s" : ""}`,
            loadingMessage: "Creating flocks in bulk...",
            errorMessage: "Failed to create flocks",
          }}
          columns={flockColumns}
          templateHeaders={flockTemplateHeaders}
          sampleData={flockSampleData}
          onSuccess={() => setIsOpen(false)}
          uploadTitle="Upload Flock Data"
          uploadDescription="Upload a CSV or Excel file with flock information"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkFlocks;
