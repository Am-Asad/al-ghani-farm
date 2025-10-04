import { EntityFilterConfig } from "@/features/shared/types/filterConfig";

// Generic filter presets that can be used across entities
export const FILTER_PRESETS = {
  // Minimal configuration - just search and sorting
  MINIMAL: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Full configuration - shows all available filters
  FULL: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showFarms: true,
    showSheds: true,
    showFlocks: true,
    showBuyers: true,
    showDateRange: true,
    showCreatedDateRange: true,
    showUpdatedDateRange: true,
    showStatus: true,
    showRole: true,
    showPaymentStatus: true,
    showCapacity: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showNumberOfBirds: true,
    showRate: true,
    showEmptyVehicleWeight: true,
    showGrossWeight: true,
    showVehicleNumber: true,
    showDriverName: true,
    showDriverContact: true,
    showAccountantName: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Entity-specific configuration - shows entity relationships
  ENTITY_SPECIFIC: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showFarms: true,
    showSheds: true,
    showFlocks: true,
    showBuyers: true,
    showDateRange: true,
    showStatus: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Payment-focused configuration - emphasizes payment-related filters
  PAYMENT_FOCUSED: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showBuyers: true,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Weight-focused configuration - emphasizes weight-related filters
  WEIGHT_FOCUSED: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showFarms: true,
    showSheds: true,
    showFlocks: true,
    showBuyers: true,
    showDateRange: true,
    showNetWeight: true,
    showEmptyVehicleWeight: true,
    showGrossWeight: true,
    showNumberOfBirds: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Compact layout for smaller screens
  COMPACT: {
    showSearch: true,
    searchPlaceholder: "Search...",
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
    layout: "compact" as const,
  } as EntityFilterConfig,
};

// Entity-specific filter presets
export const ENTITY_FILTER_PRESETS = {
  // Buyers - simple configuration
  BUYERS: {
    showSearch: true,
    searchPlaceholder: "Search buyers...",
    showBuyers: false,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Farms - simple configuration
  FARMS: {
    showSearch: true,
    searchPlaceholder: "Search farms...",
    showBuyers: false,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Sheds - includes farm relationship and capacity
  SHEDS: {
    showSearch: true,
    searchPlaceholder: "Search sheds...",
    showFarms: true,
    showBuyers: false,
    showDateRange: true,
    showCapacity: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Flocks - includes farm relationship, status, and capacity
  FLOCKS: {
    showSearch: true,
    searchPlaceholder: "Search flocks...",
    showFarms: true,
    showBuyers: false,
    showDateRange: true,
    showStatus: true,
    showCapacity: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Ledgers - comprehensive configuration
  LEDGERS: {
    showSearch: true,
    searchPlaceholder: "Search ledgers...",
    showFarms: true,
    showSheds: true,
    showFlocks: true,
    showBuyers: true,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showSorting: true,
    showStatus: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Buyer-specific Ledgers - hides buyer selection since buyer is already selected
  BUYER_LEDGERS: {
    showSearch: true,
    searchPlaceholder: "Search ledgers for this buyer...",
    showFarms: false,
    showSheds: false,
    showFlocks: false,
    showBuyers: false, // Buyer is already selected
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showSorting: true,
    showStatus: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Farm-specific Ledgers - hides farm selection since farm is already selected
  FARM_LEDGERS: {
    showSearch: true,
    searchPlaceholder: "Search ledgers for this farm...",
    showFarms: false, // Farm is already selected
    showSheds: false,
    showFlocks: false,
    showBuyers: false,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showSorting: true,
    showStatus: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Shed-specific Ledgers - hides farm and shed selection
  SHED_LEDGERS: {
    showSearch: true,
    searchPlaceholder: "Search ledgers for this shed...",
    showFarms: false, // Farm is already selected
    showSheds: false, // Shed is already selected
    showFlocks: false,
    showBuyers: false,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showSorting: true,
    showStatus: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Flock-specific Ledgers - hides farm, shed, and flock selection
  FLOCK_LEDGERS: {
    showSearch: true,
    searchPlaceholder: "Search ledgers for this flock...",
    showFarms: false, // Farm is already selected
    showSheds: false, // Shed is already selected
    showFlocks: false, // Flock is already selected
    showBuyers: false,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showSorting: true,
    showStatus: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Users - includes role and status
  USERS: {
    showSearch: true,
    searchPlaceholder: "Search users...",
    showRole: true,
    showStatus: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,

  // Reports - comprehensive filtering for report generation
  REPORTS: {
    showSearch: true,
    searchPlaceholder: "Search reports...",
    showFarms: true,
    showSheds: true,
    showFlocks: true,
    showBuyers: true,
    showDateRange: true,
    showPaymentStatus: true,
    showTotalAmount: true,
    showAmountPaid: true,
    showBalance: true,
    showNetWeight: true,
    showNumberOfBirds: true,
    showRate: true,
    showVehicleNumber: true,
    showDriverName: true,
    showDriverContact: true,
    showAccountantName: true,
    showSorting: true,
    showApplyButton: true,
    showResetButton: true,
  } as EntityFilterConfig,
} as const;

// Helper function to create custom filter configurations
export const createCustomFilterConfig = <
  T extends Record<string, unknown> = Record<string, never>
>(
  base: EntityFilterConfig<T>,
  overrides: Partial<EntityFilterConfig<T>> = {}
): EntityFilterConfig<T> => {
  return { ...base, ...overrides };
};

// Helper function to get a filter preset by name
export const getFilterPreset = <
  T extends Record<string, unknown> = Record<string, never>
>(
  presetName: keyof typeof ENTITY_FILTER_PRESETS | keyof typeof FILTER_PRESETS
): EntityFilterConfig<T> => {
  if (presetName in ENTITY_FILTER_PRESETS) {
    return ENTITY_FILTER_PRESETS[
      presetName as keyof typeof ENTITY_FILTER_PRESETS
    ] as EntityFilterConfig<T>;
  }
  if (presetName in FILTER_PRESETS) {
    return FILTER_PRESETS[
      presetName as keyof typeof FILTER_PRESETS
    ] as EntityFilterConfig<T>;
  }
  throw new Error(`Filter preset "${String(presetName)}" not found`);
};

// Helper function to merge multiple filter configurations
export const mergeFilterConfigs = <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  ...configs: Partial<EntityFilterConfig<T>>[]
): EntityFilterConfig<T> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {} as any);
};
