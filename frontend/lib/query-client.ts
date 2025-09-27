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
  shedById: (shedId: string) => ["shed", shedId] as const,

  ledgers: ["ledgers"] as const,
  ledgerById: (ledgerId: string) => ["ledger", ledgerId] as const,
  ledgerWithFilters: (query: { [key: string]: string }) =>
    ["ledger", query] as const,

  buyers: ["buyers"] as const,
  buyerById: (buyerId: string) => ["buyer", buyerId] as const,

  users: ["users"] as const,
  user: (userId: string) => ["user", userId] as const,

  entities: ["entities"] as const,

  reports: ["reports"] as const,
  universalReports: (query: { [key: string]: string }) =>
    ["reports", "universal", query] as const,
};
