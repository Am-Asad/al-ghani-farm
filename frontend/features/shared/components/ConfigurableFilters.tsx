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
import EntitySelect from "@/features/shared/components/EntitySelect";
import { useGetFarmsDropdown } from "@/features/admin/farms/hooks/useFarmHooks";
import { useGetShedsDropdown } from "@/features/admin/sheds/hooks/useShedHooks";
import { useGetFlocksDropdown } from "@/features/admin/flocks/hooks/useFlockHooks";
import { useGetBuyersDropdown } from "@/features/admin/buyers/hooks/useBuyerHooks";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  EntityFilterConfig,
  FilterComponentProps,
} from "@/features/shared/types/filterConfig";
import { useEntityQueryParams } from "@/features/shared/hooks/useEntityQueryParams";

// Default configuration
const DEFAULT_CONFIG: EntityFilterConfig = {
  showSearch: true,
  searchPlaceholder: "Search...",
  showFarms: false,
  showSheds: false,
  showFlocks: false,
  showBuyers: false,
  showBuyersReadOnly: false,
  showDateRange: false,
  showCreatedDateRange: false,
  showUpdatedDateRange: false,
  showStatus: false,
  showRole: false,
  showPaymentStatus: false,
  showCapacity: false,
  showTotalAmount: false,
  showAmountPaid: false,
  showBalance: false,
  showNetWeight: false,
  showNumberOfBirds: false,
  showRate: false,
  showEmptyVehicleWeight: false,
  showGrossWeight: false,
  showVehicleNumber: false,
  showDriverName: false,
  showDriverContact: false,
  showAccountantName: false,
  showSorting: true,
  showApplyButton: true,
  showResetButton: true,
  layout: "spacious",
};

// Generic configurable filter component
const ConfigurableFilters = <
  T extends Record<string, string> = Record<string, string>
