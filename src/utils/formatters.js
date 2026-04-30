/**
 * Data formatting utilities for the Healthcare Member Portal.
 * Provides functions for formatting currency, dates, percentages,
 * claim statuses, phone numbers, and other display values.
 *
 * @module formatters
 */

import {
  CLAIM_STATUS_LABELS,
  CLAIM_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  NOTIFICATION_TYPE_LABELS,
  COVERAGE_TYPE_LABELS,
} from '../constants/constants.js';

/**
 * Formats a number as a US currency string.
 * @param {number|string|null|undefined} amount - The amount to format
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.showCents=true] - Whether to show cents
 * @param {boolean} [options.showSign=false] - Whether to show + for positive amounts
 * @param {string} [options.fallback='$0.00'] - Fallback value if amount is invalid
 * @returns {string} Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount, options = {}) => {
  const { showCents = true, showSign = false, fallback = '$0.00' } = options;

  if (amount === null || amount === undefined || amount === '') {
    return fallback;
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return fallback;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(Math.abs(numericAmount));

  if (numericAmount < 0) {
    return `-${formatted}`;
  }

  if (showSign && numericAmount > 0) {
    return `+${formatted}`;
  }

  return formatted;
};

/**
 * Formats a date string into a display-friendly format.
 * @param {string|Date|null|undefined} dateValue - The date to format (YYYY-MM-DD, ISO 8601, or Date object)
 * @param {Object} [options] - Formatting options
 * @param {string} [options.format='MM/DD/YYYY'] - Output format ('MM/DD/YYYY', 'MMMM DD, YYYY', 'MMM DD, YYYY', 'MM/DD/YYYY hh:mm A', 'YYYY-MM-DD')
 * @param {string} [options.fallback='—'] - Fallback value if date is invalid
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue, options = {}) => {
  const { format = 'MM/DD/YYYY', fallback = '—' } = options;

  if (!dateValue) {
    return fallback;
  }

  let date;

  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    // Handle YYYY-MM-DD format without timezone issues
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [year, month, day] = dateValue.split('-').map(Number);
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateValue);
    }
  } else {
    return fallback;
  }

  if (isNaN(date.getTime())) {
    return fallback;
  }

  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const monthAbbreviations = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  const pad = (num) => String(num).padStart(2, '0');

  switch (format) {
    case 'MM/DD/YYYY':
      return `${pad(month + 1)}/${pad(day)}/${year}`;

    case 'MMMM DD, YYYY':
      return `${monthNames[month]} ${day}, ${year}`;

    case 'MMM DD, YYYY':
      return `${monthAbbreviations[month]} ${day}, ${year}`;

    case 'MMMM YYYY':
      return `${monthNames[month]} ${year}`;

    case 'MM/DD/YYYY hh:mm A': {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${pad(month + 1)}/${pad(day)}/${year} ${pad(displayHours)}:${pad(minutes)} ${period}`;
    }

    case 'YYYY-MM-DD':
      return `${year}-${pad(month + 1)}-${pad(day)}`;

    default:
      return `${pad(month + 1)}/${pad(day)}/${year}`;
  }
};

/**
 * Formats a date string as a relative time description (e.g., "2 days ago", "in 3 hours").
 * @param {string|Date|null|undefined} dateValue - The date to format
 * @param {string} [fallback='—'] - Fallback value if date is invalid
 * @returns {string} Relative time string
 */
