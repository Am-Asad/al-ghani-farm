import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, FileText } from "lucide-react";
import { useGetShedDailyReport } from "../hooks/useGetShedDailyReport";
import { useGetShedOverallReport } from "../hooks/useGetShedOverallReport";
import ShedDailyReport from "./ShedDailyReport";
import ShedOverallReport from "./ShedOverallReport";
import {
  ShedDailyReport as ShedDailyReportType,
  ShedOverallReport as ShedOverallReportType,
} from "@/types";

type ShedReportDialogProps = {
  shedId: string;
  shedName: string;
  children: React.ReactNode;
};

const ShedReportDialog = ({
  shedId,
  shedName,
  children,
}: ShedReportDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Daily report query
  const {
    data: dailyReport,
    isLoading: isDailyLoading,
    isError: isDailyError,
    error: dailyError,
  } = useGetShedDailyReport({
    shedId,
    date: selectedDate,
    enabled: isOpen,
  });

  // Overall report query
  const {
    data: overallReport,
    isLoading: isOverallLoading,
    isError: isOverallError,
    error: overallError,
  } = useGetShedOverallReport({
    shedId,
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] mx-auto min-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports for {shedName}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Daily Report
            </TabsTrigger>
            <TabsTrigger value="overall" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overall Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>

            <ShedDailyReport
              report={dailyReport as ShedDailyReportType}
              isLoading={isDailyLoading}
              isError={isDailyError}
              error={dailyError?.message || "Failed to load daily report"}
            />
          </TabsContent>

          <TabsContent value="overall" className="space-y-4">
            <ShedOverallReport
              report={overallReport as ShedOverallReportType}
              isLoading={isOverallLoading}
              isError={isOverallError}
              error={overallError?.message || "Failed to load overall report"}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShedReportDialog;
