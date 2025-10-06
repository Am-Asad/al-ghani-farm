import {
  useEntityQueryParams,
  EntityQueryParams,
  EntityQueryConfig,
} from "@/features/shared/hooks/useEntityQueryParams";

export type LedgerQueryParams = EntityQueryParams<{
  farmId: string;
  shedId: string;
  flockId: string;
  buyerId: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  createdFrom: string;
  createdTo: string;
  updatedFrom: string;
  updatedTo: string;
  paymentStatus: string;
  totalAmountMin: string;
  totalAmountMax: string;
  amountPaidMin: string;
  amountPaidMax: string;
  balanceMin: string;
  balanceMax: string;
  numberOfBirdsMin: string;
  numberOfBirdsMax: string;
  rateMin: string;
  rateMax: string;
  emptyVehicleWeightMin: string;
  emptyVehicleWeightMax: string;
  grossWeightMin: string;
  grossWeightMax: string;
  netWeightMin: string;
  netWeightMax: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  accountantName: string;
}>;

export const LEDGER_QUERY_CONFIG: EntityQueryConfig<LedgerQueryParams> = {
  entityName: "ledgers",
  defaults: {
    page: "1",
    limit: "10",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  entityDefaults: {
    farmId: "",
    shedId: "",
    flockId: "",
    buyerId: "",
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
  },
  sortOptions: [
    "createdAt",
    "updatedAt",
    "date",
    "totalAmount",
    "amountPaid",
    "netWeight",
    "numberOfBirds",
    "rate",
    "vehicleNumber",
    "driverName",
  ],
  statusOptions: ["active", "completed"],
};

export const useLedgerQueryParams = () => {
  return useEntityQueryParams<LedgerQueryParams>(LEDGER_QUERY_CONFIG);
};
