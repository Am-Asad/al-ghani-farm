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
  farmById: (farmId: string) => ["flocks", "farm", farmId] as const,

  flocks: ["flocks"] as const,
  flockById: (flockId: string) => ["sheds", "flock", flockId] as const,

  sheds: ["sheds"] as const,

  ledgers: ["ledgers"] as const,
  ledger: (ledgerId: string) => ["ledger", ledgerId] as const,

  buyers: ["buyers"] as const,
  buyerById: (buyerId: string) => ["buyer", buyerId] as const,

  users: ["users"] as const,
  user: (userId: string) => ["user", userId] as const,
};
