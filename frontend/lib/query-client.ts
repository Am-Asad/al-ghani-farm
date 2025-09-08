import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query Keys
export const queryKeys = {
  farms: ["farms"] as const,
  farm: (id: string) => ["farm", id] as const,
  flocks: ["flocks"] as const,
  flock: (id: string) => ["flock", id] as const,
  ledgers: ["ledgers"] as const,
  ledger: (id: string) => ["ledger", id] as const,
  vehicles: ["vehicles"] as const,
  vehicle: (id: string) => ["vehicle", id] as const,
  brokers: ["brokers"] as const,
  broker: (id: string) => ["broker", id] as const,
  users: ["users"] as const,
  user: (id: string) => ["user", id] as const,
};
