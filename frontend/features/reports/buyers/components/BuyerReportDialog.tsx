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
import { useGetBuyerDailyReport } from "../hooks/useGetBuyerDailyReport";
import { useGetBuyerOverallReport } from "../hooks/useGetBuyerOverallReport";
import BuyerDailyReport from "./BuyerDailyReport";
import BuyerOverallReport from "./BuyerOverallReport";
import {
  BuyerDailyReport as BuyerDailyReportType,
  BuyerOverallReport as BuyerOverallReportType,
} from "@/types";

type BuyerReportDialogProps = {
  buyerId: string;
  buyerName: string;
  children: React.ReactNode;
};

const BuyerReportDialog = ({
  buyerId,
  buyerName,
  children,
}: BuyerReportDialogProps) => {
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
  } = useGetBuyerDailyReport({
    buyerId,
    date: selectedDate,
    enabled: isOpen,
  });

  // Overall report query
  const {
    data: overallReport,
    isLoading: isOverallLoading,
    isError: isOverallError,
    error: overallError,
  } = useGetBuyerOverallReport({
    buyerId,
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] mx-auto min-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reports for {buyerName}
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

            <BuyerDailyReport
              report={dailyReport as BuyerDailyReportType}
              isLoading={isDailyLoading}
              isError={isDailyError}
              error={dailyError?.message || "Failed to load daily report"}
            />
          </TabsContent>

          <TabsContent value="overall" className="space-y-4">
            <BuyerOverallReport
              report={overallReport as BuyerOverallReportType}
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

export default BuyerReportDialog;
