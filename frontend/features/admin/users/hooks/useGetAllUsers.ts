import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";
import { User as UserType } from "@/types";
import { useAuthContext } from "@/providers/AuthProvider";

type QueryParams = {
  page: string;
  limit: string;
  search: string;
  role: "admin" | "manager" | "viewer" | "all";
  sortBy: string;
  sortOrder: string;
};

export const useGetAllUsers = (query: QueryParams) => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: [...queryKeys.users, query],
    queryFn: async () => {
      try {
        // Convert "all" role back to empty string for backend
        const apiQuery = {
          ...query,
          role: query.role === "all" ? "" : query.role,
        };
        const response = await api.get<APIResponse<UserType[]>>("/users", {
          params: apiQuery,
        });
        return response.data;
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data?.error?.message
            : "Failed to fetch users"
        );
      }
    },
    enabled: !!user?._id,
    placeholderData: (previousData) => previousData,
  });
};
