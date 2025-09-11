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
  totalSheds: number;
  createdAt: string;
  updatedAt: string;
};
