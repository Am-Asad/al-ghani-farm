"use client";

import React from "react";
import BulkUpload from "./BulkUpload";
import type { CSVConfig } from "@/utils/csvParser";

export type BulkCreateUploadConfig<T, R = T> = {
  endpoint: string;
  queryKey: string[];
  transformData?: (data: T[]) => R[];
  successMessage?: (count: number) => string;
  errorMessage?: string;
  loadingMessage?: string;
};

export type BulkCreateProps<T extends Record<string, unknown>, R = T> = {
  entityName: string;
  csvConfig: CSVConfig<T>;
  uploadConfig: BulkCreateUploadConfig<T, R>;
  columns: Array<{ key: keyof T; label: string }>;
  templateHeaders: string[];
  sampleData: string[];
  onSuccess?: () => void;
  uploadTitle?: string;
  uploadDescription?: string;
};

const BulkCreate = <T extends Record<string, unknown>, R = T>({
  entityName,
  csvConfig,
  uploadConfig,
  columns,
  templateHeaders,
  sampleData,
  onSuccess,
  uploadTitle,
  uploadDescription,
}: BulkCreateProps<T, R>) => {
  return (
    <BulkUpload<T, R>
      entityName={entityName}
      csvConfig={csvConfig}
      uploadConfig={{
        endpoint: uploadConfig.endpoint,
        queryKey: uploadConfig.queryKey,
        transformData: uploadConfig.transformData,
        successMessage: uploadConfig.successMessage,
        errorMessage: uploadConfig.errorMessage,
        loadingMessage: uploadConfig.loadingMessage,
      }}
      columns={columns}
      templateHeaders={templateHeaders}
      sampleData={sampleData}
      onSuccess={onSuccess}
      uploadTitle={uploadTitle}
      uploadDescription={uploadDescription}
    />
  );
};

export default BulkCreate;
