"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type MultiSelectOption = {
  _id: string;
  name: string;
};

type MultiSelectProps = {
  label?: string;
  className?: string;
  value: string; // Comma-separated string of IDs
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: MultiSelectOption[];
  isLoading?: boolean;
  isFetching?: boolean;
  popoverContentClassName?: string;
  maxDisplayItems?: number;
  // Search props
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const MultiSelect = ({
  label,
  className,
  value,
  onChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  options,
  isLoading = false,
  isFetching = false,
  popoverContentClassName,
  maxDisplayItems = 3,
  searchValue,
  onSearchChange,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");

  // Use external search value if provided, otherwise use internal state
  const query = searchValue !== undefined ? searchValue : internalQuery;
  const setQuery = onSearchChange || setInternalQuery;

  // Parse the comma-separated value into an array of IDs
  const selectedIds = useMemo(() => {
    if (!value) return [];
    return value.split(",").filter(Boolean);
  }, [value]);

  // Get selected options
  const selectedOptions = useMemo(() => {
    return options.filter((option) => selectedIds.includes(option._id));
  }, [options, selectedIds]);

  // Use options directly since server handles filtering
  const filteredOptions = options;

  const handleSelect = (optionId: string) => {
    const newSelectedIds = selectedIds.includes(optionId)
      ? selectedIds.filter((id) => id !== optionId)
      : [...selectedIds, optionId];

    onChange(newSelectedIds.join(","));
  };

  const handleRemove = (optionId: string) => {
    const newSelectedIds = selectedIds.filter((id) => id !== optionId);
    onChange(newSelectedIds.join(","));
  };

  const handleClearAll = () => {
    onChange("");
  };

  // Display text for the trigger button
  const displayText = useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;
    if (selectedOptions.length <= maxDisplayItems) {
      return selectedOptions.map((option) => option.name).join(", ");
    }
    return `${selectedOptions.length} items selected`;
  }, [selectedOptions, placeholder, maxDisplayItems]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-10 h-auto"
          >
            <span className="truncate text-left flex-1">{displayText}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-full p-0", popoverContentClassName)}
          align="start"
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {!isLoading && !isFetching && filteredOptions.length === 0 ? (
                <CommandEmpty>{emptyMessage}</CommandEmpty>
              ) : null}
              <CommandGroup>
                {isLoading || isFetching ? (
                  <CommandItem disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </CommandItem>
                ) : (
                  filteredOptions.map((option) => (
                    <CommandItem
                      key={option._id}
                      value={option._id}
                      onSelect={() => handleSelect(option._id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedIds.includes(option._id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected items display */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedOptions.map((option) => (
            <Badge
              key={option._id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              <span className="truncate max-w-[120px]">{option.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemove(option._id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {selectedOptions.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleClearAll}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
