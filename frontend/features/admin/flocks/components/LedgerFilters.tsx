"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Searchbar from "@/features/shared/components/Searchbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FarmsSelect from "@/features/shared/components/FarmsSelect";
import ShedsSelect from "@/features/shared/components/ShedsSelect";
import BuyersSelect from "@/features/shared/components/BuyersSelect";
import FlocksSelect from "@/features/shared/components/FlocksSelect";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useLedgerQueryParams } from "../../ledgers/hooks/useLedgerQueryParams";

const LedgerFilters = () => {
  const {
    search,
    sortBy,
    sortOrder,
    farmId,
    status,
    paymentStatus,
    dateFrom,
    dateTo,
    totalAmountMin,
    totalAmountMax,
    amountPaidMin,
    amountPaidMax,
    balanceMin,
    balanceMax,
    netWeightMin,
    netWeightMax,
    flockId,
    shedId,
    buyerId,
    setFilters,
    reset,
  } = useLedgerQueryParams();

  const [pendingSearch, setPendingSearch] = useState(search);
  const [pendingFarmId, setPendingFarmId] = useState(farmId);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);
  const [pendingStatus, setPendingStatus] = useState(status);
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState<
    "" | "paid" | "partial" | "unpaid"
  >(paymentStatus ?? "");
  const [pendingDateFrom, setPendingDateFrom] = useState(dateFrom ?? "");
  const [pendingDateTo, setPendingDateTo] = useState(dateTo ?? "");
  const [pendingFlockId, setPendingFlockId] = useState(flockId ?? "");
  const [pendingShedId, setPendingShedId] = useState(shedId ?? "");
  const [pendingBuyerId, setPendingBuyerId] = useState(buyerId ?? "");

  const [pendingTotalAmountMin, setPendingTotalAmountMin] = useState(
    totalAmountMin ?? ""
  );
  const [pendingTotalAmountMax, setPendingTotalAmountMax] = useState(
    totalAmountMax ?? ""
  );
  const [pendingAmountPaidMin, setPendingAmountPaidMin] = useState(
    amountPaidMin ?? ""
  );
  const [pendingAmountPaidMax, setPendingAmountPaidMax] = useState(
    amountPaidMax ?? ""
  );
  const [pendingBalanceMin, setPendingBalanceMin] = useState(balanceMin ?? "");
  const [pendingBalanceMax, setPendingBalanceMax] = useState(balanceMax ?? "");

  const [pendingNetWeightMin, setPendingNetWeightMin] = useState(
    netWeightMin ?? ""
  );
  const [pendingNetWeightMax, setPendingNetWeightMax] = useState(
    netWeightMax ?? ""
  );

  useEffect(() => {
    setPendingSearch(search);
  }, [search]);
  useEffect(() => {
    setPendingFarmId(farmId);
  }, [farmId]);
  useEffect(() => {
    setPendingSortBy(sortBy);
  }, [sortBy]);
  useEffect(() => {
    setPendingSortOrder(sortOrder);
  }, [sortOrder]);
  useEffect(() => {
    setPendingStatus(status);
  }, [status]);
  useEffect(() => {
    setPendingPaymentStatus(paymentStatus ?? "");
  }, [paymentStatus]);
  useEffect(() => {
    setPendingFlockId(flockId ?? "");
  }, [flockId]);
  useEffect(() => {
    setPendingShedId(shedId ?? "");
  }, [shedId]);
  useEffect(() => {
    setPendingBuyerId(buyerId ?? "");
  }, [buyerId]);
  useEffect(() => {
    setPendingDateFrom(dateFrom ?? "");
  }, [dateFrom]);
  useEffect(() => {
    setPendingDateTo(dateTo ?? "");
  }, [dateTo]);
  useEffect(() => {
    setPendingTotalAmountMin(totalAmountMin ?? "");
  }, [totalAmountMin]);
  useEffect(() => {
    setPendingTotalAmountMax(totalAmountMax ?? "");
  }, [totalAmountMax]);
  useEffect(() => {
    setPendingAmountPaidMin(amountPaidMin ?? "");
  }, [amountPaidMin]);
  useEffect(() => {
    setPendingAmountPaidMax(amountPaidMax ?? "");
  }, [amountPaidMax]);
  useEffect(() => {
    setPendingBalanceMin(balanceMin ?? "");
  }, [balanceMin]);
  useEffect(() => {
    setPendingBalanceMax(balanceMax ?? "");
  }, [balanceMax]);
  useEffect(() => {
    setPendingNetWeightMin(netWeightMin ?? "");
  }, [netWeightMin]);
  useEffect(() => {
    setPendingNetWeightMax(netWeightMax ?? "");
  }, [netWeightMax]);

  const handleResetFilters = () => {
    reset();
    setPendingSearch("");
    setPendingFarmId(farmId);
    setPendingSortBy("createdAt");
    setPendingSortOrder("desc");
    setPendingStatus("");
    setPendingPaymentStatus("");
    setPendingDateFrom("");
    setPendingDateTo("");
    setPendingFlockId("");
    setPendingShedId("");
    setPendingBuyerId("");
    setPendingTotalAmountMin("");
    setPendingTotalAmountMax("");
    setPendingAmountPaidMin("");
    setPendingAmountPaidMax("");
    setPendingBalanceMin("");
    setPendingBalanceMax("");
    setPendingNetWeightMin("");
    setPendingNetWeightMax("");
  };
  const handleApplyFilters = () =>
    setFilters({
      search: pendingSearch,
      farmId: pendingFarmId,
      sortBy: pendingSortBy,
      sortOrder: pendingSortOrder,
      status: pendingStatus,
      dateFrom: pendingDateFrom,
      dateTo: pendingDateTo,
      paymentStatus: pendingPaymentStatus,
      flockId: pendingFlockId,
      shedId: pendingShedId,
      buyerId: pendingBuyerId,
      totalAmountMin: pendingTotalAmountMin,
      totalAmountMax: pendingTotalAmountMax,
      amountPaidMin: pendingAmountPaidMin,
      amountPaidMax: pendingAmountPaidMax,
      balanceMin: pendingBalanceMin,
      balanceMax: pendingBalanceMax,
      netWeightMin: pendingNetWeightMin,
      netWeightMax: pendingNetWeightMax,
    });

  return (
    <div className="space-y-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Search and Farm Selection Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex-1">
          <Searchbar
            search={pendingSearch}
            setSearch={setPendingSearch}
            placeholder="Search flocks..."
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-fit">
            <FarmsSelect
              value={pendingFarmId}
              onChange={(v) => {
                setPendingFarmId(v);
                setPendingFlockId("");
                setPendingShedId("");
              }}
              placeholder="Select farm..."
            />
          </div>
          <div className="w-fit">
            <ShedsSelect
              value={pendingShedId}
              onChange={(v) => {
                setPendingShedId(v);
                setPendingFlockId("");
              }}
              placeholder="Select shed..."
              farmId={pendingFarmId || undefined}
            />
          </div>
          <div className="w-fit">
            <FlocksSelect
              value={pendingFlockId}
              onChange={(v) => setPendingFlockId(v)}
              placeholder="Select flock..."
              farmId={pendingFarmId || undefined}
              shedId={pendingShedId || undefined}
            />
          </div>
          <div className="w-fit">
            <BuyersSelect
              value={pendingBuyerId}
              onChange={(v) => setPendingBuyerId(v)}
              placeholder="Select buyer..."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Date Range:
          </label>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal h-9 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pendingDateFrom ? (
                    <span className="text-xs">
                      {format(new Date(pendingDateFrom), "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">From</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    pendingDateFrom ? new Date(pendingDateFrom) : undefined
                  }
                  onSelect={(value) => {
                    const date = value as Date | undefined;
                    const fromStr = date ? format(date, "yyyy-MM-dd") : "";
                    setPendingDateFrom(fromStr);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-left font-normal h-9 min-w-[140px]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {pendingDateTo ? (
                    <span className="text-xs">
                      {format(new Date(pendingDateTo), "MMM d")}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">To</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={pendingDateTo ? new Date(pendingDateTo) : undefined}
                  onSelect={(value) => {
                    const date = value as Date | undefined;
                    const toStr = date ? format(date, "yyyy-MM-dd") : "";
                    setPendingDateTo(toStr);
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Payment:
          </label>
          <div className="flex items-center gap-2">
            <Select
              value={pendingPaymentStatus || undefined}
              onValueChange={(value) =>
                setPendingPaymentStatus(
                  value as "" | "paid" | "partial" | "unpaid"
                )
              }
            >
              <SelectTrigger className="w-36 h-9">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {paymentStatusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option || "any"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Total Amount:
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={pendingTotalAmountMin}
              onChange={(e) => setPendingTotalAmountMin(e.target.value)}
              placeholder="Min"
              className="w-24 h-9"
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingTotalAmountMax}
              onChange={(e) => setPendingTotalAmountMax(e.target.value)}
              placeholder="Max"
              className="w-24 h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Amount Paid:
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={pendingAmountPaidMin}
              onChange={(e) => setPendingAmountPaidMin(e.target.value)}
              placeholder="Min"
              className="w-24 h-9"
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingAmountPaidMax}
              onChange={(e) => setPendingAmountPaidMax(e.target.value)}
              placeholder="Max"
              className="w-24 h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Balance:
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={pendingBalanceMin}
              onChange={(e) => setPendingBalanceMin(e.target.value)}
              placeholder="Min"
              className="w-24 h-9"
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingBalanceMax}
              onChange={(e) => setPendingBalanceMax(e.target.value)}
              placeholder="Max"
              className="w-24 h-9"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3"></div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Net Wt:
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              value={pendingNetWeightMin}
              onChange={(e) => setPendingNetWeightMin(e.target.value)}
              placeholder="Min"
              className="w-24 h-9"
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              inputMode="numeric"
              value={pendingNetWeightMax}
              onChange={(e) => setPendingNetWeightMax(e.target.value)}
              placeholder="Max"
              className="w-24 h-9"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </label>
            <div className="flex items-center gap-2">
              <Select
                value={pendingSortBy}
                onValueChange={(value) => setPendingSortBy(value)}
              >
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={pendingSortOrder}
                onValueChange={(value) => setPendingSortOrder(value)}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOrderOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Status:
            </label>
            <div className="flex items-center gap-2">
              <Select
                value={pendingStatus || undefined}
                onValueChange={(value) => setPendingStatus(value)}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleApplyFilters}
            className="h-9 px-4"
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleResetFilters}
            className="h-9 px-4 text-gray-600 hover:text-gray-900"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LedgerFilters;

const sortByOptions = [
  "createdAt",
  "updatedAt",
  "date",
  "totalAmount",
  "amountPaid",
  "balance",
  "netWeight",
];
const sortOrderOptions = ["asc", "desc"];
const statusOptions = ["active", "completed"];
const paymentStatusOptions = ["paid", "partial", "unpaid"];
