"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Searchbar from "@/features/shared/components/Searchbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Filter, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { useReportQueryParams } from "../hooks/useReportQueryParams";

const ReportFilters = () => {
  const {
    search,
    sortBy,
    sortOrder,
    duration,
    date,
    startDate,
    endDate,
    period,
    paymentStatus,
    includeDetails,
    setFilters,
    reset,
  } = useReportQueryParams();

  // Local, unapplied state. Only push to URL on Apply.
  const [pendingSearch, setPendingSearch] = useState(search);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);
  const [pendingDuration, setPendingDuration] = useState(duration);
  const [pendingDate, setPendingDate] = useState(
    date || (duration === "daily" ? format(new Date(), "yyyy-MM-dd") : "")
  );
  const [pendingStartDate, setPendingStartDate] = useState(startDate);
  const [pendingEndDate, setPendingEndDate] = useState(endDate);
  const [pendingPeriod, setPendingPeriod] = useState(period);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState(
    paymentStatus || "all"
  );
  const [pendingIncludeDetails, setPendingIncludeDetails] =
    useState(includeDetails);

  // Sync local state with URL changes (back/forward or external updates)
  useEffect(() => {
    setPendingSearch(search);
  }, [search]);
  useEffect(() => {
    setPendingSortBy(sortBy);
  }, [sortBy]);
  useEffect(() => {
    setPendingSortOrder(sortOrder);
  }, [sortOrder]);
  useEffect(() => {
    setPendingDuration(duration);
  }, [duration]);
  useEffect(() => {
    setPendingDate(date);
  }, [date]);
  useEffect(() => {
    setPendingStartDate(startDate);
  }, [startDate]);
  useEffect(() => {
    setPendingEndDate(endDate);
  }, [endDate]);
  useEffect(() => {
    setPendingPeriod(period);
  }, [period]);
  useEffect(() => {
    setPendingPaymentStatus(paymentStatus || "all");
  }, [paymentStatus]);
  useEffect(() => {
    setPendingIncludeDetails(includeDetails);
  }, [includeDetails]);

  const handleApplyFilters = () => {
    // Auto-set today's date for daily reports if no date is provided
    let finalDate = pendingDate;
    if (pendingDuration === "daily" && !pendingDate) {
      finalDate = format(new Date(), "yyyy-MM-dd");
    }

    const filtersToApply = {
      search: pendingSearch,
      sortBy: pendingSortBy,
      sortOrder: pendingSortOrder,
      duration: pendingDuration,
      date: finalDate,
      startDate: pendingStartDate,
      endDate: pendingEndDate,
      period: pendingPeriod,
      paymentStatus: pendingPaymentStatus,
      includeDetails: pendingIncludeDetails,
    };

    setFilters(filtersToApply);
  };

  const handleReset = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    setPendingSearch("");
    setPendingSortBy("date");
    setPendingSortOrder("desc");
    setPendingDuration("daily");
    setPendingDate(today); // Set today's date as default for daily reports
    setPendingStartDate("");
    setPendingEndDate("");
    setPendingPeriod("");
    setPendingPaymentStatus("all");
    setPendingIncludeDetails("true");
    reset();
  };

  const isCustomRange = pendingDuration === "custom";
  const isPeriodRange = pendingDuration === "period";
  const needsSpecificDate = ["daily", "weekly", "monthly", "yearly"].includes(
    pendingDuration
  );

  // Validation logic
  const isFormValid = () => {
    if (pendingDuration === "daily" && !pendingDate) return false;
    if (pendingDuration === "custom" && (!pendingStartDate || !pendingEndDate))
      return false;
    if (pendingDuration === "period" && !pendingPeriod) return false;
    return true;
  };

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg shadow-sm">
      {/* Search and Duration Selection Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Searchbar
            search={pendingSearch}
            setSearch={setPendingSearch}
            placeholder="Search reports..."
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={pendingDuration} onValueChange={setPendingDuration}>
            <SelectTrigger>
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
              <SelectItem value="period">Last N Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date Selection Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Specific Date for daily/weekly/monthly/yearly */}
        {needsSpecificDate && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              Date{pendingDuration === "daily" ? " *" : ""}:
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal h-9 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pendingDate ? (
                    <span className="text-xs">
                      {format(new Date(pendingDate), "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Select date
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pendingDate ? new Date(pendingDate) : undefined}
                  onSelect={(value) => {
                    const date = value as Date | undefined;
                    const dateStr = date ? format(date, "yyyy-MM-dd") : "";
                    setPendingDate(dateStr);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
            {pendingDuration === "daily" && !pendingDate && (
              <span className="text-xs text-muted-foreground">
                (Required for daily reports)
              </span>
            )}
          </div>
        )}

        {/* Custom Date Range */}
        {isCustomRange && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                From:
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-normal h-9 min-w-[140px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pendingStartDate ? (
                      <span className="text-xs">
                        {format(new Date(pendingStartDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Start date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      pendingStartDate ? new Date(pendingStartDate) : undefined
                    }
                    onSelect={(value) => {
                      const date = value as Date | undefined;
                      const dateStr = date ? format(date, "yyyy-MM-dd") : "";
                      setPendingStartDate(dateStr);
                    }}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                To:
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start text-left font-normal h-9 min-w-[140px]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pendingEndDate ? (
                      <span className="text-xs">
                        {format(new Date(pendingEndDate), "MMM d, yyyy")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        End date
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      pendingEndDate ? new Date(pendingEndDate) : undefined
                    }
                    onSelect={(value) => {
                      const date = value as Date | undefined;
                      const dateStr = date ? format(date, "yyyy-MM-dd") : "";
                      setPendingEndDate(dateStr);
                    }}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Period Input for Last N Days */}
        {isPeriodRange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              Last:
            </label>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingPeriod}
              onChange={(e) => setPendingPeriod(e.target.value)}
              placeholder="Days"
              className="w-20 h-9"
              min="1"
            />
            <span className="text-sm text-muted-foreground">days</span>
          </div>
        )}
      </div>

      {/* Advanced Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <Select
            value={pendingPaymentStatus}
            onValueChange={setPendingPaymentStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-48">
          <Select value={pendingSortBy} onValueChange={setPendingSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="totalAmount">Total Amount</SelectItem>
              <SelectItem value="amountPaid">Amount Paid</SelectItem>
              <SelectItem value="netWeight">Net Weight</SelectItem>
              <SelectItem value="numberOfBirds">Number of Birds</SelectItem>
              <SelectItem value="rate">Rate</SelectItem>
              <SelectItem value="vehicleNumber">Vehicle Number</SelectItem>
              <SelectItem value="driverName">Driver Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-32">
          <Select value={pendingSortOrder} onValueChange={setPendingSortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleApplyFilters}
            size="sm"
            className="h-8"
            disabled={!isFormValid()}
          >
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="h-8"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            Include Details:
          </label>
          <Select
            value={pendingIncludeDetails}
            onValueChange={setPendingIncludeDetails}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
