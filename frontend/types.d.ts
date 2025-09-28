export type ApiStatus = "success" | "error";

export type APIResponse<T> = {
  status: ApiStatus;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    hasMore: boolean;
  };
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
  totalSheds: number;
  totalFlocks: number;
};

export type FarmDetails = Farm & {
  flocks: Flock[];
  sheds: Shed[];
};

export type Allocation = {
  _id: string;
  chicks: number;
  shedId: {
    _id: string;
    name: string;
    capacity: number;
  };
};

export type Flock = {
  _id: string;
  name: string;
  status: string;
  startDate: string;
  endDate?: string;
  totalChicks: number;
  farmId: {
    _id: string;
    name: string;
    supervisor: string;
  };
  allocations: Allocation[];
  createdAt: string;
  updatedAt: string;
};

export type Shed = {
  _id: string;
  name: string;
  capacity: number;
  farmId: {
    _id: string;
    name: string;
    supervisor: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Ledger = {
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
    capacity: number;
  };
  buyerId: {
    _id: string;
    name: string;
    contactNumber: string;
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
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type LedgerPayload = {
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
