"use client";

import * as React from "react";
import { useState, useMemo, useEffect, useRef } from "react";
import MultiSelect, { MultiSelectOption } from "./MultiSelect";

// Generic entity option type
type EntityOption = { _id: string; name: string };

// Hook function type for fetching data
type FetchHook<T extends Record<string, unknown>> = (params: T) => {
  data?: { data: EntityOption[] };
  isLoading: boolean;
  isFetching: boolean;
};

// Base props for all entity multi-selects
type BaseEntityMultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of IDs
  onChange: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
  maxDisplayItems?: number;
};

// Specific props for different entity types
type FarmsMultiSelectProps = BaseEntityMultiSelectProps & {
  entityType: "farms";
  fetchHook: FetchHook<{ search: string; farmIds?: string }>;
};

type ShedsMultiSelectProps = BaseEntityMultiSelectProps & {
  entityType: "sheds";
  fetchHook: FetchHook<{ search: string; farmId?: string; shedIds?: string }>;
  farmId?: string; // Cascading dependency
};

type FlocksMultiSelectProps = BaseEntityMultiSelectProps & {
  entityType: "flocks";
  fetchHook: FetchHook<{
    search: string;
    farmId?: string;
    shedId?: string;
    flockIds?: string;
  }>;
  farmId?: string; // Cascading dependency
  shedId?: string; // Cascading dependency
};

type BuyersMultiSelectProps = BaseEntityMultiSelectProps & {
  entityType: "buyers";
  fetchHook: FetchHook<{ search: string; buyerIds?: string }>;
};

// Union type for all entity multi-select props
type EntityMultiSelectProps =
  | FarmsMultiSelectProps
  | ShedsMultiSelectProps
  | FlocksMultiSelectProps
  | BuyersMultiSelectProps;

const EntityMultiSelect = (props: EntityMultiSelectProps) => {
  const {
    label,
    className,
    value,
    onChange,
    placeholder,
    popoverContentClassName,
    maxDisplayItems = 3,
    entityType,
    fetchHook,
  } = props;

  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Track previous values for cascading dependency logic
  const prevFarmIdRef = useRef<string | undefined>(undefined);
  const prevShedIdRef = useRef<string | undefined>(undefined);

  // Parse the comma-separated value into an array of IDs
  useEffect(() => {
    if (!value) {
      setSelectedIds([]);
    } else {
      setSelectedIds(value.split(",").filter(Boolean));
    }
  }, [value]);

  const debouncedQuery = useDebouncedValue(query, 300);

  // Build fetch parameters based on entity type and cascading dependencies
  const fetchParams = useMemo(() => {
    const baseParams = {
      search: debouncedQuery,
    };

    switch (entityType) {
      case "farms":
        return {
          ...baseParams,
          farmIds: value || undefined,
        };

      case "sheds":
        return {
          ...baseParams,
          farmId: props.farmId || undefined,
          shedIds: value || undefined,
        };

      case "flocks":
        return {
          ...baseParams,
          farmId: props.farmId || undefined,
          shedId: props.shedId || undefined,
          flockIds: value || undefined,
        };

      case "buyers":
        return {
          ...baseParams,
          buyerIds: value || undefined,
        };

      default:
        return baseParams;
    }
  }, [entityType, debouncedQuery, value, props]);

  const { data, isLoading, isFetching } = fetchHook(fetchParams);
  const entities: MultiSelectOption[] = useMemo(() => data?.data || [], [data]);

  // Handle cascading dependencies - clear selection when dependencies change
  // Only clear when dependencies are explicitly changed, not when they're undefined
  useEffect(() => {
    if (entityType === "sheds" && "farmId" in props) {
      const currentFarmId = props.farmId;
      const prevFarmId = prevFarmIdRef.current;

      // Only clear shed selection if farmId was previously set and is now different
      // This allows independent shed selection when no farm is selected
      if (prevFarmId !== undefined && prevFarmId !== currentFarmId) {
        onChange("");
      }

      // Update the ref for next comparison
      prevFarmIdRef.current = currentFarmId;
    } else if (
      entityType === "flocks" &&
      "farmId" in props &&
      "shedId" in props
    ) {
      const currentFarmId = props.farmId;
      const currentShedId = props.shedId;
      const prevFarmId = prevFarmIdRef.current;
      const prevShedId = prevShedIdRef.current;

      // Only clear flock selection if farmId or shedId was previously set and is now different
      // This allows independent flock selection when no farm/shed is selected
      if (
        (prevFarmId !== undefined && prevFarmId !== currentFarmId) ||
        (prevShedId !== undefined && prevShedId !== currentShedId)
      ) {
        onChange("");
      }

      // Update the refs for next comparison
      prevFarmIdRef.current = currentFarmId;
      prevShedIdRef.current = currentShedId;
    }
  }, [entityType, props, onChange]);

  const getDefaultPlaceholder = () => {
    switch (entityType) {
      case "farms":
        return "Select farms...";
      case "sheds":
        return "Select sheds...";
      case "flocks":
        return "Select flocks...";
      case "buyers":
        return "Select buyers...";
      default:
        return "Select items...";
    }
  };

  const getSearchPlaceholder = () => {
    switch (entityType) {
      case "farms":
        return "Search farms...";
      case "sheds":
        return "Search sheds...";
      case "flocks":
        return "Search flocks...";
      case "buyers":
        return "Search buyers...";
      default:
        return "Search...";
    }
  };

  const getEmptyMessage = () => {
    switch (entityType) {
      case "farms":
        return "No farms found.";
      case "sheds":
        return "No sheds found.";
      case "flocks":
        return "No flocks found.";
      case "buyers":
        return "No buyers found.";
      default:
        return "No items found.";
    }
  };

  return (
    <MultiSelect
      label={label}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder || getDefaultPlaceholder()}
      searchPlaceholder={getSearchPlaceholder()}
      emptyMessage={getEmptyMessage()}
      options={entities}
      isLoading={isLoading}
      isFetching={isFetching}
      popoverContentClassName={popoverContentClassName}
      maxDisplayItems={maxDisplayItems}
      searchValue={query}
      onSearchChange={setQuery}
    />
  );
};

export default EntityMultiSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}

// Export types for external use
export type { EntityOption, EntityMultiSelectProps, FetchHook };
