"use client";
import { api } from "@/lib/api";
import { SigninFormData } from "@/lib/validations/signinSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { APIResponse } from "@/types";
import { User as UserType } from "@/types";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";

export const useSigninUser = () => {
  const router = useRouter();
  const { refetchUser } = useAuthContext();

  return useMutation({
    onMutate: () => {
      toast.loading("Signing in...", { id: "signin" });
    },
    mutationFn: async (userData: SigninFormData) => {
      const response = await api.post<APIResponse<UserType>>(
        `/auth/signin`,
        userData
      );
      return response.data;
    },
    onSuccess: async (response) => {
      toast.success(response.message, { id: "signin" });
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from") || "/dashboard";
      // Refetch user data to update the auth context
      await refetchUser();
      router.push(from);
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error?.message
          : "Sign in failed",
        { id: "signin" }
      );
    },
  });
};
