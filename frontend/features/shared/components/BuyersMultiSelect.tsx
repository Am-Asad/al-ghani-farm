"use client";

import React, { useState, useMemo, useEffect } from "react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";
import { useGetBuyersDropdown } from "@/features/admin/buyers/hooks/useGetBuyersDropdown";

type BuyersMultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of buyer IDs
  onChange: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
  maxDisplayItems?: number;
};

const BuyersMultiSelect = ({
  label = "Buyers",
  className,
  value,
  onChange,
  placeholder = "Select buyers...",
  popoverContentClassName,
  maxDisplayItems = 3,
}: BuyersMultiSelectProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Don't pass buyerId to dropdown hook to allow multi-selection
  // The dropdown should show all available buyers, not just the selected ones
  const { data, isLoading, isFetching } = useGetBuyersDropdown({
    search: debouncedQuery,
    // buyerId: undefined, // Removed to allow multi-selection
  });

  const buyers: MultiSelectOption[] = useMemo(() => data?.data || [], [data]);

  return (
    <MultiSelect
      label={label}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder="Search buyers..."
      emptyMessage="No buyers found."
      options={buyers}
      isLoading={isLoading}
      isFetching={isFetching}
      popoverContentClassName={popoverContentClassName}
      maxDisplayItems={maxDisplayItems}
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
};

export default BuyersMultiSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
