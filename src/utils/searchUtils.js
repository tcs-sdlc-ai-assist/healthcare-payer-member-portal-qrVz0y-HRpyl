/**
 * Search utility functions for the Healthcare Member Portal.
 * Provides functions for filtering the static search index by query string,
 * ranking results by relevance, and returning matched portal pages and documents.
 * Excludes PHI/PII from search scope — only searches portal page names,
 * feature labels, document titles, and FAQ content.
 *
 * @module searchUtils
 */

import {
  searchPortal,
  getSearchSuggestions,
  getSearchEntriesByCategory,
  getSearchCategories,
  searchIndex,
} from '../data/searchIndex.js';
import { getFAQsByCategory, searchFAQs } from '../data/getCareData.js';

/**
 * Minimum query length required to perform a search.
 * @type {number}
 */
const MIN_QUERY_LENGTH = 2;

/**
 * Maximum number of search results to return by default.
 * @type {number}
 */
const DEFAULT_MAX_RESULTS = 20;

/**
 * Maximum number of suggestions to return by default.
 * @type {number}
 */
const DEFAULT_MAX_SUGGESTIONS = 5;

/**
 * Sanitizes a search query string by trimming whitespace and removing
 * potentially harmful characters. Does not allow HTML or script injection.
 * @param {string|null|undefined} query - The raw search query
 * @returns {string} Sanitized query string
 */
export const sanitizeQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return '';
  }

  return query
    .trim()
    .replace(/[<>{}]/g, '')
    .replace(/\s+/g, ' ');
};

/**
 * Validates whether a search query meets minimum requirements.
 * @param {string|null|undefined} query - The search query to validate
 * @returns {boolean} True if the query is valid for searching
 */
export const isValidQuery = (query) => {
  if (!query || typeof query !== 'string') {
    return false;
  }

  const sanitized = sanitizeQuery(query);
  return sanitized.length >= MIN_QUERY_LENGTH;
};

/**
 * Performs a full portal search using the static search index.
 * Returns results ranked by relevance score.
 * Does not search PHI/PII — only portal pages, features, documents, and FAQs.
 *
 * @param {string} query - The search query string
 * @param {Object} [options] - Search options
 * @param {string} [options.category] - Filter results by category ('page', 'document', 'feature', 'faq')
 * @param {number} [options.limit] - Maximum number of results to return
 * @returns {Object} Search results object with results array, query, and metadata
 */
export const performSearch = (query, options = {}) => {
  const sanitized = sanitizeQuery(query);
  const limit = options.limit || DEFAULT_MAX_RESULTS;

  if (!isValidQuery(sanitized)) {
    return {
      query: sanitized,
      results: [],
      totalResults: 0,
      hasResults: false,
      category: options.category || null,
    };
  }

  const searchOptions = {};

  if (options.category) {
    searchOptions.category = options.category;
  }

  if (limit) {
    searchOptions.limit = limit;
  }

  const results = searchPortal(sanitized, searchOptions);

  return {
    query: sanitized,
    results,
    totalResults: results.length,
    hasResults: results.length > 0,
    category: options.category || null,
  };
};

/**
 * Returns search suggestions for autocomplete based on a partial query.
 * Results are sorted by priority/relevance.
 *
 * @param {string} partial - The partial search query
 * @param {number} [limit] - Maximum number of suggestions to return
 * @returns {Object[]} Array of suggestion objects with id, title, route, category, and icon
 */
export const getSuggestions = (partial, limit) => {
  const sanitized = sanitizeQuery(partial);

  if (!isValidQuery(sanitized)) {
    return [];
  }

  const maxSuggestions = limit || DEFAULT_MAX_SUGGESTIONS;

  return getSearchSuggestions(sanitized, maxSuggestions);
};

/**
 * Searches across both the portal search index and FAQs.
 * Combines and deduplicates results, returning a unified result set.
 *
 * @param {string} query - The search query string
 * @param {Object} [options] - Search options
 * @param {number} [options.limit] - Maximum number of results to return
 * @param {boolean} [options.includeFAQs=true] - Whether to include FAQ results
 * @returns {Object} Combined search results with portal results and FAQ results
 */
export const searchAll = (query, options = {}) => {
  const sanitized = sanitizeQuery(query);
  const limit = options.limit || DEFAULT_MAX_RESULTS;
  const includeFAQs = options.includeFAQs !== false;

  if (!isValidQuery(sanitized)) {
    return {
      query: sanitized,
      portalResults: [],
      faqResults: [],
      totalResults: 0,
      hasResults: false,
    };
  }

  const portalResults = searchPortal(sanitized, { limit });

  let faqResults = [];
  if (includeFAQs) {
    faqResults = searchFAQs(sanitized);
  }

  const totalResults = portalResults.length + faqResults.length;

  return {
    query: sanitized,
    portalResults,
    faqResults,
    totalResults,
    hasResults: totalResults > 0,
  };
};

