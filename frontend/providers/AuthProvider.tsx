"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { api } from "@/lib/api";
import { User as UserType } from "@/types/user-types";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import GlobalLoader from "@/features/shared/components/GlobalLoader";
import { toast } from "sonner";

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  error: string | null;
  logout: () => void;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: () => {},
  refetchUser: async () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// 👇 Global reference, updated when AuthProvider mounts
let globalLogout: (() => Promise<void>) | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get<{
        status: string;
        message: string;
        data: UserType;
      }>("/users/me");
      setUser(res.data?.data);
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || "Failed to fetch user"
          : "Failed to fetch user";

      setError(errorMessage);
      setUser(null);

      // If it's a 401 error, the user is not authenticated
      if (error instanceof AxiosError && error.response?.status === 401) {
        // Don't show error toast for 401 - this is expected for unauthenticated users
        console.log("User not authenticated");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setHasInitialized(true);
    }
  }, []);

  // Initialize authentication state on mount
  useEffect(() => {
    if (!hasInitialized) {
      fetchUser();
    }
  }, [fetchUser, hasInitialized]);

  const logout = async () => {
    toast.loading("Logging out...", { id: "logout" });
    try {
      await api.post("/auth/logout"); // clears cookies
      setUser(null);
      setError(null);
      setLoading(false);
      router.push("/sign-in");
      toast.success("Logged out successfully", { id: "logout" });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error?.message || "Failed to logout"
          : "Failed to logout";

      setError(errorMessage);
      setUser(null);
      setLoading(false);
      router.push("/sign-in"); // Redirect anyway
      toast.error("Failed to logout", { id: "logout" });
    }
  };

  // assign to global so axios can use it
  globalLogout = logout;

  const refetchUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, refetchUser }}>
      {loading && !hasInitialized ? <GlobalLoader /> : children}
    </AuthContext.Provider>
  );
}

export { globalLogout };
