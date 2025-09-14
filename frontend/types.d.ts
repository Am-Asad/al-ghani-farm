export type ApiStatus = "success" | "error";

export type APIResponse<T> = {
  status: ApiStatus;
  message: string;
  data: T;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "viewer";
  createdAt: string;
  updatedAt: string;
};

export type Buyer = {
  _id: string;
  name: string;
  contactNumber: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
};

export type Farm = {
  _id: string;
  name: string;
  supervisor: string;
  createdAt: string;
  updatedAt: string;
  flocksCount: number;
};

export type Flock = {
  _id: string;
  farmId: string;
  name: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalChicks: number;
  shedsCount: number;
  createdAt: string;
  updatedAt: string;
};

export type Shed = {
  _id: string;
  name: string;
  totalChicks: number;
  flockId: string;
  createdAt: string;
  updatedAt: string;
};

export type FarmWithFlocks = Farm & {
  flocks: Flock[];
};

export type FlockWithSheds = Flock & {
  sheds: Shed[];
};

export type Ledger = {
  _id: string;
  farmId: string;
  flockId: string;
  shedId: string;
  buyerId: string;
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  accountantName: string;
  emptyVehicleWeight: number;
  grossWeight: number;
  netWeight: number;
  numberOfBirds: number;
  rate: number;
  totalAmount: number;
  amountPaid: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type BuyerReportSummary = {
  totalTransactions: number;
  totalEmptyVehicleWeight: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalBirds: number;
  totalRate: number;
  totalAmount: number;
  totalPaid: number;
  totalBalance: number;
};

export type BuyerDailyReport = {
  buyer: Omit<Buyer, "createdAt" | "updatedAt">;
  date: string;
  summary: BuyerReportSummary;
  transactions: LedgerResponse[];
};

export type BuyerOverallReport = {
  buyer: Omit<Buyer, "createdAt" | "updatedAt">;
  summary: BuyerReportSummary & {
    dateRange: {
      from: string;
      to: string;
    } | null;
  };
  transactions: LedgerResponse[];
};

export type ShedReportSummary = {
  totalTransactions: number;
  totalEmptyVehicleWeight: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalBirds: number;
  totalRate: number;
  totalAmount: number;
  totalPaid: number;
  totalBalance: number;
};

export type ShedDailyReport = {
  shed: Omit<Shed, "createdAt" | "updatedAt">;
  date: string;
  summary: ShedReportSummary;
  transactions: LedgerResponse[];
};

export type ShedOverallReport = {
  shed: Omit<Shed, "createdAt" | "updatedAt">;
  summary: ShedReportSummary & {
    dateRange: {
      from: string;
      to: string;
    } | null;
  };
  transactions: LedgerResponse[];
};

export type LedgerResponse = {
  _id: string;
  farmId: {
    _id: string;
    name: string;
    supervisor: string;
  };
  flockId: {
    _id: string;
    name: string;
    status: string;
  };
  shedId: {
    _id: string;
    name: string;
  };
  buyerId: {
    _id: string;
    name: string;
    contactNumber: string;
    address?: string;
  };
  vehicleNumber: string;
  driverName: string;
  driverContact: string;
  accountantName: string;
  emptyVehicleWeight: number;
  grossWeight: number;
  netWeight: number;
  numberOfBirds: number;
  rate: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type Entities = {
  farms: { _id: string; name: string }[];
  flocks: { _id: string; name: string; farmId: string }[];
  buyers: { _id: string; name: string }[];
  sheds: { _id: string; name: string; flockId: string }[];
  counts: {
    farms: number;
    flocks: number;
    buyers: number;
    sheds: number;
  };
};