export const formatRelativeDate = (dateValue, fallback = '—') => {
  if (!dateValue) {
    return fallback;
  }

  let date;

  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    return fallback;
  }

  if (isNaN(date.getTime())) {
    return fallback;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const isFuture = diffMs < 0;
  const prefix = isFuture ? 'in ' : '';
  const suffix = isFuture ? '' : ' ago';

  if (diffSeconds < 60) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    const label = diffMinutes === 1 ? 'minute' : 'minutes';
    return `${prefix}${diffMinutes} ${label}${suffix}`;
  }

  if (diffHours < 24) {
    const label = diffHours === 1 ? 'hour' : 'hours';
    return `${prefix}${diffHours} ${label}${suffix}`;
  }

  if (diffDays < 7) {
    const label = diffDays === 1 ? 'day' : 'days';
    return `${prefix}${diffDays} ${label}${suffix}`;
  }

  if (diffWeeks < 5) {
    const label = diffWeeks === 1 ? 'week' : 'weeks';
    return `${prefix}${diffWeeks} ${label}${suffix}`;
  }

  if (diffMonths < 12) {
    const label = diffMonths === 1 ? 'month' : 'months';
    return `${prefix}${diffMonths} ${label}${suffix}`;
  }

  const label = diffYears === 1 ? 'year' : 'years';
  return `${prefix}${diffYears} ${label}${suffix}`;
};

/**
 * Formats a number as a percentage string.
 * @param {number|null|undefined} value - The value to format (0-100 or 0-1 depending on options)
 * @param {Object} [options] - Formatting options
 * @param {number} [options.decimals=0] - Number of decimal places
 * @param {boolean} [options.isDecimal=false] - Whether the value is a decimal (0-1) that should be multiplied by 100
 * @param {string} [options.fallback='0%'] - Fallback value if value is invalid
 * @returns {string} Formatted percentage string (e.g., "75%")
 */
export const formatPercentage = (value, options = {}) => {
  const { decimals = 0, isDecimal = false, fallback = '0%' } = options;

  if (value === null || value === undefined) {
    return fallback;
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return fallback;
  }

  const percentValue = isDecimal ? numericValue * 100 : numericValue;

  return `${percentValue.toFixed(decimals)}%`;
};

/**
 * Calculates and formats a percentage from used/max values (e.g., deductible progress).
 * @param {number} used - The amount used
 * @param {number} max - The maximum amount
 * @param {number} [decimals=0] - Number of decimal places
 * @returns {string} Formatted percentage string (e.g., "25%")
 */
