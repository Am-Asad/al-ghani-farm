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
import { useBuyersQueryParams } from "@/features/admin/buyers/hooks/useBuyersQueryParams";

const BuyersFilters = () => {
  const { search, sortBy, sortOrder, setFilters, reset } =
    useBuyersQueryParams();

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
    <div className="my-2 flex flex-wrap gap-2">
      <Searchbar
        search={pendingSearch}
        setSearch={setPendingSearch}
        placeholder="Search buyers..."
      />

      <Select
        value={pendingSortBy}
        onValueChange={(value) => setPendingSortBy(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`${sortBy} sort by`} />
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
        <SelectTrigger>
          <SelectValue placeholder={`${sortOrder} sort order`} />
        </SelectTrigger>
        <SelectContent>
          {sortOrderOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" variant={"outline"} onClick={handleApplyFilters}>
        Apply Filters
      </Button>
      <Button size="sm" variant={"outline"} onClick={handleResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};

export default BuyersFilters;

const sortByOptions = ["createdAt", "updatedAt"];
const sortOrderOptions = ["asc", "desc"];
