"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useEffect, useMemo, useState, useRef } from "react";

// Generic entity option type
type EntityOption = { _id: string; name: string };

// Hook function type for fetching data
type FetchHook<T extends Record<string, unknown>> = (params: T) => {
  data?: { data: EntityOption[] };
  isLoading: boolean;
  isFetching: boolean;
};

// Base props for all entity selects
type BaseEntitySelectProps = {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
  width?: string;
  disabled?: boolean;
};

// Specific props for different entity types
type FarmsSelectProps = BaseEntitySelectProps & {
  entityType: "farms";
  fetchHook: FetchHook<{ search: string; farmIds?: string }>;
};

type ShedsSelectProps = BaseEntitySelectProps & {
  entityType: "sheds";
  fetchHook: FetchHook<{ search: string; farmId?: string; shedIds?: string }>;
  farmId?: string; // Cascading dependency
};

type FlocksSelectProps = BaseEntitySelectProps & {
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

type BuyersSelectProps = BaseEntitySelectProps & {
  entityType: "buyers";
  fetchHook: FetchHook<{ search: string; buyerIds?: string }>;
};

// Union type for all entity select props
type EntitySelectProps =
  | FarmsSelectProps
  | ShedsSelectProps
  | FlocksSelectProps
  | BuyersSelectProps;

const EntitySelect = (props: EntitySelectProps) => {
  const {
    label,
    className,
    value,
    onChange,
    placeholder,
    popoverContentClassName,
    width = "w-[200px]",
    disabled = false,
    entityType,
    fetchHook,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>(value ?? "");
  const [selectedName, setSelectedName] = useState<string>("");

  // Track previous values for cascading dependency logic
  const prevFarmIdRef = useRef<string | undefined>(undefined);
  const prevShedIdRef = useRef<string | undefined>(undefined);

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (typeof value === "string") {
      setSelectedId(value);
      // Clear the selected name if value is empty
      if (!value) {
        setSelectedName("");
      }
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
          farmIds: selectedId || undefined,
        };

      case "sheds":
        return {
          ...baseParams,
          farmId: props.farmId || undefined,
          shedIds: selectedId || undefined,
        };

      case "flocks":
        return {
          ...baseParams,
          farmId: props.farmId || undefined,
          shedId: props.shedId || undefined,
          flockIds: selectedId || undefined,
        };

      case "buyers":
        return {
          ...baseParams,
          buyerIds: selectedId || undefined,
        };

      default:
        return baseParams;
    }
  }, [entityType, debouncedQuery, selectedId, props]);

  const { data, isLoading, isFetching } = fetchHook(fetchParams);
  const entities: EntityOption[] = useMemo(() => data?.data || [], [data]);

  // Update selected name when entities data changes or when selectedId changes
  useEffect(() => {
    if (selectedId && entities.length > 0) {
      const entity = entities.find((e) => e._id === selectedId);
      if (entity) {
        setSelectedName(entity.name);
      }
    }
  }, [selectedId, entities]);

  // Handle cascading dependencies - clear selection when dependencies change
  // Only clear when dependencies are explicitly changed, not when they're undefined
  useEffect(() => {
    if (entityType === "sheds" && "farmId" in props) {
      const currentFarmId = props.farmId;
      const prevFarmId = prevFarmIdRef.current;

      // Only clear shed selection if farmId was previously set and is now different
      // This allows independent shed selection when no farm is selected
      if (prevFarmId !== undefined && prevFarmId !== currentFarmId) {
        setSelectedId("");
        setSelectedName("");
        onChange?.("");
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
        setSelectedId("");
        setSelectedName("");
        onChange?.("");
      }

      // Update the refs for next comparison
      prevFarmIdRef.current = currentFarmId;
      prevShedIdRef.current = currentShedId;
    }
  }, [entityType, props, onChange]);

  const getDefaultPlaceholder = () => {
    switch (entityType) {
      case "farms":
        return "Select farm...";
      case "sheds":
        return "Select shed...";
      case "flocks":
        return "Select flock...";
      case "buyers":
        return "Select buyer...";
      default:
        return "Select...";
    }
  };

  const getSearchPlaceholder = () => {
    switch (entityType) {
      case "farms":
        return "Search farm...";
      case "sheds":
        return "Search shed...";
      case "flocks":
        return "Search flock...";
      case "buyers":
        return "Search buyer...";
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
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-md font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(width, "justify-between")}
            disabled={disabled}
          >
            {selectedName || placeholder || getDefaultPlaceholder()}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn(width, "p-0", popoverContentClassName)}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={getSearchPlaceholder()}
              className="h-9"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && entities.length === 0 ? (
                <CommandEmpty>{getEmptyMessage()}</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                  </CommandItem>
                ) : (
                  entities.map((entity) => (
                    <CommandItem
                      key={entity._id}
                      value={entity._id}
                      onSelect={(currentValue) => {
                        const next =
                          currentValue === selectedId ? "" : currentValue;
                        setSelectedId(next);
                        if (next) {
                          const selectedEntity = entities.find(
                            (e) => e._id === next
                          );
                          setSelectedName(selectedEntity?.name || "");
                        } else {
                          setSelectedName("");
                        }
                        onChange?.(next);
                        setOpen(false);
                      }}
                    >
                      {entity.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedId === entity._id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EntitySelect;

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
export type { EntityOption, EntitySelectProps, FetchHook };
