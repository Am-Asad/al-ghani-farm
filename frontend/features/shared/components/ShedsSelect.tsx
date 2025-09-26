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
import { useGetShedsDropdown } from "@/features/admin/sheds/hooks/useGetShedsDropdown";

type ShedsSelectProps = {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  farmId?: string; // optional: constrain by farm when provided
};

type ShedOption = { _id: string; name: string };

const ShedsSelect = ({
  label,
  className,
  value,
  onChange,
  placeholder,
  farmId,
}: ShedsSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedShedId, setSelectedShedId] = useState<string>(value ?? "");

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (typeof value === "string" && value !== selectedShedId)
      setSelectedShedId(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading, isFetching } = useGetShedsDropdown({
    search: debouncedQuery,
    farmId: farmId || undefined,
    shedId: selectedShedId || undefined,
  });
  const sheds: ShedOption[] = useMemo(() => data?.data || [], [data]);

  const selectedShedName = useMemo(() => {
    if (!selectedShedId) return "";
    return sheds.find((s) => s._id === selectedShedId)?.name || "";
  }, [selectedShedId, sheds]);

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
            {selectedShedName || placeholder || "Select shed..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={farmId ? "Search shed..." : "Search shed..."}
              className="h-9"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && sheds.length === 0 ? (
                <CommandEmpty>No sheds found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                  </CommandItem>
                ) : (
                  sheds.map((shed) => (
                    <CommandItem
                      key={shed._id}
                      value={shed._id}
                      onSelect={(currentValue) => {
                        const next =
                          currentValue === selectedShedId ? "" : currentValue;
                        setSelectedShedId(next);
                        onChange?.(next);
                        setOpen(false);
                      }}
                    >
                      {shed.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedShedId === shed._id
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

export default ShedsSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
