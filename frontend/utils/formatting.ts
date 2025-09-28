/**
 * Comprehensive formatting utilities for the Al Ghani Farm application
 *
 * This file consolidates all formatting functions including:
 * - Currency and amount formatting
 * - Date and time formatting
 * - Number formatting
 * - String formatting utilities
 */

// ==================== TYPES & INTERFACES ====================

export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showSymbol?: boolean;
}

export interface NumberFormatOptions {
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  notation?: "standard" | "scientific" | "engineering" | "compact";
  compactDisplay?: "short" | "long";
}

export interface DateFormatOptions {
  locale?: string;
  year?: "numeric" | "2-digit";
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow";
  day?: "numeric" | "2-digit";
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  timeZone?: string;
  hour12?: boolean;
}

// ==================== CURRENCY & AMOUNT FORMATTING ====================

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

// ==================== DATE & TIME FORMATTING ====================

/**
 * Format a date string to a readable format
 * Default format: "September 28, 2025"
 */
export const formatDate = (
  dateString: string,
  options: DateFormatOptions = {}
): string => {
  const {
    locale = "en-US",
    year = "numeric",
    month = "long",
    day = "numeric",
  } = options;

  return new Date(dateString).toLocaleDateString(locale, {
    year,
    month,
    day,
  });
};

/**
 * Format a date to a full date and time string
 * Default format: "September 28, 2025 at 2:30 PM"
 */
export const formatDateTime = (
  dateString: string,
  options: DateFormatOptions = {}
): string => {
  const {
    locale = "en-US",
    year = "numeric",
    month = "long",
    day = "numeric",
    hour = "numeric",
    minute = "2-digit",
    hour12 = true,
  } = options;

  return new Date(dateString).toLocaleString(locale, {
    year,
    month,
    day,
    hour,
    minute,
    hour12,
  });
};

/**
 * Format a date to a compact readable format
 * Default format: "Sep 28, 2025" (for tables and compact spaces)
 */
export const formatDateCompact = (
  dateString: string,
  options: DateFormatOptions = {}
): string => {
  const {
    locale = "en-US",
    year = "numeric",
    month = "short",
    day = "numeric",
  } = options;

  return new Date(dateString).toLocaleDateString(locale, {
    year,
    month,
    day,
  });
};

/**
 * Format a date to time only
 */
export const formatTime = (
  dateString: string,
  options: DateFormatOptions = {}
): string => {
  const {
    locale = "en-US",
    hour = "2-digit",
    minute = "2-digit",
    second = "2-digit",
    hour12 = true,
  } = options;

  return new Date(dateString).toLocaleTimeString(locale, {
    hour,
    minute,
    second,
    hour12,
  });
};

/**
 * Format a date to a relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (
  dateString: string,
  locale: string = "en-US"
): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, "second");
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), "minute");
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), "hour");
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), "day");
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), "month");
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), "year");
  }
};

/**
 * Format a date to ISO string (YYYY-MM-DD)
 */
export const formatDateISO = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
};

/**
 * Format a date to a custom format string
 */
export const formatDateCustom = (
  dateString: string,
  format: string
): string => {
  const date = new Date(dateString);

  const formatMap: Record<string, string> = {
    YYYY: date.getFullYear().toString(),
    YY: date.getFullYear().toString().slice(-2),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    M: (date.getMonth() + 1).toString(),
    DD: date.getDate().toString().padStart(2, "0"),
    D: date.getDate().toString(),
    HH: date.getHours().toString().padStart(2, "0"),
    H: date.getHours().toString(),
    mm: date.getMinutes().toString().padStart(2, "0"),
    m: date.getMinutes().toString(),
    ss: date.getSeconds().toString().padStart(2, "0"),
    s: date.getSeconds().toString(),
  };

  let formatted = format;
  Object.entries(formatMap).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(key, "g"), value);
  });

  return formatted;
};

// ==================== STRING & TEXT FORMATTING ====================

/**
 * Format a single digit with leading zero if needed
 */
export const formatSingleDigit = (digit: number | string): string => {
  const str = digit?.toString() || "";
  return str.length === 1 ? `0${str}` : str;
};

/**
 * Format a string to title case
 */
export const formatTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Format a string to camel case
 */
export const formatCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Format a string to kebab case
 */
export const formatKebabCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Format a string to snake case
 */
export const formatSnakeCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

/**
 * Truncate a string to a specified length with ellipsis
 */
export const formatTruncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
};

/**
 * Format a phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Format initials from a name
 */
export const formatInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};

// ==================== FILE & DATA FORMATTING ====================

/**
 * Format file size in human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Format a file extension
 */
export const formatFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};

/**
 * Format a filename without extension
 */
export const formatFilename = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};

// ==================== VALIDATION & UTILITY FORMATTING ====================

/**
 * Format a validation error message
 */
export const formatValidationError = (
  field: string,
  message: string
): string => {
  return `${formatTitleCase(field)}: ${message}`;
};

/**
 * Format a list of items as a readable string
 */
export const formatList = (
  items: string[],
  conjunction: string = "and"
): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;

  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  return `${otherItems.join(", ")}, ${conjunction} ${lastItem}`;
};

/**
 * Format a range of numbers
 */
export const formatRange = (start: number, end: number): string => {
  return `${start} - ${end}`;
};

/**
 * Format a boolean value as Yes/No
 */
export const formatBoolean = (value: boolean): string => {
  return value ? "Yes" : "No";
};

/**
 * Format a boolean value as Active/Inactive
 */
export const formatStatus = (value: boolean): string => {
  return value ? "Active" : "Inactive";
};

// ==================== EXPORT ALL FORMATTING FUNCTIONS ====================

// All functions are already exported above with their individual export statements
