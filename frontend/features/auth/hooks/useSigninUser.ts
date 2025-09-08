"use client";
import { api } from "@/lib/api";
import { SigninFormData } from "@/lib/validations/signinSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { SigninResponse } from "@/types/user-types";
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
      const response = await api.post<SigninResponse>(`/auth/signin`, userData);
      return response.data;
    },
    onSuccess: async (response) => {
      toast.success(response.message, { id: "signin" });
      // Refetch user data to update the auth context
      await refetchUser();
      router.push("/dashboard");
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
