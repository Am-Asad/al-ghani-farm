import React, { useState } from "react";
import BulkUpload from "@/features/shared/components/BulkUpload";
import {
  shedCSVConfig,
  shedColumns,
  shedTemplateHeaders,
  shedSampleData,
  transformShedRecordsToAPI,
  ShedRecord,
} from "../utils/shedBulkConfig";
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

const CreateBulkSheds = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Add Sheds in Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader>
          <DialogTitle>Add Sheds in Bulk</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create multiple sheds at once
          </DialogDescription>
        </DialogHeader>
        <BulkUpload<ShedRecord>
          entityName="shed"
          csvConfig={shedCSVConfig}
          uploadConfig={{
            endpoint: "sheds",
            queryKey: [...queryKeys.sheds],
            transformData: transformShedRecordsToAPI,
            successMessage: (count) =>
              `Successfully created ${count} shed${count > 1 ? "s" : ""}`,
            loadingMessage: "Creating sheds in bulk...",
            errorMessage: "Failed to create sheds",
          }}
          columns={shedColumns}
          templateHeaders={shedTemplateHeaders}
          sampleData={shedSampleData}
          onSuccess={() => setIsOpen(false)}
          uploadTitle="Upload Shed Data"
          uploadDescription="Upload a CSV or Excel file with shed information"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkSheds;
