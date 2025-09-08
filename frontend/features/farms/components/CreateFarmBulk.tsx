"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { parseCSVFile, ParseResult } from "@/utils/csv-parser";
import {
  useCreateBulkFarms,
  convertFarmRecordsToAPI,
} from "../hooks/useCreateBulkFarms";
import FarmDataPreview from "./FarmDataPreview";
import { toast } from "sonner";
import { validateFileType } from "@/utils/validateFileType";
import { getFileIcon } from "@/utils/getFileIcon";

type CreateFarmBulkProps = {
  onSuccess?: () => void;
};

const CreateFarmBulk = ({ onSuccess: _onSuccess }: CreateFarmBulkProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createBulkFarms, isPending } = useCreateBulkFarms();

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    const isValidFileType = validateFileType(file as File);
    if (file && isValidFileType) {
      setSelectedFile(file);
      setIsParsing(true);

      try {
        const result = await parseCSVFile(file);
        setParseResult(result);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
        setParseResult(null);
      } finally {
        setIsParsing(false);
      }
    } else {
      toast.error("Please select a valid CSV or Excel file");
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleBulkUpload = async () => {
    if (!parseResult?.data) return;

    try {
      const farmsData = convertFarmRecordsToAPI(parseResult.data);
      await createBulkFarms(farmsData);

      // Reset form on success
      handleRemoveFile();
      _onSuccess?.();
    } catch (error) {
      console.error("Error creating farms:", error);
    }
  };

  return (
    <div className="space-y-4">
      {!selectedFile && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload Farm Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a CSV or Excel file with farm information
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />

          <Button
            variant="outline"
            className="mb-4"
            onClick={handleChooseFile}
            disabled={isParsing}
          >
            <FileText className="w-4 h-4 mr-2" />
            {isParsing ? "Parsing..." : "Choose File"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      )}

      {/* File Preview */}
      {selectedFile && (
        <div className="border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile.name)}
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Data Preview and Upload */}
      {parseResult && (
        <FarmDataPreview
          parseResult={parseResult}
          onUpload={handleBulkUpload}
          isUploading={isPending}
        />
      )}
    </div>
  );
};

export default CreateFarmBulk;