>({
  config = {},
  className = "",
  queryParams: externalQueryParams,
  children,
}: FilterComponentProps<T>) => {
  // Merge provided config with defaults
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  // Use external query params if provided, otherwise use internal hook
  const internalQueryParams = useEntityQueryParams<T>({
    entityName: "generic", // Placeholder, should be overridden by specific entity hooks
    defaults: {
      page: "1",
      limit: "10",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });

  const queryParams = externalQueryParams || internalQueryParams;

  // Safely extract methods from query params
  const setFilters = queryParams.setFilters || internalQueryParams.setFilters;
  const reset = queryParams.reset || internalQueryParams.reset;
  const search = queryParams.search || "";
  const sortBy = queryParams.sortBy || "";
  const sortOrder = queryParams.sortOrder || "";

  // Helper function to safely get filter values
  const getFilterValue = (key: string): string => {
    return (queryParams as unknown as Record<string, string>)[key] || "";
  };

  // Optional options exposed by the query params config
  const configOptions = (
    queryParams as {
      config?: {
        roleOptions?: string[];
        sortOptions?: string[];
        statusOptions?: string[];
      };
    }
  )?.config;
  const roleOptions: string[] | undefined = configOptions?.roleOptions;
  const sortOptions: string[] | undefined = configOptions?.sortOptions;

  // Get filter values with fallbacks
  const farmId = getFilterValue("farmId");
  const shedId = getFilterValue("shedId");
  const flockId = getFilterValue("flockId");
  const buyerId = getFilterValue("buyerId");
  const status = getFilterValue("status");
  const role = getFilterValue("role");
  const paymentStatus = getFilterValue("paymentStatus");
  const dateFrom = getFilterValue("dateFrom");
  const dateTo = getFilterValue("dateTo");
  const createdFrom = getFilterValue("createdFrom");
  const createdTo = getFilterValue("createdTo");
  const updatedFrom = getFilterValue("updatedFrom");
  const updatedTo = getFilterValue("updatedTo");
  const capacityMin = getFilterValue("capacityMin");
  const capacityMax = getFilterValue("capacityMax");
  const totalAmountMin = getFilterValue("totalAmountMin");
  const totalAmountMax = getFilterValue("totalAmountMax");
  const amountPaidMin = getFilterValue("amountPaidMin");
  const amountPaidMax = getFilterValue("amountPaidMax");
  const balanceMin = getFilterValue("balanceMin");
  const balanceMax = getFilterValue("balanceMax");
  const netWeightMin = getFilterValue("netWeightMin");
  const netWeightMax = getFilterValue("netWeightMax");
  const numberOfBirdsMin = getFilterValue("numberOfBirdsMin");
  const numberOfBirdsMax = getFilterValue("numberOfBirdsMax");
  const rateMin = getFilterValue("rateMin");
  const rateMax = getFilterValue("rateMax");
  const emptyVehicleWeightMin = getFilterValue("emptyVehicleWeightMin");
  const emptyVehicleWeightMax = getFilterValue("emptyVehicleWeightMax");
  const grossWeightMin = getFilterValue("grossWeightMin");
  const grossWeightMax = getFilterValue("grossWeightMax");
  const vehicleNumber = getFilterValue("vehicleNumber");
  const driverName = getFilterValue("driverName");
  const driverContact = getFilterValue("driverContact");
  const accountantName = getFilterValue("accountantName");

  // Local state for pending filter values (not applied until user clicks Apply)
  const [pendingSearch, setPendingSearch] = useState(search);
  const [pendingSortBy, setPendingSortBy] = useState(sortBy);
  const [pendingSortOrder, setPendingSortOrder] = useState(sortOrder);
  const [pendingFarmId, setPendingFarmId] = useState(farmId || "");
  const [pendingShedId, setPendingShedId] = useState(shedId || "");
  const [pendingFlockId, setPendingFlockId] = useState(flockId || "");
  const [pendingBuyerId, setPendingBuyerId] = useState(buyerId || "");
  const [pendingStatus, setPendingStatus] = useState(status || "all");
  const [pendingRole, setPendingRole] = useState(role || "");
  const [pendingPaymentStatus, setPendingPaymentStatus] = useState(
    paymentStatus || "all"
  );
  const [pendingDateFrom, setPendingDateFrom] = useState(dateFrom || "");
  const [pendingDateTo, setPendingDateTo] = useState(dateTo || "");
  const [pendingCreatedFrom, setPendingCreatedFrom] = useState(
    createdFrom || ""
  );
  const [pendingCreatedTo, setPendingCreatedTo] = useState(createdTo || "");
  const [pendingUpdatedFrom, setPendingUpdatedFrom] = useState(
    updatedFrom || ""
  );
  const [pendingUpdatedTo, setPendingUpdatedTo] = useState(updatedTo || "");
  const [pendingCapacityMin, setPendingCapacityMin] = useState(
    capacityMin || ""
  );
  const [pendingCapacityMax, setPendingCapacityMax] = useState(
    capacityMax || ""
  );
  const [pendingTotalAmountMin, setPendingTotalAmountMin] = useState(
    totalAmountMin || ""
  );
  const [pendingTotalAmountMax, setPendingTotalAmountMax] = useState(
    totalAmountMax || ""
  );
  const [pendingAmountPaidMin, setPendingAmountPaidMin] = useState(
    amountPaidMin || ""
  );
  const [pendingAmountPaidMax, setPendingAmountPaidMax] = useState(
    amountPaidMax || ""
  );
  const [pendingBalanceMin, setPendingBalanceMin] = useState(balanceMin || "");
  const [pendingBalanceMax, setPendingBalanceMax] = useState(balanceMax || "");
  const [pendingNetWeightMin, setPendingNetWeightMin] = useState(
    netWeightMin || ""
  );
  const [pendingNetWeightMax, setPendingNetWeightMax] = useState(
    netWeightMax || ""
  );
  const [pendingNumberOfBirdsMin, setPendingNumberOfBirdsMin] = useState(
    numberOfBirdsMin || ""
  );
  const [pendingNumberOfBirdsMax, setPendingNumberOfBirdsMax] = useState(
    numberOfBirdsMax || ""
  );
  const [pendingRateMin, setPendingRateMin] = useState(rateMin || "");
  const [pendingRateMax, setPendingRateMax] = useState(rateMax || "");
  const [pendingEmptyVehicleWeightMin, setPendingEmptyVehicleWeightMin] =
    useState(emptyVehicleWeightMin || "");
  const [pendingEmptyVehicleWeightMax, setPendingEmptyVehicleWeightMax] =
    useState(emptyVehicleWeightMax || "");
  const [pendingGrossWeightMin, setPendingGrossWeightMin] = useState(
    grossWeightMin || ""
  );
  const [pendingGrossWeightMax, setPendingGrossWeightMax] = useState(
    grossWeightMax || ""
  );
  const [pendingVehicleNumber, setPendingVehicleNumber] = useState(
    vehicleNumber || ""
  );
  const [pendingDriverName, setPendingDriverName] = useState(driverName || "");
  const [pendingDriverContact, setPendingDriverContact] = useState(
    driverContact || ""
  );
  const [pendingAccountantName, setPendingAccountantName] = useState(
    accountantName || ""
  );

  // Sync local state with URL changes
  useEffect(() => setPendingSearch(search), [search]);
  useEffect(() => setPendingSortBy(sortBy), [sortBy]);
  useEffect(() => setPendingSortOrder(sortOrder), [sortOrder]);
  useEffect(() => setPendingFarmId(farmId || ""), [farmId]);
  useEffect(() => setPendingShedId(shedId || ""), [shedId]);
  useEffect(() => setPendingFlockId(flockId || ""), [flockId]);
  useEffect(() => setPendingBuyerId(buyerId || ""), [buyerId]);
  useEffect(() => setPendingStatus(status || "all"), [status]);
  useEffect(() => setPendingRole(role || ""), [role]);
  useEffect(
    () => setPendingPaymentStatus(paymentStatus || "all"),
    [paymentStatus]
  );
  useEffect(() => setPendingDateFrom(dateFrom || ""), [dateFrom]);
  useEffect(() => setPendingDateTo(dateTo || ""), [dateTo]);
  useEffect(() => setPendingCreatedFrom(createdFrom || ""), [createdFrom]);
  useEffect(() => setPendingCreatedTo(createdTo || ""), [createdTo]);
  useEffect(() => setPendingUpdatedFrom(updatedFrom || ""), [updatedFrom]);
  useEffect(() => setPendingUpdatedTo(updatedTo || ""), [updatedTo]);
  useEffect(() => setPendingCapacityMin(capacityMin || ""), [capacityMin]);
  useEffect(() => setPendingCapacityMax(capacityMax || ""), [capacityMax]);
  useEffect(
    () => setPendingTotalAmountMin(totalAmountMin || ""),
    [totalAmountMin]
  );
  useEffect(
    () => setPendingTotalAmountMax(totalAmountMax || ""),
    [totalAmountMax]
  );
  useEffect(
    () => setPendingAmountPaidMin(amountPaidMin || ""),
    [amountPaidMin]
  );
  useEffect(
    () => setPendingAmountPaidMax(amountPaidMax || ""),
    [amountPaidMax]
  );
  useEffect(() => setPendingBalanceMin(balanceMin || ""), [balanceMin]);
  useEffect(() => setPendingBalanceMax(balanceMax || ""), [balanceMax]);
  useEffect(() => setPendingNetWeightMin(netWeightMin || ""), [netWeightMin]);
  useEffect(() => setPendingNetWeightMax(netWeightMax || ""), [netWeightMax]);
  useEffect(
    () => setPendingNumberOfBirdsMin(numberOfBirdsMin || ""),
    [numberOfBirdsMin]
  );
  useEffect(
    () => setPendingNumberOfBirdsMax(numberOfBirdsMax || ""),
    [numberOfBirdsMax]
  );
  useEffect(() => setPendingRateMin(rateMin || ""), [rateMin]);
  useEffect(() => setPendingRateMax(rateMax || ""), [rateMax]);
  useEffect(
    () => setPendingEmptyVehicleWeightMin(emptyVehicleWeightMin || ""),
    [emptyVehicleWeightMin]
  );
  useEffect(
    () => setPendingEmptyVehicleWeightMax(emptyVehicleWeightMax || ""),
    [emptyVehicleWeightMax]
  );
  useEffect(
    () => setPendingGrossWeightMin(grossWeightMin || ""),
    [grossWeightMin]
  );
  useEffect(
    () => setPendingGrossWeightMax(grossWeightMax || ""),
    [grossWeightMax]
  );
  useEffect(
    () => setPendingVehicleNumber(vehicleNumber || ""),
    [vehicleNumber]
  );
  useEffect(() => setPendingDriverName(driverName || ""), [driverName]);
  useEffect(
    () => setPendingDriverContact(driverContact || ""),
    [driverContact]
  );
  useEffect(
    () => setPendingAccountantName(accountantName || ""),
    [accountantName]
  );

  const handleApplyFilters = () => {
    const filters: Record<string, string> = {};

    if (mergedConfig.showSearch) filters.search = pendingSearch;
    if (mergedConfig.showSorting) {
      filters.sortBy = pendingSortBy;
      filters.sortOrder = pendingSortOrder;
    }
    if (mergedConfig.showFarms) filters.farmId = pendingFarmId;
    if (mergedConfig.showSheds) filters.shedId = pendingShedId;
    if (mergedConfig.showFlocks) filters.flockId = pendingFlockId;
    if (mergedConfig.showBuyers || mergedConfig.showBuyersReadOnly)
      filters.buyerId = pendingBuyerId;
    if (mergedConfig.showStatus)
      filters.status = pendingStatus === "all" ? "" : pendingStatus;
    if (mergedConfig.showRole) filters.role = pendingRole;
    if (mergedConfig.showPaymentStatus)
      filters.paymentStatus = pendingPaymentStatus;
    if (mergedConfig.showDateRange) {
      filters.dateFrom = pendingDateFrom;
      filters.dateTo = pendingDateTo;
    }
    if (mergedConfig.showCreatedDateRange) {
      filters.createdFrom = pendingCreatedFrom;
      filters.createdTo = pendingCreatedTo;
    }
    if (mergedConfig.showUpdatedDateRange) {
      filters.updatedFrom = pendingUpdatedFrom;
      filters.updatedTo = pendingUpdatedTo;
    }
    if (mergedConfig.showCapacity) {
      filters.capacityMin = pendingCapacityMin;
      filters.capacityMax = pendingCapacityMax;
    }
    if (mergedConfig.showTotalAmount) {
      filters.totalAmountMin = pendingTotalAmountMin;
      filters.totalAmountMax = pendingTotalAmountMax;
    }
    if (mergedConfig.showAmountPaid) {
      filters.amountPaidMin = pendingAmountPaidMin;
      filters.amountPaidMax = pendingAmountPaidMax;
    }
    if (mergedConfig.showBalance) {
      filters.balanceMin = pendingBalanceMin;
      filters.balanceMax = pendingBalanceMax;
    }
    if (mergedConfig.showNetWeight) {
      filters.netWeightMin = pendingNetWeightMin;
      filters.netWeightMax = pendingNetWeightMax;
    }
    if (mergedConfig.showNumberOfBirds) {
      filters.numberOfBirdsMin = pendingNumberOfBirdsMin;
      filters.numberOfBirdsMax = pendingNumberOfBirdsMax;
    }
    if (mergedConfig.showRate) {
      filters.rateMin = pendingRateMin;
      filters.rateMax = pendingRateMax;
    }
    if (mergedConfig.showEmptyVehicleWeight) {
      filters.emptyVehicleWeightMin = pendingEmptyVehicleWeightMin;
      filters.emptyVehicleWeightMax = pendingEmptyVehicleWeightMax;
    }
    if (mergedConfig.showGrossWeight) {
      filters.grossWeightMin = pendingGrossWeightMin;
      filters.grossWeightMax = pendingGrossWeightMax;
    }
    if (mergedConfig.showVehicleNumber)
      filters.vehicleNumber = pendingVehicleNumber;
    if (mergedConfig.showDriverName) filters.driverName = pendingDriverName;
    if (mergedConfig.showDriverContact)
      filters.driverContact = pendingDriverContact;
    if (mergedConfig.showAccountantName)
      filters.accountantName = pendingAccountantName;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilters(filters as any);
  };

  const handleResetFilters = () => {
    reset();
    setPendingSearch("");
    setPendingSortBy(queryParams.sortBy || "createdAt");
    setPendingSortOrder(queryParams.sortOrder || "desc");
    setPendingFarmId(queryParams.farmId || "");
    setPendingShedId(queryParams.shedId || "");
    setPendingFlockId(queryParams.flockId || "");
    setPendingBuyerId(queryParams.buyerId || "");
    setPendingStatus(queryParams.status || "all");
    setPendingRole(queryParams.role || "");
    setPendingPaymentStatus(queryParams.paymentStatus || "all");
    setPendingDateFrom(queryParams.dateFrom || "");
    setPendingDateTo(queryParams.dateTo || "");
    setPendingCreatedFrom(queryParams.createdFrom || "");
    setPendingCreatedTo(queryParams.createdTo || "");
    setPendingUpdatedFrom(queryParams.updatedFrom || "");
    setPendingUpdatedTo(queryParams.updatedTo || "");
    setPendingCapacityMin(queryParams.capacityMin || "");
    setPendingCapacityMax(queryParams.capacityMax || "");
    setPendingTotalAmountMin(queryParams.totalAmountMin || "");
    setPendingTotalAmountMax(queryParams.totalAmountMax || "");
    setPendingAmountPaidMin(queryParams.amountPaidMin || "");
    setPendingAmountPaidMax(queryParams.amountPaidMax || "");
    setPendingBalanceMin(queryParams.balanceMin || "");
    setPendingBalanceMax(queryParams.balanceMax || "");
    setPendingNetWeightMin(queryParams.netWeightMin || "");
    setPendingNetWeightMax(queryParams.netWeightMax || "");
    setPendingNumberOfBirdsMin(queryParams.numberOfBirdsMin || "");
    setPendingNumberOfBirdsMax(queryParams.numberOfBirdsMax || "");
    setPendingRateMin(queryParams.rateMin || "");
    setPendingRateMax(queryParams.rateMax || "");
    setPendingEmptyVehicleWeightMin(queryParams.emptyVehicleWeightMin || "");
    setPendingEmptyVehicleWeightMax(queryParams.emptyVehicleWeightMax || "");
    setPendingGrossWeightMin(queryParams.grossWeightMin || "");
    setPendingGrossWeightMax(queryParams.grossWeightMax || "");
    setPendingVehicleNumber(queryParams.vehicleNumber || "");
    setPendingDriverName(queryParams.driverName || "");
    setPendingDriverContact(queryParams.driverContact || "");
    setPendingAccountantName(queryParams.accountantName || "");
  };

  // Helper function to render numeric range inputs
  const renderNumericRange = (
    label: string,
    minValue: string,
    maxValue: string,
    onMinChange: (value: string) => void,
    onMaxChange: (value: string) => void,
    placeholder = "Min"
  ) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-foreground whitespace-nowrap">
        {label}:
      </label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          inputMode="numeric"
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={placeholder}
          className="w-24 h-9"
        />
        <span className="text-sm text-muted-foreground">-</span>
        <Input
          type="number"
          inputMode="numeric"
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder="Max"
          className="w-24 h-9"
        />
      </div>
    </div>
  );

  // Helper function to render date range inputs
  const renderDateRange = (
    label: string,
    fromValue: string,
    toValue: string,
    onFromChange: (value: string) => void,
    onToChange: (value: string) => void
  ) => (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-foreground whitespace-nowrap">
        {label}:
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
              {fromValue ? (
                <span className="text-xs">
                  {format(new Date(fromValue), "MMM d")}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">From</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={fromValue ? new Date(fromValue) : undefined}
              onSelect={(value) => {
                const date = value as Date | undefined;
                const fromStr = date ? format(date, "yyyy-MM-dd") : "";
                onFromChange(fromStr);
              }}
              captionLayout="dropdown"
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
              {toValue ? (
                <span className="text-xs">
                  {format(new Date(toValue), "MMM d")}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">To</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={toValue ? new Date(toValue) : undefined}
              onSelect={(value) => {
                const date = value as Date | undefined;
                const toStr = date ? format(date, "yyyy-MM-dd") : "";
                onToChange(toStr);
              }}
              captionLayout="dropdown"
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "space-y-4 p-4 bg-card border rounded-lg shadow-sm",
        mergedConfig.layout === "compact" && "space-y-2 p-3",
        className
      )}
    >
      {/* Search Row */}
      {mergedConfig.showSearch && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Searchbar
              search={pendingSearch}
              setSearch={setPendingSearch}
              placeholder={mergedConfig.searchPlaceholder || "Search..."}
            />
          </div>
        </div>
      )}

      {/* Entity Selection Row */}
      {(mergedConfig.showFarms ||
        mergedConfig.showSheds ||
        mergedConfig.showFlocks ||
        mergedConfig.showBuyers ||
        mergedConfig.showBuyersReadOnly) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showFarms && (
            <div className="w-fit">
              <EntitySelect
                entityType="farms"
                fetchHook={useGetFarmsDropdown}
                value={pendingFarmId}
                onChange={setPendingFarmId}
                placeholder="Select farm..."
              />
            </div>
          )}
          {mergedConfig.showSheds && (
            <div className="w-fit">
              <EntitySelect
                entityType="sheds"
                fetchHook={useGetShedsDropdown}
                value={pendingShedId}
                onChange={setPendingShedId}
                placeholder="Select shed..."
                farmId={pendingFarmId || undefined}
              />
            </div>
          )}
          {mergedConfig.showFlocks && (
            <div className="w-fit">
              <EntitySelect
                entityType="flocks"
                fetchHook={useGetFlocksDropdown}
                value={pendingFlockId}
                onChange={setPendingFlockId}
                placeholder="Select flock..."
                farmId={pendingFarmId || undefined}
                shedId={pendingShedId || undefined}
              />
            </div>
          )}
          {(mergedConfig.showBuyers || mergedConfig.showBuyersReadOnly) && (
            <div className="w-fit">
              <EntitySelect
                entityType="buyers"
                fetchHook={useGetBuyersDropdown}
                value={pendingBuyerId}
                onChange={
                  mergedConfig.showBuyersReadOnly
                    ? undefined
                    : setPendingBuyerId
                }
                placeholder="Select buyer..."
                disabled={mergedConfig.showBuyersReadOnly}
              />
            </div>
          )}
        </div>
      )}

      {/* Date Range Row */}
      {(mergedConfig.showDateRange ||
        mergedConfig.showCreatedDateRange ||
        mergedConfig.showUpdatedDateRange) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showDateRange &&
            renderDateRange(
              "Date Range",
              pendingDateFrom,
              pendingDateTo,
              setPendingDateFrom,
              setPendingDateTo
            )}
          {mergedConfig.showCreatedDateRange &&
            renderDateRange(
              "Created Date",
              pendingCreatedFrom,
              pendingCreatedTo,
              setPendingCreatedFrom,
              setPendingCreatedTo
            )}
          {mergedConfig.showUpdatedDateRange &&
            renderDateRange(
              "Updated Date",
              pendingUpdatedFrom,
              pendingUpdatedTo,
              setPendingUpdatedFrom,
              setPendingUpdatedTo
            )}
        </div>
      )}

      {/* Status, Role and Payment Row */}
      {(mergedConfig.showStatus ||
        mergedConfig.showRole ||
        mergedConfig.showPaymentStatus) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showStatus && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Status:
              </label>
              <Select
                value={pendingStatus || "all"}
                onValueChange={setPendingStatus}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {mergedConfig.showRole && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Role:
              </label>
              <Select
                value={pendingRole || "all"}
                onValueChange={setPendingRole}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  {/* Prefer dynamic options if provided by query params config */}
                  {Array.isArray(roleOptions) ? (
                    roleOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "all"
                          ? "All"
                          : opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          {mergedConfig.showPaymentStatus && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Payment:
              </label>
              <Select
                value={pendingPaymentStatus}
                onValueChange={setPendingPaymentStatus}
              >
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Numeric Range Rows */}
      {(mergedConfig.showCapacity ||
        mergedConfig.showTotalAmount ||
        mergedConfig.showAmountPaid ||
        mergedConfig.showBalance) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showCapacity &&
            renderNumericRange(
              "Capacity",
              pendingCapacityMin,
              pendingCapacityMax,
              setPendingCapacityMin,
              setPendingCapacityMax
            )}
          {mergedConfig.showTotalAmount &&
            renderNumericRange(
              "Total Amount",
              pendingTotalAmountMin,
              pendingTotalAmountMax,
              setPendingTotalAmountMin,
              setPendingTotalAmountMax
            )}
          {mergedConfig.showAmountPaid &&
            renderNumericRange(
              "Amount Paid",
              pendingAmountPaidMin,
              pendingAmountPaidMax,
              setPendingAmountPaidMin,
              setPendingAmountPaidMax
            )}
          {mergedConfig.showBalance &&
            renderNumericRange(
              "Balance",
              pendingBalanceMin,
              pendingBalanceMax,
              setPendingBalanceMin,
              setPendingBalanceMax
            )}
        </div>
      )}

      {/* Additional Numeric Range Rows */}
      {(mergedConfig.showNetWeight ||
        mergedConfig.showNumberOfBirds ||
        mergedConfig.showRate) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showNetWeight &&
            renderNumericRange(
              "Net Weight",
              pendingNetWeightMin,
              pendingNetWeightMax,
              setPendingNetWeightMin,
              setPendingNetWeightMax
            )}
          {mergedConfig.showNumberOfBirds &&
            renderNumericRange(
              "Number of Birds",
              pendingNumberOfBirdsMin,
              pendingNumberOfBirdsMax,
              setPendingNumberOfBirdsMin,
              setPendingNumberOfBirdsMax
            )}
          {mergedConfig.showRate &&
            renderNumericRange(
              "Rate",
              pendingRateMin,
              pendingRateMax,
              setPendingRateMin,
              setPendingRateMax
            )}
        </div>
      )}

      {/* Vehicle Weight Rows */}
      {(mergedConfig.showEmptyVehicleWeight ||
        mergedConfig.showGrossWeight) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showEmptyVehicleWeight &&
            renderNumericRange(
              "Empty Vehicle Weight",
              pendingEmptyVehicleWeightMin,
              pendingEmptyVehicleWeightMax,
              setPendingEmptyVehicleWeightMin,
              setPendingEmptyVehicleWeightMax
            )}
          {mergedConfig.showGrossWeight &&
            renderNumericRange(
              "Gross Weight",
              pendingGrossWeightMin,
              pendingGrossWeightMax,
              setPendingGrossWeightMin,
              setPendingGrossWeightMax
            )}
        </div>
      )}

      {/* Text Input Rows */}
      {(mergedConfig.showVehicleNumber ||
        mergedConfig.showDriverName ||
        mergedConfig.showDriverContact ||
        mergedConfig.showAccountantName) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {mergedConfig.showVehicleNumber && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Vehicle Number:
              </label>
              <Input
                value={pendingVehicleNumber}
                onChange={(e) => setPendingVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number..."
                className="w-40 h-9"
              />
            </div>
          )}
          {mergedConfig.showDriverName && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Driver Name:
              </label>
              <Input
                value={pendingDriverName}
                onChange={(e) => setPendingDriverName(e.target.value)}
                placeholder="Enter driver name..."
                className="w-40 h-9"
              />
            </div>
          )}
          {mergedConfig.showDriverContact && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Driver Contact:
              </label>
              <Input
                value={pendingDriverContact}
                onChange={(e) => setPendingDriverContact(e.target.value)}
                placeholder="Enter driver contact..."
                className="w-40 h-9"
              />
            </div>
          )}
          {mergedConfig.showAccountantName && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground whitespace-nowrap">
                Accountant Name:
              </label>
              <Input
                value={pendingAccountantName}
                onChange={(e) => setPendingAccountantName(e.target.value)}
                placeholder="Enter accountant name..."
                className="w-40 h-9"
              />
            </div>
          )}
        </div>
      )}

      {/* Sort and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {mergedConfig.showSorting && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-foreground whitespace-nowrap">
              Sort by:
            </label>
            <div className="flex items-center gap-2">
              <Select value={pendingSortBy} onValueChange={setPendingSortBy}>
                <SelectTrigger className="w-40 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions && sortOptions.length > 0 ? (
                    sortOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .trim()}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="createdAt">Created At</SelectItem>
                      <SelectItem value="updatedAt">Updated At</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Select
                value={pendingSortOrder}
                onValueChange={setPendingSortOrder}
              >
                <SelectTrigger className="w-20 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">ASC</SelectItem>
                  <SelectItem value="desc">DESC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(mergedConfig.showApplyButton || mergedConfig.showResetButton) && (
          <div className="flex gap-2">
            {mergedConfig.showApplyButton && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleApplyFilters}
                className="h-9 px-4"
              >
                Apply
              </Button>
            )}
            {mergedConfig.showResetButton && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetFilters}
                className="h-9 px-4 text-muted-foreground hover:text-foreground"
              >
                Reset
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Custom children content */}
      {children}
    </div>
  );
};

export default ConfigurableFilters;
