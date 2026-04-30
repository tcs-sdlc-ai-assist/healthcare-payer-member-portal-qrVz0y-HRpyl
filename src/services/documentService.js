/**
 * Document Center business logic service for the Healthcare Member Portal.
 * Provides getDocuments (with filtering, sorting, pagination), getDocumentDetails,
 * downloadDocument (with audit logging), and document summary functions.
 * Consumes documentsData fixture and integrates with auditLogger for document downloads.
 *
 * @module documentService
 */

import {
  documentsData,
  getDocumentsByMemberId,
  getAvailableDocumentsByMemberId,
  getDocumentById,
  getDocumentsByCategory,
  getDocumentsByClaimId,
  filterDocuments,
  getDocumentsSummary,
  getRecentDocuments,
} from '../data/documentsData.js';
import { logDocumentDownload, logEvent, AUDIT_ACTIONS } from '../services/auditLogger.js';
import {
  DOCUMENT_CATEGORY,
  DOCUMENT_CATEGORY_LABELS,
  PAGINATION,
} from '../constants/constants.js';
import {
  formatDate,
  formatFileSize,
  formatDocumentCategory,
} from '../utils/formatters.js';

/**
 * Enriches a document object with computed display properties.
 *
 * @param {Object} doc - The raw document data object
 * @returns {Object} Enriched document object with additional display properties
 */
const enrichDocument = (doc) => {
  if (!doc) {
    return null;
  }

  return {
    ...doc,
    categoryLabel: DOCUMENT_CATEGORY_LABELS[doc.category] || doc.category,
    formattedDateCreated: formatDate(doc.dateCreated),
    formattedDateModified: formatDate(doc.dateModified),
    formattedFileSize: doc.fileSizeDisplay || formatFileSize(doc.fileSize),
    isAvailable: doc.status === 'available',
    isArchived: doc.status === 'archived',
    isPending: doc.status === 'pending',
    statusLabel: doc.status ? doc.status.charAt(0).toUpperCase() + doc.status.slice(1) : 'Unknown',
    hasRelatedClaim: doc.relatedClaimId !== null,
  };
};

/**
 * Retrieves a paginated, filtered, and sorted list of documents for a member.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - The member identifier (required)
 * @param {string} [params.category] - Document category filter (EOB, ID_CARD, PLAN_DOCUMENTS, etc.)
 * @param {string} [params.status] - Document status filter ('available', 'archived', 'pending')
 * @param {string} [params.dateFrom] - Start date for date created range (YYYY-MM-DD)
 * @param {string} [params.dateTo] - End date for date created range (YYYY-MM-DD)
 * @param {string} [params.search] - Search term for title or description (case-insensitive partial match)
 * @param {string} [params.sortBy] - Sort field ('dateCreated', 'title', 'category', 'fileSize')
 * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
 * @param {number} [params.page=1] - Page number (1-based)
 * @param {number} [params.pageSize=10] - Number of items per page
 * @returns {Object} Object with documents array, pagination info, summary, and error
 */
