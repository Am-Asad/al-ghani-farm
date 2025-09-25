"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type SharedPaginationProps = {
  page: number;
  limit: number;
  hasMore: boolean;
  onChangePage: (page: number) => void;
  onChangeLimit: (limit: number) => void;
  limitOptions?: string[];
};

const DEFAULT_LIMIT_OPTIONS = ["1", "2", "5", "10", "20", "30", "50", "100"];

const Pagination = ({
  page,
  limit,
  hasMore,
  onChangePage,
  onChangeLimit,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
}: SharedPaginationProps) => {
  const handleLimitChange = (value: string) => onChangeLimit(Number(value));
  const handleGoPrevious = () => page > 1 && onChangePage(page - 1);
  const handleGoNext = () => hasMore && onChangePage(page + 1);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Label>Items Per Page:</Label>
        <Select value={String(limit)} onValueChange={handleLimitChange}>
          <SelectTrigger>
            <SelectValue placeholder={`${limit} items per page`} />
          </SelectTrigger>
          <SelectContent>
            {limitOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page === 1}
          onClick={handleGoPrevious}
        >
          <ChevronLeft />
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!hasMore}
          onClick={handleGoNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
