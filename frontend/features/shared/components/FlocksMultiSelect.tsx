"use client";

import React, { useState, useMemo, useEffect } from "react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";
import { useGetFlocksDropdown } from "@/features/admin/flocks/hooks/useGetFlocksDropdown";

type FlocksMultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of flock IDs
  onChange: (value: string) => void;
  placeholder?: string;
  farmId?: string; // Optional farm filter (can be comma-separated for multiple farms)
  shedId?: string; // Optional shed filter (can be comma-separated for multiple sheds)
  popoverContentClassName?: string;
  maxDisplayItems?: number;
};

const FlocksMultiSelect = ({
  label = "Flocks",
  className,
  value,
  onChange,
  placeholder = "Select flocks...",
  farmId,
  shedId,
  popoverContentClassName,
  maxDisplayItems = 3,
}: FlocksMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Don't pass flockId to dropdown hook to allow multi-selection
  // The dropdown should show all available flocks based on farm/shed filters, not just the selected ones
  const { data, isLoading, isFetching } = useGetFlocksDropdown({
    search: debouncedQuery,
    farmId: farmId || undefined,
    shedId: shedId || undefined,
    // flockId: undefined, // Removed to allow multi-selection
  });

  const flocks: MultiSelectOption[] = useMemo(() => data?.data || [], [data]);

  return (
    <MultiSelect
      label={label}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search flocks..."
      emptyMessage="No flocks found."
      options={flocks}
      isLoading={isLoading}
      isFetching={isFetching}
      popoverContentClassName={popoverContentClassName}
      maxDisplayItems={maxDisplayItems}
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
};

export default FlocksMultiSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
