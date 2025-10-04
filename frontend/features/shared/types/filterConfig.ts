import { ReactNode } from "react";

// Base filter configuration that defines which filters to show
export type BaseFilterConfig = {
  // Search
  showSearch?: boolean;
  searchPlaceholder?: string;

  // Entity relationships
  showFarms?: boolean;
  showSheds?: boolean;
  showFlocks?: boolean;
  showBuyers?: boolean;
  showBuyersReadOnly?: boolean; // Show buyer filter but make it read-only

  // Date filters
  showDateRange?: boolean;
  showCreatedDateRange?: boolean;
  showUpdatedDateRange?: boolean;

  // Status filters
  showStatus?: boolean;
  showRole?: boolean;
  showPaymentStatus?: boolean;

  // Numeric range filters
  showCapacity?: boolean;
  showTotalAmount?: boolean;
  showAmountPaid?: boolean;
  showBalance?: boolean;
  showNetWeight?: boolean;
  showNumberOfBirds?: boolean;
  showRate?: boolean;
  showEmptyVehicleWeight?: boolean;
  showGrossWeight?: boolean;

  // Text filters
  showVehicleNumber?: boolean;
  showDriverName?: boolean;
  showDriverContact?: boolean;
  showAccountantName?: boolean;

  // Sorting
  showSorting?: boolean;

  // Action buttons
  showApplyButton?: boolean;
  showResetButton?: boolean;

  // Layout options
  layout?: "compact" | "spacious";
  className?: string;
};

// Entity-specific filter configuration
export type EntityFilterConfig<
  T extends Record<string, unknown> = Record<string, unknown>
> = BaseFilterConfig & T;

// Props for the generic filter component
export type FilterComponentProps<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  // Filter configuration
  config?: Partial<EntityFilterConfig> | Partial<EntityFilterConfig<T>>;

  // Custom className
  className?: string;

  // Query params (optional - if not provided, component will use its own hook)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryParams?: any; // Using any for now to avoid complex type issues

  // Custom filter components (for advanced use cases)
  customFilters?: Partial<T>;
  onCustomFilterChange?: (key: keyof T, value: unknown) => void;

  // Children (for additional custom content)
  children?: ReactNode;
};

// Filter preset type
export type FilterPreset<
  T extends Record<string, unknown> = Record<string, unknown>
> = EntityFilterConfig<T>;

// Collection of filter presets
export type FilterPresets<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [key: string]: FilterPreset<T>;
};

// Options for creating custom filter configurations
export type CreateFilterConfigOptions<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  // Base configuration to extend
  base?: Partial<EntityFilterConfig<T>>;

  // Override specific options
  overrides?: Partial<EntityFilterConfig<T>>;

  // Custom validation
  validation?: FilterValidation<T>;

  // Custom transformation
  transform?: FilterTransform<T>;
};

// Filter validation type
export type FilterValidation<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [K in keyof T]?: (value: T[K]) => boolean | string;
};

// Filter transformation type
export type FilterTransform<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [K in keyof T]?: (value: T[K]) => T[K];
};

// Filter state type for internal use
export type FilterState<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  [K in keyof T]: T[K];
};

// Filter action type
export type FilterAction<
  T extends Record<string, unknown> = Record<string, unknown>
> =
  | { type: "SET_FILTER"; key: keyof T; value: T[keyof T] }
  | { type: "SET_FILTERS"; filters: Partial<T> }
  | { type: "RESET_FILTERS" }
  | { type: "RESET_FILTER"; key: keyof T };

// Filter context type for advanced use cases
export type FilterContext<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  state: FilterState<T>;
  dispatch: (action: FilterAction<T>) => void;
  config: EntityFilterConfig<T>;
  isDirty: boolean;
  hasActiveFilters: boolean;
};
