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
import { useEffect, useMemo, useState } from "react";
import { useGetFlocksDropdown } from "@/features/admin/flocks/hooks/useGetFlocksDropdown";

type FlocksSelectProps = {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  farmId?: string;
  shedId?: string;
  popoverContentClassName?: string;
};

type FlockOption = { _id: string; name: string };

const FlocksSelect = ({
  label,
  className,
  value,
  onChange,
  placeholder,
  farmId,
  shedId,
  popoverContentClassName,
}: FlocksSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedFlockId, setSelectedFlockId] = useState<string>(value ?? "");
  const [selectedFlockName, setSelectedFlockName] = useState<string>("");

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (typeof value === "string") {
      setSelectedFlockId(value);
      // Clear the selected flock name if value is empty
      if (!value) {
        setSelectedFlockName("");
      }
    }
  }, [value]);

  // Note: Cascading behavior is handled by parent components
  // The parent clears the value prop when farmId/shedId changes, which triggers the useEffect above

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading, isFetching } = useGetFlocksDropdown({
    search: debouncedQuery,
    farmId: farmId || undefined,
    shedId: shedId || undefined,
    flockIds: selectedFlockId || undefined,
  });
  const flocks: FlockOption[] = useMemo(() => data?.data || [], [data]);

  // Update selected flock name when flocks data changes or when selectedFlockId changes
  useEffect(() => {
    if (selectedFlockId && flocks.length > 0) {
      const flock = flocks.find((f) => f._id === selectedFlockId);
      if (flock) {
        setSelectedFlockName(flock.name);
      }
    }
  }, [selectedFlockId, flocks]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <Label className="text-md font-medium">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedFlockName || placeholder || "Select flock..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-[200px] p-0", popoverContentClassName)}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search flock..."
              className="h-9"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && flocks.length === 0 ? (
                <CommandEmpty>No flocks found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                  </CommandItem>
                ) : (
                  flocks.map((flock) => (
                    <CommandItem
                      key={flock._id}
                      value={flock._id}
                      onSelect={(currentValue) => {
                        const next =
                          currentValue === selectedFlockId ? "" : currentValue;
                        setSelectedFlockId(next);
                        if (next) {
                          const selectedFlock = flocks.find(
                            (f) => f._id === next
                          );
                          setSelectedFlockName(selectedFlock?.name || "");
                        } else {
                          setSelectedFlockName("");
                        }
                        onChange?.(next);
                        setOpen(false);
                      }}
                    >
                      {flock.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedFlockId === flock._id
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

export default FlocksSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
