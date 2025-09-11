"use client";

import React, { useState } from "react";
import BulkCreate from "@/features/shared/components/BulkCreate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  userCSVConfig,
  userColumns,
  userTemplateHeaders,
  userSampleData,
  transformUserRecordsToAPI,
} from "@/features/users/utils/userBulkConfig";
import { queryKeys } from "@/lib/query-client";

const CreateBulkUsers = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">
          <Upload className="w-4 h-4 mr-2" />
          Add Users in Bulk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl h-[90vh] max-h-fit overflow-y-auto flex flex-col gap-[16px]">
        <DialogHeader>
          <DialogTitle>Add Users in Bulk</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to create multiple users at once
          </DialogDescription>
        </DialogHeader>
        <BulkCreate
          entityName="user"
          csvConfig={userCSVConfig}
          uploadConfig={{
            endpoint: "users",
            queryKey: [...queryKeys.users],
            transformData: transformUserRecordsToAPI,
            loadingMessage: "Creating users in bulk...",
          }}
          columns={userColumns}
          templateHeaders={userTemplateHeaders}
          sampleData={userSampleData}
          onSuccess={() => setIsOpen(false)}
          uploadTitle="Upload User Data"
          uploadDescription="Upload a CSV or Excel file with user information"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBulkUsers;
