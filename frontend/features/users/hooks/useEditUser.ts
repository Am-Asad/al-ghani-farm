import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-client";
import { User as UserType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Editing user...", { id: "editUser" });
    },
    mutationFn: async (userData: Omit<UserType, "createdAt" | "updatedAt">) => {
      console.log("userData in edit user hook", userData);
      const response = await api.put<APIResponse<UserType>>(
        `/users/${userData._id}`,
        userData
      );
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "editUser" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Edit user failed",
        { id: "editUser" }
      );
    },
  });
};
