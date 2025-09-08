import { api } from "@/lib/api";
import { SignupFormData } from "@/lib/validations/signupSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { SignupResponse } from "@/types/user-types";
import { queryKeys } from "@/lib/query-client";

export const useSignupUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onMutate: () => {
      toast.loading("Signing up...", { id: "signup" });
    },
    mutationFn: async (userData: Omit<SignupFormData, "confirmPassword">) => {
      const response = await api.post<SignupResponse>(`/auth/signup`, userData);
      return response.data;
    },
    onSuccess: (response) => {
      toast.success(response.message, { id: "signup" });
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Sign up failed",
        { id: "signup" }
      );
    },
  });
};
