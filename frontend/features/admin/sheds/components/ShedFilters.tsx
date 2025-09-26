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
import { useShedQueryParams } from "@/features/admin/sheds/hooks/useShedQueryParams";
import EntitiesSelect from "@/features/shared/components/FarmsSelect";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const ShedFilters = () => {
  const {
    search,
    sortBy,
    sortOrder,
    farmId,
    capacityMin,
    capacityMax,
    dateFrom,
    dateTo,
    setFilters,
    reset,
  } = useShedQueryParams();

  // Local, unapplied state. Only push to URL on Apply.
  const [pendingSearch, setPendingSearch] = useState(search);
  const [pendingFarmId, setPendingFarmId] = useState(farmId);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);
  const [pendingCapacityMin, setPendingCapacityMin] = useState(
    capacityMin ?? ""
  );
  const [pendingCapacityMax, setPendingCapacityMax] = useState(
    capacityMax ?? ""
  );
  const [pendingDateFrom, setPendingDateFrom] = useState(dateFrom ?? "");
  const [pendingDateTo, setPendingDateTo] = useState(dateTo ?? "");

  // Sync local state with URL changes (back/forward or external updates)
  useEffect(() => {
    setPendingSearch(search);
  }, [search]);
  useEffect(() => {
    setPendingFarmId(farmId);
  }, [farmId]);
  useEffect(() => {
    setPendingSortBy(sortBy);
  }, [sortBy]);
  useEffect(() => {
    setPendingSortOrder(sortOrder);
  }, [sortOrder]);
  useEffect(() => {
    setPendingCapacityMin(capacityMin ?? "");
  }, [capacityMin]);
  useEffect(() => {
    setPendingCapacityMax(capacityMax ?? "");
  }, [capacityMax]);
  useEffect(() => {
    setPendingDateFrom(dateFrom ?? "");
  }, [dateFrom]);
  useEffect(() => {
    setPendingDateTo(dateTo ?? "");
  }, [dateTo]);

  const handleResetFilters = () => {
    reset();
    setPendingSearch("");
    setPendingFarmId(farmId);
    setPendingSortBy("createdAt");
    setPendingSortOrder("desc");
    setPendingCapacityMin("");
    setPendingCapacityMax("");
    setPendingDateFrom("");
    setPendingDateTo("");
  };
  const handleApplyFilters = () =>
    setFilters({
      search: pendingSearch,
      farmId: pendingFarmId,
      sortBy: pendingSortBy,
      sortOrder: pendingSortOrder,
      capacityMin: pendingCapacityMin,
      capacityMax: pendingCapacityMax,
      dateFrom: pendingDateFrom,
      dateTo: pendingDateTo,
    });

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Search and Farm Selection Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Searchbar
            search={pendingSearch}
            setSearch={setPendingSearch}
            placeholder="Search sheds..."
          />
        </div>
        <div className="w-full sm:w-64">
          <EntitiesSelect
            value={pendingFarmId}
            onChange={setPendingFarmId}
            placeholder="Select farm..."
          />
        </div>
      </div>

      {/* Capacity Range Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Capacity:
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={pendingCapacityMin}
              onChange={(e) => setPendingCapacityMin(e.target.value)}
              placeholder="Min"
              className="w-20 h-9"
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingCapacityMax}
              onChange={(e) => setPendingCapacityMax(e.target.value)}
              placeholder="Max"
              className="w-20 h-9"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Date Range:
          </label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal h-9 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pendingDateFrom ? (
                    <span className="text-xs">
                      {format(new Date(pendingDateFrom), "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    pendingDateFrom ? new Date(pendingDateFrom) : undefined
                  }
                  onSelect={(value) => {
                    const date = value as Date | undefined;
                    const fromStr = date ? format(date, "yyyy-MM-dd") : "";
                    setPendingDateFrom(fromStr);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal h-9 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pendingDateTo ? (
                    <span className="text-xs">
                      {format(new Date(pendingDateTo), "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">To</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pendingDateTo ? new Date(pendingDateTo) : undefined}
                  onSelect={(value) => {
                    const date = value as Date | undefined;
                    const toStr = date ? format(date, "yyyy-MM-dd") : "";
                    setPendingDateTo(toStr);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Sort and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Sort by:
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={pendingSortBy}
              onValueChange={(value) => setPendingSortBy(value)}
            >
              <SelectTrigger className="w-32 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={pendingSortOrder}
              onValueChange={(value) => setPendingSortOrder(value)}
            >
              <SelectTrigger className="w-20 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOrderOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleApplyFilters}
            className="h-9 px-4"
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetFilters}
            className="h-9 px-4 text-gray-600 hover:text-gray-900"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShedFilters;

const sortByOptions = ["createdAt", "updatedAt"];
const sortOrderOptions = ["asc", "desc"];
