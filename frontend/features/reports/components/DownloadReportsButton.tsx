"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileType,
} from "lucide-react";
import { api } from "@/lib/api";
import { ReportQueryParams } from "@/features/reports/hooks/useReportQueryParams";
import { buildExportParams } from "@/features/reports/utils/buildExportParams";
import { toast } from "sonner";

type Props = {
  query: ReportQueryParams;
  disabled?: boolean;
};

const DownloadReportsButton = ({ query, disabled }: Props) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const params = useMemo(() => buildExportParams(query), [query]);

  const triggerDownload = useCallback(
    async (format: "csv" | "excel" | "pdf" | "json") => {
      try {
        setDownloading(format);
        const response = await api.get(`/reports/universal/export`, {
          params: { ...params, format },
          responseType: "blob",
        });

        // Resolve filename from header or fallback
        const cd = response.headers["content-disposition"] as
          | string
          | undefined;
        const filenameMatch = cd?.match(/filename="?([^";]+)"?/i);
        const fallbackName = `reports-${new Date()
          .toISOString()
          .replace(/[:.]/g, "-")}.${format === "excel" ? "xlsx" : format}`;
        const filename = filenameMatch?.[1] || fallbackName;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`Downloading ${filename}`);
      } catch (error) {
        toast.error("Failed to export report");
      } finally {
        setDownloading(null);
      }
    },
    [params]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          disabled={disabled || !!downloading}
        >
          <Download className="mr-2 h-4 w-4" />
          {downloading ? `Exporting ${downloading.toUpperCase()}...` : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Export as</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => triggerDownload("csv")}
          disabled={downloading !== null}
        >
          <FileText className="mr-2 h-4 w-4" /> CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => triggerDownload("excel")}
          disabled={downloading !== null}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => triggerDownload("pdf")}
          disabled={downloading !== null}
        >
          <FileType className="mr-2 h-4 w-4" /> PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => triggerDownload("json")}
          disabled={downloading !== null}
        >
          <FileJson className="mr-2 h-4 w-4" /> JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DownloadReportsButton };
