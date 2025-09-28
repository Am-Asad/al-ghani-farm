// Currency formatting options
export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

// Number formatting options
export interface NumberFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  notation?: "standard" | "scientific" | "engineering" | "compact";
  compactDisplay?: "short" | "long";
}

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  options: CurrencyFormatOptions = {}
): string => {
  const {
    currency = "PKR",
    locale = "en-PK",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
    showSymbol = true,
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  };

  if (!showSymbol) {
    formatOptions.currencyDisplay = "code";
  }

  return amount.toLocaleString(locale, formatOptions);
};

/**
 * Format a number with custom options
 */
export const formatNumber = (
  value: number | undefined | null,
  options: NumberFormatOptions = {}
): string => {
  const safeValue = value ?? 0;
  const {
    locale = "en-US",
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    useGrouping = true,
    notation = "standard",
    compactDisplay = "short",
  } = options;

  const formatOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
    notation,
  };

  if (notation === "compact") {
    formatOptions.compactDisplay = compactDisplay;
  }

  return safeValue.toLocaleString(locale, formatOptions);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string => {
  const { minimumFractionDigits = 0, maximumFractionDigits = 1 } = options;

  return value.toLocaleString("en-US", {
    style: "percent",
    minimumFractionDigits,
    maximumFractionDigits,
  });
};

/**
 * Format a number with thousands separators (legacy function for backward compatibility)
 */
export const formatAmount = (amount: number | undefined | null): string => {
  const safeAmount = amount ?? 0;
  return formatNumber(safeAmount, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  });
};

/**
 * Format a number as Pakistani Rupees
 */
export const formatPKR = (amount: number): string => {
  return formatCurrency(amount, {
    currency: "PKR",
    locale: "en-PK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    showSymbol: true,
  });
};

/**
 * Format a number as US Dollars
 */
export const formatUSD = (amount: number): string => {
  return formatCurrency(amount, {
    currency: "USD",
    locale: "en-US",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    showSymbol: true,
  });
};

/**
 * Format a number in compact notation (e.g., 1K, 1M, 1B)
 */
export const formatCompact = (value: number): string => {
  return formatNumber(value, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });
};

/**
 * Format a number with specific decimal places
 */
export const formatDecimal = (value: number, decimals: number = 2): string => {
  return formatNumber(value, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
