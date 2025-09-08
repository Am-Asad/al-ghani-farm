import React from "react";
import { ParseResult } from "@/utils/csvParser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react";

type BulkDataPreviewProps<T> = {
  parseResult: ParseResult<T>;
  onUpload: () => void;
  isUploading: boolean;
  entityName: string;
  columns: Array<{
    key: keyof T;
    label: string;
  }>;
  onDownloadTemplate: () => void;
  templateHeaders: string[];
};

const BulkDataPreview = <T extends Record<string, unknown>>({
  parseResult,
  onUpload,
  isUploading,
  entityName,
  columns,
  onDownloadTemplate,
  templateHeaders,
}: BulkDataPreviewProps<T>) => {
  const { success, data, errors, totalRows, validRows, invalidRows } =
    parseResult;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            Parse Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Rows</p>
              <p className="font-medium">{totalRows}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Valid Rows</p>
              <p className="font-medium text-green-600">{validRows}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Invalid Rows</p>
              <p className="font-medium text-red-600">{invalidRows}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Success Rate</p>
              <p className="font-medium">
                {totalRows > 0 ? Math.round((validRows / totalRows) * 100) : 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors Display */}
      {errors && errors.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-red-800">Validation Errors:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li className="text-red-600">
                      ... and {errors.length - 5} more errors
                    </li>
                  )}
                </ul>
                <div className="mt-3 p-3 bg-red-100 rounded border border-red-200">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    💡 Helpful Tips:
                  </p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>
                      • Make sure your CSV has headers:{" "}
                      {templateHeaders.map((header, index) => (
                        <span key={header}>
                          <code className="bg-red-200 px-1 rounded">
                            {header}
                          </code>
                          {index < templateHeaders.length - 1 && ", "}
                        </span>
                      ))}
                    </li>
                    <li>• Download the template to see the correct format</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Preview Table */}
      {data && data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Preview Data ({data.length} {entityName}s)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    {columns.map((column) => (
                      <th
                        key={String(column.key)}
                        className="text-left p-2 font-medium"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((item, index) => (
                    <tr key={index} className="border-b">
                      {columns.map((column) => (
                        <td key={String(column.key)} className="p-2">
                          {String(item[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {data.length > 10 && (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="p-2 text-center text-muted-foreground"
                      >
                        ... and {data.length - 10} more {entityName}s
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {success && data && data.length > 0 ? (
          <Button onClick={onUpload} disabled={isUploading} className="flex-1">
            {isUploading
              ? `Creating ${entityName}s...`
              : `Create ${data.length} ${entityName}s`}
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Button
              variant="outline"
              onClick={onDownloadTemplate}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
            <Button variant="outline" disabled className="flex-1">
              No Valid Data to Upload
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkDataPreview;
