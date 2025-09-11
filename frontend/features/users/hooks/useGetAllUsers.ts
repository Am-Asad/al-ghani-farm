import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";
import { User as UserType } from "@/types/user-types";
import { useAuthContext } from "@/providers/AuthProvider";

export const useGetAllUsers = () => {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: async () => {
      try {
        const response = await api.get<APIResponse<UserType[]>>("/users");
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
  });
};
