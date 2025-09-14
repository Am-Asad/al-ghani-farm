import {
  parseISO,
  parse,
  isValid,
  format,
  startOfDay,
  endOfDay,
  isAfter,
  isBefore,
  subYears,
  addYears,
} from "date-fns";

/**
 * Parse a date string in various formats and convert to ISO format
 * @param {string} dateString - The date string to parse
 * @returns {Object} - Object with startOfDay and endOfDay in ISO format
 * @throws {Error} - If date string is invalid or cannot be parsed
 */
export const parseDateToISO = (dateString) => {
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Date string is required and must be a string");
  }

  // Remove any whitespace
  const cleanDateString = dateString.trim();

  let parsedDate;

  // Try parsing with different formats using date-fns
  const formats = [
    "yyyy-MM-dd", // 2024-01-15
    "dd/MM/yyyy", // 15/01/2024
    "MM/dd/yyyy", // 01/15/2024
    "dd-MM-yyyy", // 15-01-2024
    "MM-dd-yyyy", // 01-15-2024
    "dd.MM.yyyy", // 15.01.2024
    "MM.dd.yyyy", // 01.15.2024
    "yyyy/MM/dd", // 2024/01/15
    "dd/MM/yy", // 15/01/24
    "MM/dd/yy", // 01/15/24
    "dd-MM-yy", // 15-01-24
    "MM-dd-yy", // 01-15-24
    "dd.MM.yy", // 15.01.24
    "MM.dd.yy", // 01.15.24
    "yyyy/MM/dd", // 2024/01/15
    "yyyy-MM-dd HH:mm:ss", // 2024-01-15 10:30:00
    "dd/MM/yyyy HH:mm:ss", // 15/01/2024 10:30:00
    "MM/dd/yyyy HH:mm:ss", // 01/15/2024 10:30:00
  ];

  // First try parseISO for standard ISO format
  parsedDate = parseISO(cleanDateString);

  if (!isValid(parsedDate)) {
    // Try each format until one works
    for (const formatStr of formats) {
      try {
        parsedDate = parse(cleanDateString, formatStr, new Date());
        if (isValid(parsedDate)) {
          break;
        }
      } catch (error) {
        // Continue to next format
        continue;
      }
    }
  }

  // If still not valid, try some additional parsing strategies
  if (!isValid(parsedDate)) {
    // Try parsing with just the date part if it contains time
    const dateOnly = cleanDateString.split(" ")[0].split("T")[0];
    if (dateOnly !== cleanDateString) {
      parsedDate = parseISO(dateOnly);
    }
  }

  // If still not valid, try some common edge cases
  if (!isValid(parsedDate)) {
    // Handle formats like "15/1/2024" or "1/15/2024"
    const parts = cleanDateString.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;

      // Try different interpretations
      const interpretations = [
        // DD/MM/YYYY
        { day: part1, month: part2, year: part3 },
        // MM/DD/YYYY
        { day: part2, month: part1, year: part3 },
        // YYYY/MM/DD
        { day: part3, month: part2, year: part1 },
      ];

      for (const interp of interpretations) {
        try {
          const year = parseInt(interp.year);
          const month = parseInt(interp.month);
          const day = parseInt(interp.day);

          // Validate reasonable ranges
          if (
            year >= 1900 &&
            year <= 2100 &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31
          ) {
            const testDate = new Date(year, month - 1, day);
            if (
              isValid(testDate) &&
              testDate.getFullYear() === year &&
              testDate.getMonth() === month - 1 &&
              testDate.getDate() === day
            ) {
              parsedDate = testDate;
              break;
            }
          }
        } catch (error) {
          continue;
        }
      }
    }
  }

  // Final validation
  if (!isValid(parsedDate)) {
    throw new Error(
      `Invalid date format: ${dateString}. Supported formats: YYYY-MM-DD, DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, etc.`
    );
  }

  // Check if date is reasonable (not too far in past or future)
  const now = new Date();
  const tenYearsAgo = subYears(now, 10);
  const tenYearsFromNow = addYears(now, 10);

  if (
    isBefore(parsedDate, tenYearsAgo) ||
    isAfter(parsedDate, tenYearsFromNow)
  ) {
    throw new Error(
      `Date ${format(
        parsedDate,
        "yyyy-MM-dd"
      )} is not reasonable. Please enter a date within the last 10 years or next 10 years.`
    );
  }

  // Create start and end of day in ISO format
  const startOfDayDate = startOfDay(parsedDate);
  const endOfDayDate = endOfDay(parsedDate);

  return {
    startOfDay: startOfDayDate.toISOString(),
    endOfDay: endOfDayDate.toISOString(),
    date: format(parsedDate, "yyyy-MM-dd"), // Return YYYY-MM-DD format
  };
};

/**
 * Validate if a date string is in a valid format
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateString = (dateString) => {
  try {
    parseDateToISO(dateString);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Format a date to a user-friendly string (matches frontend format-date.ts)
 * @param {string|Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDateForDisplay = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    return "Invalid Date";
  }

  return format(dateObj, "MMM dd, yyyy"); // Matches frontend format
};

/**
 * Convert any date to ISO format for database storage
 * @param {string|Date} date - The date to convert
 * @returns {string} - ISO date string
 */
export const toISOString = (date) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) {
    throw new Error("Invalid date provided");
  }

  return dateObj.toISOString();
};
