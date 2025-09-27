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
import { useFarmQueryParams } from "@/features/admin/farms/hooks/useFarmQueryParams";

const FarmFilters = () => {
  const { search, sortBy, sortOrder, setFilters, reset } = useFarmQueryParams();

  // Local, unapplied state. Only push to URL on Apply.
  const [pendingSearch, setPendingSearch] = useState(search);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);

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

  const handleResetFilters = () => {
    reset();
    setPendingSearch("");
    setPendingSortBy("createdAt");
    setPendingSortOrder("desc");
  };
  const handleApplyFilters = () =>
    setFilters({
      search: pendingSearch,
      sortBy: pendingSortBy,
      sortOrder: pendingSortOrder,
    });

  return (
    <div className="space-y-4 p-4 bg-card border rounded-lg shadow-sm">
      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Searchbar
            search={pendingSearch}
            setSearch={setPendingSearch}
            placeholder="Search farms..."
          />
        </div>
      </div>

      {/* Sort and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">
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
            className="h-9 px-4 text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FarmFilters;

const sortByOptions = ["createdAt", "updatedAt"];
const sortOrderOptions = ["asc", "desc"];
