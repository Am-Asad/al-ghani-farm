import React, { useState } from "react";
import BulkUpload from "@/features/shared/components/BulkUpload";
import {
  buyerCSVConfig,
  buyerColumns,
  buyerTemplateHeaders,
  buyerSampleData,
  transformBuyerRecordsToAPI,
  BuyerRecord,
} from "../utils/buyerBulkConfig";
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

const CreateBulkBuyers = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Add Buyers in Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader>
          <DialogTitle>Add Buyers in Bulk</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create multiple buyers at once
          </DialogDescription>
        </DialogHeader>
        <BulkUpload<BuyerRecord>
          entityName="buyer"
          csvConfig={buyerCSVConfig}
          uploadConfig={{
            endpoint: "buyers",
            queryKey: [...queryKeys.buyers],
            transformData: transformBuyerRecordsToAPI,
            successMessage: (count) =>
              `Successfully created ${count} buyer${count > 1 ? "s" : ""}`,
            loadingMessage: "Creating buyers in bulk...",
            errorMessage: "Failed to create buyers",
          }}
          columns={buyerColumns}
          templateHeaders={buyerTemplateHeaders}
          sampleData={buyerSampleData}
          onSuccess={() => setIsOpen(false)}
          uploadTitle="Upload Buyer Data"
          uploadDescription="Upload a CSV or Excel file with buyer information"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkBuyers;
