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
import { useGetFarmsDropdown } from "@/features/admin/farms/hooks/useGetFarmsDropdown";
import { useEffect, useMemo, useState } from "react";

type FarmsSelectProps = {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
};

type FarmOption = { _id: string; name: string };

const FarmsSelect = ({
  label,
  className,
  value,
  onChange,
  placeholder,
  popoverContentClassName,
}: FarmsSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedFarmId, setSelectedFarmId] = useState<string>(value ?? "");
  const [selectedFarmName, setSelectedFarmName] = useState<string>("");

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (typeof value === "string") {
      setSelectedFarmId(value);
      // Clear the selected farm name if value is empty
      if (!value) {
        setSelectedFarmName("");
      }
    }
  }, [value]);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading, isFetching } = useGetFarmsDropdown({
    search: debouncedQuery,
    farmIds: selectedFarmId || undefined,
  });
  const farms: FarmOption[] = useMemo(() => data?.data || [], [data]);

  // Update selected farm name when farms data changes or when selectedFarmId changes
  useEffect(() => {
    if (selectedFarmId && farms.length > 0) {
      const farm = farms.find((f) => f._id === selectedFarmId);
      if (farm) {
        setSelectedFarmName(farm.name);
      }
    }
  }, [selectedFarmId, farms]);

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
            {selectedFarmName || placeholder || "Select farm..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-full p-0", popoverContentClassName)}>
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search farm..."
              className="h-9"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && farms.length === 0 ? (
                <CommandEmpty>No farms found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                  </CommandItem>
                ) : (
                  farms.map((farm) => (
                    <CommandItem
                      key={farm._id}
                      value={farm._id}
                      onSelect={(currentValue) => {
                        const next =
                          currentValue === selectedFarmId ? "" : currentValue;
                        setSelectedFarmId(next);
                        if (next) {
                          const selectedFarm = farms.find(
                            (f) => f._id === next
                          );
                          setSelectedFarmName(selectedFarm?.name || "");
                        } else {
                          setSelectedFarmName("");
                        }
                        onChange?.(next);
                        setOpen(false);
                      }}
                    >
                      {farm.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedFarmId === farm._id
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

export default FarmsSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
