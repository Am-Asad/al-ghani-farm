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
