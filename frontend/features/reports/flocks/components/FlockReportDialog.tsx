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
import { useGetFlockDailyReport } from "../hooks/useGetFlockDailyReport";
import { useGetFlockOverallReport } from "../hooks/useGetFlockOverallReport";
import FlockDailyReport from "./FlockDailyReport";
import FlockOverallReport from "./FlockOverallReport";
import {
  FlockDailyReport as FlockDailyReportType,
  FlockOverallReport as FlockOverallReportType,
} from "@/types";

type FlockReportDialogProps = {
  flockId: string;
  flockName: string;
  children: React.ReactNode;
};

const FlockReportDialog = ({
  flockId,
  flockName,
  children,
}: FlockReportDialogProps) => {
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
  } = useGetFlockDailyReport({
    flockId,
    date: selectedDate,
    enabled: isOpen,
  });

  // Overall report query
  const {
    data: overallReport,
    isLoading: isOverallLoading,
    isError: isOverallError,
    error: overallError,
  } = useGetFlockOverallReport({
    flockId,
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] mx-auto min-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports for {flockName}
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

            <FlockDailyReport
              report={dailyReport as FlockDailyReportType}
              isLoading={isDailyLoading}
              isError={isDailyError}
              error={dailyError?.message || "Failed to load daily report"}
            />
          </TabsContent>

          <TabsContent value="overall" className="space-y-4">
            <FlockOverallReport
              report={overallReport as FlockOverallReportType}
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

export default FlockReportDialog;
