export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: "admin" | "manager" | "viewer";
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
};

export type Permission = {
  _id: string;
  resource: string;
  actions: ("create" | "read" | "update" | "delete")[];
};

export type SignupResponse = {
  status: "success" | "error";
  message: string;
  data: User;
};

export type SigninResponse = {
  status: "success" | "error";
  message: string;
  data: User;
};

export type AllUsersResponse = {
  status: "success" | "error";
  message: string;
  data: User[];
};