/**
 * Groups search results by their category for organized display.
 *
 * @param {Object[]} results - Array of search result objects
 * @returns {Object} Object with category keys and arrays of results as values
 */
export const groupResultsByCategory = (results) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return {};
  }

  const grouped = {};

  results.forEach((result) => {
    const category = result.category || 'other';

    if (!grouped[category]) {
      grouped[category] = [];
    }

    grouped[category].push(result);
  });

  return grouped;
};

/**
 * Returns a human-readable label for a search result category.
 *
 * @param {string} category - The category identifier
 * @returns {string} Human-readable category label
 */
export const getCategoryLabel = (category) => {
  const labels = {
    page: 'Pages',
    document: 'Documents',
    feature: 'Features',
    faq: 'Help & FAQs',
    other: 'Other',
  };

  return labels[category] || 'Other';
};

/**
 * Returns all available search categories with their labels.
 *
 * @returns {Object[]} Array of category objects with id and label
 */
export const getAvailableCategories = () => {
  const categories = getSearchCategories();

  return categories.map((category) => ({
    id: category,
    label: getCategoryLabel(category),
  }));
};

/**
 * Returns search results filtered to only portal pages.
 *
 * @param {string} query - The search query string
 * @param {number} [limit] - Maximum number of results to return
 * @returns {Object[]} Array of page search results
 */
export const searchPages = (query, limit) => {
  const result = performSearch(query, { category: 'page', limit });
  return result.results;
};

/**
 * Returns search results filtered to only documents.
 *
 * @param {string} query - The search query string
 * @param {number} [limit] - Maximum number of results to return
 * @returns {Object[]} Array of document search results
 */
export const searchDocuments = (query, limit) => {
  const result = performSearch(query, { category: 'document', limit });
  return result.results;
};

/**
 * Returns search results filtered to only features.
 *
 * @param {string} query - The search query string
 * @param {number} [limit] - Maximum number of results to return
 * @returns {Object[]} Array of feature search results
 */
export const searchFeatures = (query, limit) => {
  const result = performSearch(query, { category: 'feature', limit });
  return result.results;
};

/**
 * Returns search results filtered to only FAQs from the search index.
 *
 * @param {string} query - The search query string
 * @param {number} [limit] - Maximum number of results to return
 * @returns {Object[]} Array of FAQ search results
 */
export const searchFAQEntries = (query, limit) => {
  const result = performSearch(query, { category: 'faq', limit });
  return result.results;
};

/**
 * Highlights matching text within a string by wrapping matches in <mark> tags.
 * Returns an array of parts with { text, highlighted } for safe React rendering.
 * Does not use dangerouslySetInnerHTML.
 *
 * @param {string} text - The text to highlight within
 * @param {string} query - The search query to highlight
 * @returns {Object[]} Array of { text: string, highlighted: boolean } objects
 */
export const highlightMatches = (text, query) => {
  if (!text || typeof text !== 'string') {
    return [{ text: '', highlighted: false }];
  }

  const sanitized = sanitizeQuery(query);

  if (!sanitized || sanitized.length < MIN_QUERY_LENGTH) {
    return [{ text, highlighted: false }];
  }

  const escapedQuery = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) {
    return [{ text, highlighted: false }];
  }

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlighted: regex.test(part),
    }));
};

/**
 * Returns the total number of searchable entries in the search index.
 *
 * @returns {number} Total number of search index entries
 */
export const getSearchIndexSize = () => {
  return searchIndex.length;
};

/**
 * Returns search entries for a specific category from the search index.
 *
 * @param {string} category - The category to retrieve ('page', 'document', 'feature', 'faq')
 * @returns {Object[]} Array of search index entries for the category
 */
export const getEntriesByCategory = (category) => {
  if (!category || typeof category !== 'string') {
    return [];
  }

  return getSearchEntriesByCategory(category);
};

/**
 * Creates a search result summary string for display.
 *
 * @param {number} totalResults - Total number of results found
 * @param {string} query - The search query
 * @returns {string} Human-readable search summary string
 */
export const getSearchSummaryText = (totalResults, query) => {
  const sanitized = sanitizeQuery(query);

  if (!isValidQuery(sanitized)) {
    return 'Please enter at least 2 characters to search.';
  }

  if (totalResults === 0) {
    return `No results found for "${sanitized}".`;
  }

  if (totalResults === 1) {
    return `1 result found for "${sanitized}".`;
  }

  return `${totalResults} results found for "${sanitized}".`;
};

/**
 * Returns recent/popular search terms for display.
 * In the MVP, returns a static list of common search terms.
 *
 * @returns {string[]} Array of suggested search term strings
 */
export const getPopularSearchTerms = () => {
  return [
    'claims',
    'id card',
    'deductible',
    'find a doctor',
    'eob',
    'payments',
    'prior authorization',
    'appeal',
    'prescription',
    'coverage',
  ];
};