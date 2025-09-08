export type Farm = {
  _id: string;
  name: string;
  supervisor: string;
  totalSheds: number;
  createdAt: string;
  updatedAt: string;
};

export type AllFarmsResponse = {
  status: "success" | "error";
  message: string;
  data: Farm[];
};