export const getDocuments = (params = {}) => {
  if (!params.memberId) {
    return {
      documents: [],
      pagination: {
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      },
      summary: null,
      error: 'memberId is required.',
    };
  }

  const filters = {
    memberId: params.memberId,
  };

  if (params.category) {
    filters.category = params.category;
  }

  if (params.status) {
    filters.status = params.status;
  }

  if (params.dateFrom) {
    filters.dateFrom = params.dateFrom;
  }

  if (params.dateTo) {
    filters.dateTo = params.dateTo;
  }

  if (params.search) {
    filters.search = params.search;
  }

  if (params.sortBy) {
    filters.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    filters.sortOrder = params.sortOrder;
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : PAGINATION.defaultPageSize;

  filters.page = page;
  filters.pageSize = pageSize;

  const result = filterDocuments(filters);

  const enrichedDocuments = result.documents.map((doc) => enrichDocument(doc));

  const summary = getDocumentsSummary(params.memberId);

  return {
    documents: enrichedDocuments,
    pagination: result.pagination,
    summary,
    error: null,
  };
};

/**
 * Retrieves detailed information for a single document.
 * Optionally logs a document view audit event.
 *
 * @param {string} documentId - The document identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @param {boolean} [options.logView=false] - Whether to log a document view audit event
 * @returns {Object|null} Enriched document details object or null if not found
 */
export const getDocumentDetails = (documentId, options = {}) => {
  if (!documentId) {
    return null;
  }

  const doc = getDocumentById(documentId);

  if (!doc) {
    return null;
  }

  if (options.logView && options.memberId) {
    logEvent({
      memberId: options.memberId,
      action: AUDIT_ACTIONS.DOCUMENT_VIEW,
      targetId: documentId,
      metadata: {
        documentId,
        title: doc.title,
        category: doc.category,
      },
    });
  }

  return enrichDocument(doc);
};

/**
 * Downloads a document and logs an audit event.
 * Returns the document metadata for the download action.
 *
 * @param {string} documentId - The document identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging (required for audit)
 * @returns {Object} Result object with success status, document metadata, and error
 */
export const downloadDocument = (documentId, options = {}) => {
  if (!documentId) {
    return {
      success: false,
      error: 'documentId is required.',
      document: null,
    };
  }

  const doc = getDocumentById(documentId);

  if (!doc) {
    return {
      success: false,
      error: 'Document not found.',
      document: null,
    };
  }

  if (doc.status !== 'available') {
    return {
      success: false,
      error: 'Document is not available for download.',
      document: null,
    };
  }

  if (options.memberId) {
    logDocumentDownload(options.memberId, documentId, {
      title: doc.title,
      category: doc.category,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      relatedClaimId: doc.relatedClaimId,
    });
  }

  return {
    success: true,
    error: null,
    document: enrichDocument(doc),
  };
};

/**
 * Retrieves documents filtered by category for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {string} category - The document category to filter by
 * @returns {Object[]} Array of enriched document objects
 */
export const getDocumentsByCategoryForMember = (memberId, category) => {
  if (!memberId || !category) {
    return [];
  }

  const docs = getDocumentsByCategory(memberId, category);

  return docs.map((doc) => enrichDocument(doc));
};

/**
 * Retrieves documents related to a specific claim.
 *
 * @param {string} claimId - The claim identifier
 * @returns {Object[]} Array of enriched document objects related to the claim
 */
export const getDocumentsForClaim = (claimId) => {
  if (!claimId) {
    return [];
  }

  const docs = getDocumentsByClaimId(claimId);

  return docs.map((doc) => enrichDocument(doc));
};

/**
 * Returns a summary of documents for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} Documents summary object or null if memberId is not provided
 */
export const getDocumentsSummaryForMember = (memberId) => {
  if (!memberId) {
    return null;
  }

  return getDocumentsSummary(memberId);
};

/**
 * Returns the most recent documents for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {number} [count=3] - Number of recent documents to return
 * @returns {Object[]} Array of enriched recent document objects
 */
export const getRecentDocumentsForMember = (memberId, count = 3) => {
  if (!memberId) {
    return [];
  }

  const docs = getRecentDocuments(memberId, count);

  return docs.map((doc) => enrichDocument(doc));
};

/**
 * Returns all available document category options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for document categories
 */
export const getDocumentCategoryOptions = () => {
  return Object.entries(DOCUMENT_CATEGORY).map(([key, value]) => ({
    value,
    label: DOCUMENT_CATEGORY_LABELS[value] || key,
  }));
};

/**
 * Returns all available document status options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for document statuses
 */
export const getDocumentStatusOptions = () => {
  return [
    { value: 'available', label: 'Available' },
    { value: 'archived', label: 'Archived' },
    { value: 'pending', label: 'Pending' },
  ];
};

/**
 * Returns available page size options for pagination.
 *
 * @returns {number[]} Array of page size options
 */
export const getPageSizeOptions = () => {
  return [...PAGINATION.pageSizeOptions];
};

/**
 * Returns all available (non-archived) documents for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of enriched available document objects
 */
export const getAvailableDocuments = (memberId) => {
  if (!memberId) {
    return [];
  }

  const docs = getAvailableDocumentsByMemberId(memberId);

  return docs.map((doc) => enrichDocument(doc));
};

/**
 * Searches documents by title or description for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {string} searchTerm - The search term (case-insensitive partial match)
 * @param {Object} [options] - Search options
 * @param {string} [options.category] - Optional category filter
 * @param {string} [options.status] - Optional status filter
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.pageSize=10] - Page size
 * @returns {Object} Object with documents array, pagination info, and error
 */
export const searchDocuments = (memberId, searchTerm, options = {}) => {
  if (!memberId) {
    return {
      documents: [],
      pagination: {
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      },
      error: 'memberId is required.',
    };
  }

  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
    return {
      documents: [],
      pagination: {
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      },
      error: 'Search term is required.',
    };
  }

  const filters = {
    memberId,
    search: searchTerm.trim(),
  };

  if (options.category) {
    filters.category = options.category;
  }

  if (options.status) {
    filters.status = options.status;
  }

  filters.page = options.page && options.page > 0 ? options.page : 1;
  filters.pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : PAGINATION.defaultPageSize;

  const result = filterDocuments(filters);

  const enrichedDocuments = result.documents.map((doc) => enrichDocument(doc));

  return {
    documents: enrichedDocuments,
    pagination: result.pagination,
    error: null,
  };
};

/**
 * Returns documents that require member attention (e.g., related to denied claims or pending info).
 *
 * @param {string} memberId - The member identifier
 * @param {string[]} relatedClaimIds - Array of claim IDs that require attention
 * @returns {Object[]} Array of enriched document objects related to the specified claims
 */
export const getDocumentsRequiringAttention = (memberId, relatedClaimIds = []) => {
  if (!memberId || !Array.isArray(relatedClaimIds) || relatedClaimIds.length === 0) {
    return [];
  }

  const memberDocs = getDocumentsByMemberId(memberId);

  const attentionDocs = memberDocs.filter(
    (doc) => doc.relatedClaimId && relatedClaimIds.includes(doc.relatedClaimId) && doc.status === 'available'
  );

  const sorted = [...attentionDocs].sort((a, b) => {
    if (a.dateCreated < b.dateCreated) return 1;
    if (a.dateCreated > b.dateCreated) return -1;
    return 0;
  });

  return sorted.map((doc) => enrichDocument(doc));
};