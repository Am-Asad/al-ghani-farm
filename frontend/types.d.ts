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
  createdAt: string;
  updatedAt: string;
};

export type FarmWithFlocks = Farm & {
  flocks: Flock[];
};
