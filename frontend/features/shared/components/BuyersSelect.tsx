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
import { useGetBuyersDropdown } from "@/features/admin/buyers/hooks/useGetBuyersDropdown";

type BuyersSelectProps = {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  popoverContentClassName?: string;
};

type BuyerOption = { _id: string; name: string };

const BuyersSelect = ({
  label,
  className,
  value,
  onChange,
  placeholder,
  popoverContentClassName,
}: BuyersSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = useState("");
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(value ?? "");

  // Keep internal state in sync when controlled value changes
  useEffect(() => {
    if (typeof value === "string" && value !== selectedBuyerId)
      setSelectedBuyerId(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading, isFetching } = useGetBuyersDropdown({
    search: debouncedQuery,
    buyerIds: selectedBuyerId || undefined,
  });
  const buyers: BuyerOption[] = useMemo(() => data?.data || [], [data]);

  const selectedBuyerName = useMemo(() => {
    if (!selectedBuyerId) return "";
    return buyers.find((b) => b._id === selectedBuyerId)?.name || "";
  }, [selectedBuyerId, buyers]);

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
            {selectedBuyerName || placeholder || "Select buyer..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-[200px] p-0", popoverContentClassName)}
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search buyer..."
              className="h-9"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && buyers.length === 0 ? (
                <CommandEmpty>No buyers found.</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem>
                    <Loader2 className="animate-spin" />
                  </CommandItem>
                ) : (
                  buyers.map((buyer) => (
                    <CommandItem
                      key={buyer._id}
                      value={buyer._id}
                      onSelect={(currentValue) => {
                        const next =
                          currentValue === selectedBuyerId ? "" : currentValue;
                        setSelectedBuyerId(next);
                        onChange?.(next);
                        setOpen(false);
                      }}
                    >
                      {buyer.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedBuyerId === buyer._id
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

export default BuyersSelect;

// Simple debounce hook to delay rapid value changes
function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handle = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debounced;
}