export const formatProgressPercentage = (used, max, decimals = 0) => {
  if (!max || max === 0) {
    return '0%';
  }

  const percentage = Math.min((used / max) * 100, 100);
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Formats a phone number string into a display-friendly format.
 * @param {string|null|undefined} phone - The phone number to format
 * @param {string} [fallback='—'] - Fallback value if phone is invalid
 * @returns {string} Formatted phone number (e.g., "(555) 123-4567" or "1-800-555-0199")
 */
export const formatPhoneNumber = (phone, fallback = '—') => {
  if (!phone || typeof phone !== 'string') {
    return fallback;
  }

  // If already formatted (contains parentheses, dashes with 1- prefix, etc.), return as-is
  if (/^\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(phone.trim())) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  }

  // If it starts with 1- and is already formatted, return as-is
  if (/^1-\d{3}-\d{3}-\d{4}$/.test(phone.trim())) {
    return phone.trim();
  }

  // Strip non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11 && digits.startsWith('1')) {
    return `1-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return original if we can't parse it
  return phone;
};

/**
 * Returns the human-readable label for a claim status.
 * @param {string|null|undefined} status - The claim status code
 * @param {string} [fallback='Unknown'] - Fallback value if status is not found
 * @returns {string} Human-readable claim status label
 */
export const formatClaimStatus = (status, fallback = 'Unknown') => {
  if (!status) {
    return fallback;
  }

  return CLAIM_STATUS_LABELS[status] || fallback;
};

/**
 * Returns the human-readable label for a claim type.
 * @param {string|null|undefined} type - The claim type code
 * @param {string} [fallback='Unknown'] - Fallback value if type is not found
 * @returns {string} Human-readable claim type label
 */
export const formatClaimType = (type, fallback = 'Unknown') => {
  if (!type) {
    return fallback;
  }

  return CLAIM_TYPE_LABELS[type] || fallback;
};

/**
 * Returns the human-readable label for a coverage type.
 * @param {string|null|undefined} coverageType - The coverage type code
 * @param {string} [fallback='Unknown'] - Fallback value if coverage type is not found
 * @returns {string} Human-readable coverage type label
 */
export const formatCoverageType = (coverageType, fallback = 'Unknown') => {
  if (!coverageType) {
    return fallback;
  }

  return COVERAGE_TYPE_LABELS[coverageType] || fallback;
};

/**
 * Returns the human-readable label for a document category.
 * @param {string|null|undefined} category - The document category code
 * @param {string} [fallback='Unknown'] - Fallback value if category is not found
 * @returns {string} Human-readable document category label
 */
export const formatDocumentCategory = (category, fallback = 'Unknown') => {
  if (!category) {
    return fallback;
  }

  return DOCUMENT_CATEGORY_LABELS[category] || fallback;
};

/**
 * Returns the human-readable label for a notification type.
 * @param {string|null|undefined} type - The notification type code
 * @param {string} [fallback='Unknown'] - Fallback value if type is not found
 * @returns {string} Human-readable notification type label
 */
export const formatNotificationType = (type, fallback = 'Unknown') => {
  if (!type) {
    return fallback;
  }

  return NOTIFICATION_TYPE_LABELS[type] || fallback;
};

/**
 * Formats a file size in bytes to a human-readable string.
 * @param {number|null|undefined} bytes - The file size in bytes
 * @param {number} [decimals=1] - Number of decimal places
 * @param {string} [fallback='0 B'] - Fallback value if bytes is invalid
 * @returns {string} Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes, decimals = 1, fallback = '0 B') => {
  if (bytes === null || bytes === undefined || isNaN(bytes)) {
    return fallback;
  }

  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const index = Math.min(i, units.length - 1);

  const value = bytes / Math.pow(k, index);

  return `${value.toFixed(decimals)} ${units[index]}`;
};

/**
 * Formats a member ID for display.
 * @param {string|null|undefined} memberId - The member ID
 * @param {string} [fallback='—'] - Fallback value if member ID is invalid
 * @returns {string} Formatted member ID
 */
export const formatMemberId = (memberId, fallback = '—') => {
  if (!memberId || typeof memberId !== 'string') {
    return fallback;
  }

  return memberId;
};

/**
 * Formats a name for display (first + last).
 * @param {string|null|undefined} firstName - First name
 * @param {string|null|undefined} lastName - Last name
 * @param {string} [fallback='—'] - Fallback value if both names are empty
 * @returns {string} Formatted full name
 */
export const formatName = (firstName, lastName, fallback = '—') => {
  const parts = [];

  if (firstName && typeof firstName === 'string' && firstName.trim()) {
    parts.push(firstName.trim());
  }

  if (lastName && typeof lastName === 'string' && lastName.trim()) {
    parts.push(lastName.trim());
  }

  return parts.length > 0 ? parts.join(' ') : fallback;
};

/**
 * Formats an address object into a single-line or multi-line string.
 * @param {Object|null|undefined} address - The address object
 * @param {string} [address.street] - Street address
 * @param {string} [address.city] - City
 * @param {string} [address.state] - State abbreviation
 * @param {string} [address.zipCode] - ZIP code
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.multiLine=false] - Whether to format as multi-line
 * @param {string} [options.fallback='—'] - Fallback value if address is invalid
 * @returns {string} Formatted address string
 */
export const formatAddress = (address, options = {}) => {
  const { multiLine = false, fallback = '—' } = options;

  if (!address || typeof address !== 'object') {
    return fallback;
  }

  const { street, city, state, zipCode } = address;

  const parts = [];

  if (street && street.trim()) {
    parts.push(street.trim());
  }

  const cityStateZip = [];
  if (city && city.trim()) {
    cityStateZip.push(city.trim());
  }
  if (state && state.trim()) {
    if (cityStateZip.length > 0) {
      cityStateZip[cityStateZip.length - 1] += ',';
    }
    cityStateZip.push(state.trim());
  }
  if (zipCode && zipCode.trim()) {
    cityStateZip.push(zipCode.trim());
  }

  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(' '));
  }

  if (parts.length === 0) {
    return fallback;
  }

  return multiLine ? parts.join('\n') : parts.join(', ');
};

/**
 * Formats a date range for display.
 * @param {string|null|undefined} startDate - Start date (YYYY-MM-DD)
 * @param {string|null|undefined} endDate - End date (YYYY-MM-DD)
 * @param {Object} [options] - Formatting options
 * @param {string} [options.format='MM/DD/YYYY'] - Date format to use
 * @param {string} [options.separator=' – '] - Separator between dates
 * @param {string} [options.fallback='—'] - Fallback value if dates are invalid
 * @returns {string} Formatted date range string
 */
export const formatDateRange = (startDate, endDate, options = {}) => {
  const { format = 'MM/DD/YYYY', separator = ' – ', fallback = '—' } = options;

  const formattedStart = formatDate(startDate, { format, fallback: '' });
  const formattedEnd = formatDate(endDate, { format, fallback: '' });

  if (!formattedStart && !formattedEnd) {
    return fallback;
  }

  if (!formattedEnd || formattedStart === formattedEnd) {
    return formattedStart || fallback;
  }

  if (!formattedStart) {
    return formattedEnd;
  }

  return `${formattedStart}${separator}${formattedEnd}`;
};

/**
 * Formats a number with thousands separators.
 * @param {number|string|null|undefined} value - The number to format
 * @param {Object} [options] - Formatting options
 * @param {number} [options.decimals=0] - Number of decimal places
 * @param {string} [options.fallback='0'] - Fallback value if value is invalid
 * @returns {string} Formatted number string (e.g., "1,234")
 */
export const formatNumber = (value, options = {}) => {
  const { decimals = 0, fallback = '0' } = options;

  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    return fallback;
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue);
};

/**
 * Truncates a string to a specified length and appends an ellipsis.
 * @param {string|null|undefined} text - The text to truncate
 * @param {number} [maxLength=100] - Maximum length before truncation
 * @param {string} [ellipsis='…'] - Ellipsis string to append
 * @returns {string} Truncated string
 */
export const truncateText = (text, maxLength = 100, ellipsis = '…') => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trimEnd() + ellipsis;
};

/**
 * Formats a plan status string for display.
 * @param {string|null|undefined} status - The plan status (active, terminated, pending)
 * @param {string} [fallback='Unknown'] - Fallback value if status is invalid
 * @returns {string} Formatted plan status with capitalized first letter
 */
export const formatPlanStatus = (status, fallback = 'Unknown') => {
  if (!status || typeof status !== 'string') {
    return fallback;
  }

  const trimmed = status.trim().toLowerCase();

  if (!trimmed) {
    return fallback;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Formats a prescription refills display string.
 * @param {number|null|undefined} remaining - Refills remaining
 * @param {number|null|undefined} total - Total refills authorized
 * @param {string} [fallback='—'] - Fallback value if values are invalid
 * @returns {string} Formatted refills string (e.g., "3 of 5 remaining")
 */
export const formatRefills = (remaining, total, fallback = '—') => {
  if (remaining === null || remaining === undefined || total === null || total === undefined) {
    return fallback;
  }

  if (total === 0 && remaining === 0) {
    return 'No refills';
  }

  return `${remaining} of ${total} remaining`;
};

/**
 * Formats a days supply value for display.
 * @param {number|null|undefined} daysSupply - Number of days supply
 * @param {string} [fallback='—'] - Fallback value if value is invalid
 * @returns {string} Formatted days supply string (e.g., "90-day supply")
 */
export const formatDaysSupply = (daysSupply, fallback = '—') => {
  if (daysSupply === null || daysSupply === undefined || isNaN(daysSupply)) {
    return fallback;
  }

  return `${daysSupply}-day supply`;
};