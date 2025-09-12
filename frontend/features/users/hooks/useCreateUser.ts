import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User as UserType } from "@/types";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { AxiosError } from "axios";
import { APIResponse } from "@/types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Creating user...", { id: "createUser" });
    },
    mutationFn: async (
      userData: Omit<UserType, "_id" | "createdAt" | "updatedAt">
    ) => {
      const response = await api.post<APIResponse<UserType>>(
        `/users`,
        userData
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "createUser" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Create user failed",
        { id: "createUser" }
      );
    },
  });
};
