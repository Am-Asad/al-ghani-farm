"use client";

import React, { useState, useMemo, useEffect } from "react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";
import { useGetFarmsDropdown } from "@/features/admin/farms/hooks/useGetFarmsDropdown";

type FarmsMultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of farm IDs
  onChange: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
  maxDisplayItems?: number;
};

const FarmsMultiSelect = ({
  label = "Farms",
  className,
  value,
  onChange,
  placeholder = "Select farms...",
  popoverContentClassName,
  maxDisplayItems = 3,
}: FarmsMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Pass selected farm IDs to backend so they're always included in results
  const { data, isLoading, isFetching } = useGetFarmsDropdown({
    search: debouncedQuery,
    farmIds: value, // Pass comma-separated selected IDs
  });

  const farms: MultiSelectOption[] = useMemo(() => data?.data || [], [data]);

  return (
    <MultiSelect
      label={label}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search farms..."
      emptyMessage="No farms found."
      options={farms}
      isLoading={isLoading}
      isFetching={isFetching}
      popoverContentClassName={popoverContentClassName}
      maxDisplayItems={maxDisplayItems}
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
};

export default FarmsMultiSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
