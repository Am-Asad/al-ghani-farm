"use client";

import React, { useState, useMemo, useEffect } from "react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";
import { useGetShedsDropdown } from "@/features/admin/sheds/hooks/useGetShedsDropdown";

type ShedsMultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of shed IDs
  onChange: (value: string) => void;
  placeholder?: string;
  farmId?: string; // Optional farm filter (can be comma-separated for multiple farms)
  popoverContentClassName?: string;
  maxDisplayItems?: number;
};

const ShedsMultiSelect = ({
  label = "Sheds",
  className,
  value,
  onChange,
  placeholder = "Select sheds...",
  farmId,
  popoverContentClassName,
  maxDisplayItems = 3,
}: ShedsMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Pass selected shed IDs to backend so they're always included in results
  const { data, isLoading, isFetching } = useGetShedsDropdown({
    search: debouncedQuery,
    farmId: farmId || undefined,
    shedIds: value, // Pass comma-separated selected IDs
  });

  const sheds: MultiSelectOption[] = useMemo(() => data?.data || [], [data]);

  return (
    <MultiSelect
      label={label}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search sheds..."
      emptyMessage="No sheds found."
      options={sheds}
      isLoading={isLoading}
      isFetching={isFetching}
      popoverContentClassName={popoverContentClassName}
      maxDisplayItems={maxDisplayItems}
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
};

export default ShedsMultiSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
