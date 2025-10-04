import { useCallback } from "react";
import { useQueryParams } from "@/features/shared/hooks/useQueryParams";

export type LedgerQueryParams = {
  page: string;
  limit: string;
  search: string;
  farmId: string;
  shedId: string;
  flockId: string;
  buyerId: string;
  sortBy: string;
  sortOrder: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  // advanced time filters
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
  // payment status derived from totals
  paymentStatus?: string;
  // numeric ranges
  totalAmountMin?: string;
  totalAmountMax?: string;
  amountPaidMin?: string;
  amountPaidMax?: string;
  balanceMin?: string;
  balanceMax?: string;
  numberOfBirdsMin?: string;
  numberOfBirdsMax?: string;
  rateMin?: string;
  rateMax?: string;
  emptyVehicleWeightMin?: string;
  emptyVehicleWeightMax?: string;
  grossWeightMin?: string;
  grossWeightMax?: string;
  netWeightMin?: string;
  netWeightMax?: string;
  // exact/partial text filters
  vehicleNumber?: string;
  driverName?: string;
  driverContact?: string;
  accountantName?: string;
};

const DEFAULTS: LedgerQueryParams = {
  page: "1",
  limit: "10",
  search: "",
  farmId: "",
  shedId: "",
  flockId: "",
  buyerId: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  status: "",
  dateFrom: "",
  dateTo: "",
  createdFrom: "",
  createdTo: "",
  updatedFrom: "",
  updatedTo: "",
  paymentStatus: "",
  totalAmountMin: "",
  totalAmountMax: "",
  amountPaidMin: "",
  amountPaidMax: "",
  balanceMin: "",
  balanceMax: "",
  numberOfBirdsMin: "",
  numberOfBirdsMax: "",
  rateMin: "",
  rateMax: "",
  emptyVehicleWeightMin: "",
  emptyVehicleWeightMax: "",
  grossWeightMin: "",
  grossWeightMax: "",
  netWeightMin: "",
  netWeightMax: "",
  vehicleNumber: "",
  driverName: "",
  driverContact: "",
  accountantName: "",
};

export const useLedgerQueryParams = () => {
  const {
    params: query,
    setParams,
    reset,
  } = useQueryParams<LedgerQueryParams>({
    defaults: DEFAULTS,
  });

  const setFilters = useCallback(
    (filters: {
      search?: string;
      farmId?: string;
      shedId?: string;
      flockId?: string;
      buyerId?: string;
      sortBy?: string;
      sortOrder?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      createdFrom?: string;
      createdTo?: string;
      updatedFrom?: string;
      updatedTo?: string;
      paymentStatus?: string;
      totalAmountMin?: string;
      totalAmountMax?: string;
      amountPaidMin?: string;
      amountPaidMax?: string;
      balanceMin?: string;
      balanceMax?: string;
      numberOfBirdsMin?: string;
      numberOfBirdsMax?: string;
      rateMin?: string;
      rateMax?: string;
      emptyVehicleWeightMin?: string;
      emptyVehicleWeightMax?: string;
      grossWeightMin?: string;
      grossWeightMax?: string;
      netWeightMin?: string;
      netWeightMax?: string;
      vehicleNumber?: string;
      driverName?: string;
      driverContact?: string;
      accountantName?: string;
    }) => {
      // When filters change, reset page to 1
      setParams({ ...filters, page: "1" });
    },
    [setParams]
  );

  const setPage = useCallback(
    (page: number | string, opts?: { replace?: boolean }) => {
      setParams({ page: String(Math.max(1, Number(page) || 1)) }, opts);
    },
    [setParams]
  );

  const setLimit = useCallback(
    (limit: number | string, opts?: { replace?: boolean }) => {
      const lim = String(Math.max(1, Number(limit) || Number(DEFAULTS.limit)));
      // When limit changes, reset to first page
      setParams({ limit: lim, page: "1" }, opts);
    },
    [setParams]
  );

  return {
    query,
    // values
    page: Number(query.page),
    limit: Number(query.limit),
    search: query.search,
    farmId: query.farmId,
    shedId: query.shedId,
    flockId: query.flockId,
    buyerId: query.buyerId,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
    status: query.status ?? "",
    dateFrom: query.dateFrom ?? "",
    dateTo: query.dateTo ?? "",
    createdFrom: query.createdFrom ?? "",
    createdTo: query.createdTo ?? "",
    updatedFrom: query.updatedFrom ?? "",
    updatedTo: query.updatedTo ?? "",
    paymentStatus: query.paymentStatus ?? "",
    totalAmountMin: query.totalAmountMin ?? "",
    totalAmountMax: query.totalAmountMax ?? "",
    amountPaidMin: query.amountPaidMin ?? "",
    amountPaidMax: query.amountPaidMax ?? "",
    balanceMin: query.balanceMin ?? "",
    balanceMax: query.balanceMax ?? "",
    numberOfBirdsMin: query.numberOfBirdsMin ?? "",
    numberOfBirdsMax: query.numberOfBirdsMax ?? "",
    rateMin: query.rateMin ?? "",
    rateMax: query.rateMax ?? "",
    emptyVehicleWeightMin: query.emptyVehicleWeightMin ?? "",
    emptyVehicleWeightMax: query.emptyVehicleWeightMax ?? "",
    grossWeightMin: query.grossWeightMin ?? "",
    grossWeightMax: query.grossWeightMax ?? "",
    netWeightMin: query.netWeightMin ?? "",
    netWeightMax: query.netWeightMax ?? "",
    vehicleNumber: query.vehicleNumber ?? "",
    driverName: query.driverName ?? "",
    driverContact: query.driverContact ?? "",
    accountantName: query.accountantName ?? "",
    // setters
    setFilters,
    setPage,
    setLimit,
    reset,
  } as const;
};
