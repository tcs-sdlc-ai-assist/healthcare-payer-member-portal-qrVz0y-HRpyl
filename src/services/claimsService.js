/**
 * Claims business logic service for the Healthcare Member Portal.
 * Provides getClaims (with filtering, pagination, sorting), getClaimDetails,
 * submitClaim (stub), and getEOBPdf functions.
 * Consumes claimsData fixture and integrates with auditLogger for EOB downloads.
 *
 * @module claimsService
 */

import {
  claimsData,
  getClaimsByMemberId,
  getClaimById,
  getClaimByNumber,
  filterClaims,
  getClaimsSummary,
} from '../data/claimsData.js';
import { logEOBDownload, logClaimView, AUDIT_ACTIONS, logEvent } from '../services/auditLogger.js';
import { generateEOBPDF, getPDFBlob } from '../utils/pdfGenerator.js';
import {
  CLAIM_STATUS,
  CLAIM_STATUS_LABELS,
  CLAIM_STATUS_BADGE,
  CLAIM_TYPE,
  CLAIM_TYPE_LABELS,
  PAGINATION,
} from '../constants/constants.js';
import { formatCurrency, formatDate, formatClaimStatus, formatClaimType } from '../utils/formatters.js';

/**
 * Retrieves a paginated, filtered, and sorted list of claims for a member.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - The member identifier (required)
 * @param {string} [params.type] - Claim type filter (MEDICAL, DENTAL, VISION, etc.)
 * @param {string} [params.status] - Claim status filter (SUBMITTED, APPROVED, DENIED, etc.)
 * @param {string} [params.dateFrom] - Start date for service date range (YYYY-MM-DD)
 * @param {string} [params.dateTo] - End date for service date range (YYYY-MM-DD)
 * @param {string} [params.patient] - Patient name filter (case-insensitive partial match)
 * @param {string} [params.sortBy] - Sort field ('serviceDate', 'billedAmount', 'status')
 * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
 * @param {number} [params.page=1] - Page number (1-based)
 * @param {number} [params.pageSize=10] - Number of items per page
 * @returns {Object} Object with claims array, pagination info, and summary
 */
export const getClaims = (params = {}) => {
  if (!params.memberId) {
    return {
      claims: [],
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

  if (params.type) {
    filters.type = params.type;
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

  if (params.patient) {
    filters.patient = params.patient;
  }

  if (params.sortBy) {
    filters.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    filters.sortOrder = params.sortOrder;
  }

  const filteredClaims = filterClaims(filters);

  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : PAGINATION.defaultPageSize;
  const totalItems = filteredClaims.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + pageSize);

  const enrichedClaims = paginatedClaims.map((claim) => ({
    ...claim,
    statusLabel: CLAIM_STATUS_LABELS[claim.status] || claim.status,
    statusBadgeClass: CLAIM_STATUS_BADGE[claim.status] || 'hb-badge-neutral',
    typeLabel: CLAIM_TYPE_LABELS[claim.type] || claim.type,
    formattedBilledAmount: formatCurrency(claim.billedAmount),
    formattedPaidAmount: formatCurrency(claim.paidAmount),
    formattedMemberOwes: formatCurrency(claim.memberOwes),
    formattedAllowedAmount: formatCurrency(claim.allowedAmount),
    formattedServiceDate: formatDate(claim.serviceDate),
    formattedReceivedDate: formatDate(claim.receivedDate),
    formattedProcessedDate: formatDate(claim.processedDate),
    hasEOB: claim.eobDocument !== null,
  }));

  const summary = getClaimsSummary(params.memberId);

  return {
    claims: enrichedClaims,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems,
    },
    summary,
    error: null,
  };
};

/**
 * Retrieves detailed information for a single claim.
 * Optionally logs a claim view audit event.
 *
 * @param {string} claimId - The claim identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @param {boolean} [options.logView=false] - Whether to log a claim view audit event
 * @returns {Object|null} Enriched claim details object or null if not found
 */
export const getClaimDetails = (claimId, options = {}) => {
  if (!claimId) {
    return null;
  }

  const claim = getClaimById(claimId);

  if (!claim) {
    return null;
  }

  if (options.logView && options.memberId) {
    logClaimView(options.memberId, claimId, {
      claimNumber: claim.claimNumber,
      claimType: claim.type,
    });
  }

  const enrichedLineItems = (claim.lineItems || []).map((item) => ({
    ...item,
    formattedBilledAmount: formatCurrency(item.billedAmount),
    formattedAllowedAmount: formatCurrency(item.allowedAmount),
    formattedPaidAmount: formatCurrency(item.paidAmount),
    formattedMemberResponsibility: formatCurrency(item.memberResponsibility),
    formattedServiceDate: formatDate(item.serviceDate),
  }));

  return {
    ...claim,
    statusLabel: CLAIM_STATUS_LABELS[claim.status] || claim.status,
    statusBadgeClass: CLAIM_STATUS_BADGE[claim.status] || 'hb-badge-neutral',
    typeLabel: CLAIM_TYPE_LABELS[claim.type] || claim.type,
    formattedBilledAmount: formatCurrency(claim.billedAmount),
    formattedAllowedAmount: formatCurrency(claim.allowedAmount),
    formattedPaidAmount: formatCurrency(claim.paidAmount),
    formattedMemberOwes: formatCurrency(claim.memberOwes),
    formattedServiceDate: formatDate(claim.serviceDate),
    formattedServiceDateEnd: formatDate(claim.serviceDateEnd),
    formattedReceivedDate: formatDate(claim.receivedDate),
    formattedProcessedDate: formatDate(claim.processedDate),
    hasEOB: claim.eobDocument !== null,
    lineItems: enrichedLineItems,
    canAppeal: claim.status === CLAIM_STATUS.DENIED || claim.status === CLAIM_STATUS.PARTIALLY_APPROVED,
    isProcessed: claim.processedDate !== null,
    isPending: claim.status === CLAIM_STATUS.SUBMITTED ||
      claim.status === CLAIM_STATUS.IN_REVIEW ||
      claim.status === CLAIM_STATUS.PENDING_INFO,
  };
};

/**
 * Retrieves claim details by human-readable claim number.
 *
 * @param {string} claimNumber - The human-readable claim number
 * @param {Object} [options] - Options (same as getClaimDetails)
 * @returns {Object|null} Enriched claim details object or null if not found
 */
export const getClaimDetailsByNumber = (claimNumber, options = {}) => {
  if (!claimNumber) {
    return null;
  }

  const claim = getClaimByNumber(claimNumber);

  if (!claim) {
    return null;
  }

  return getClaimDetails(claim.claimId, options);
};

/**
 * Submits a new claim (stub implementation for MVP).
 * Returns a mock confirmation response.
 *
 * @param {Object} claimData - The claim submission data
 * @param {string} claimData.memberId - The member identifier
 * @param {string} claimData.type - The claim type
 * @param {string} claimData.provider - The provider name
 * @param {string} claimData.serviceDate - The date of service (YYYY-MM-DD)
 * @param {number} claimData.billedAmount - The billed amount
 * @param {string} [claimData.diagnosisCode] - The diagnosis code
 * @param {string} [claimData.diagnosisDescription] - The diagnosis description
 * @param {string} [claimData.notes] - Additional notes
 * @returns {Object} Submission result with confirmation details
 */
export const submitClaim = (claimData = {}) => {
  if (!claimData.memberId) {
    return {
      success: false,
      error: 'memberId is required.',
      claimId: null,
      claimNumber: null,
      status: null,
      message: null,
    };
  }

  if (!claimData.type) {
    return {
      success: false,
      error: 'Claim type is required.',
      claimId: null,
      claimNumber: null,
      status: null,
      message: null,
    };
  }

  if (!claimData.provider) {
    return {
      success: false,
      error: 'Provider is required.',
      claimId: null,
      claimNumber: null,
      status: null,
      message: null,
    };
  }

  if (!claimData.serviceDate) {
    return {
      success: false,
      error: 'Service date is required.',
      claimId: null,
      claimNumber: null,
      status: null,
      message: null,
    };
  }

  if (claimData.billedAmount === undefined || claimData.billedAmount === null || claimData.billedAmount < 0) {
    return {
      success: false,
      error: 'A valid billed amount is required.',
      claimId: null,
      claimNumber: null,
      status: null,
      message: null,
    };
  }

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const stubClaimId = `CLM-STUB-${timestamp}`;
  const stubClaimNumber = `CLM${random}${timestamp.substring(0, 4).toUpperCase()}`;

  logEvent({
    memberId: claimData.memberId,
    action: AUDIT_ACTIONS.CLAIM_VIEW,
    targetId: stubClaimId,
    metadata: {
      claimNumber: stubClaimNumber,
      claimType: claimData.type,
      action: 'CLAIM_SUBMITTED',
    },
  });

  return {
    success: true,
    error: null,
    claimId: stubClaimId,
    claimNumber: stubClaimNumber,
    status: CLAIM_STATUS.SUBMITTED,
    statusLabel: CLAIM_STATUS_LABELS[CLAIM_STATUS.SUBMITTED],
    message: 'Your claim has been submitted successfully. You can track its status in the Claims section.',
    submittedAt: new Date().toISOString(),
  };
};

/**
 * Generates and returns an EOB PDF for a given claim.
 * Logs an EOB download audit event.
 *
 * @param {string} claimId - The claim identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @param {Object} [options.memberInfo] - Member information for the EOB header
 * @param {string} [options.memberInfo.memberName] - Member name
 * @param {string} [options.memberInfo.memberId] - Member ID
 * @param {string} [options.memberInfo.groupNumber] - Group number
 * @param {string} [options.memberInfo.planName] - Plan name
 * @param {boolean} [options.download=true] - Whether to trigger a browser download
 * @param {string} [options.filename] - Custom filename for the download
 * @returns {Object} Result object with success status, pdf document, and blob
 */
export const getEOBPdf = (claimId, options = {}) => {
  if (!claimId) {
    return {
      success: false,
      error: 'claimId is required.',
      doc: null,
      blob: null,
    };
  }

  const claim = getClaimById(claimId);

  if (!claim) {
    return {
      success: false,
      error: 'Claim not found.',
      doc: null,
      blob: null,
    };
  }

  if (!claim.eobDocument) {
    return {
      success: false,
      error: 'No EOB document is available for this claim.',
      doc: null,
      blob: null,
    };
  }

  try {
    const memberInfo = options.memberInfo || {};
    const download = options.download !== undefined ? options.download : true;
    const filename = options.filename || `EOB_${claim.claimNumber || claim.claimId}.pdf`;

    const doc = generateEOBPDF(claim, memberInfo, {
      download,
      filename,
    });

    if (options.memberId) {
      logEOBDownload(options.memberId, claimId, {
        claimNumber: claim.claimNumber,
        claimType: claim.type,
        documentId: claim.eobDocument.documentId,
        title: claim.eobDocument.title,
        fileName: filename,
      });
    }

    let blob = null;
    try {
      blob = getPDFBlob(doc);
    } catch (blobError) {
      // Blob generation is optional; PDF may have already been downloaded
    }

    return {
      success: true,
      error: null,
      doc,
      blob,
    };
  } catch (error) {
    console.error('[claimsService] Error generating EOB PDF:', error);
    return {
      success: false,
      error: 'Unable to generate EOB document. Please try again later.',
      doc: null,
      blob: null,
    };
  }
};

/**
 * Returns a summary of claims for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} Claims summary object or null if memberId is not provided
 */
export const getClaimsSummaryForMember = (memberId) => {
  if (!memberId) {
    return null;
  }

  return getClaimsSummary(memberId);
};

/**
 * Returns all available claim type options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for claim types
 */
export const getClaimTypeOptions = () => {
  return Object.entries(CLAIM_TYPE).map(([key, value]) => ({
    value,
    label: CLAIM_TYPE_LABELS[value] || key,
  }));
};

/**
 * Returns all available claim status options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for claim statuses
 */
export const getClaimStatusOptions = () => {
  return Object.entries(CLAIM_STATUS).map(([key, value]) => ({
    value,
    label: CLAIM_STATUS_LABELS[value] || key,
  }));
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
 * Returns the most recent claims for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {number} [count=5] - Number of recent claims to return
 * @returns {Object[]} Array of enriched recent claim objects
 */
export const getRecentClaims = (memberId, count = 5) => {
  if (!memberId) {
    return [];
  }

  const memberClaims = getClaimsByMemberId(memberId);

  const sorted = [...memberClaims].sort((a, b) => {
    if (a.serviceDate < b.serviceDate) return 1;
    if (a.serviceDate > b.serviceDate) return -1;
    return 0;
  });

  const recent = sorted.slice(0, count);

  return recent.map((claim) => ({
    ...claim,
    statusLabel: CLAIM_STATUS_LABELS[claim.status] || claim.status,
    statusBadgeClass: CLAIM_STATUS_BADGE[claim.status] || 'hb-badge-neutral',
    typeLabel: CLAIM_TYPE_LABELS[claim.type] || claim.type,
    formattedBilledAmount: formatCurrency(claim.billedAmount),
    formattedPaidAmount: formatCurrency(claim.paidAmount),
    formattedMemberOwes: formatCurrency(claim.memberOwes),
    formattedServiceDate: formatDate(claim.serviceDate),
    hasEOB: claim.eobDocument !== null,
  }));
};

/**
 * Returns claims that require member attention (denied, pending info, partially approved).
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of enriched claims requiring attention
 */
export const getClaimsRequiringAttention = (memberId) => {
  if (!memberId) {
    return [];
  }

  const attentionStatuses = [
    CLAIM_STATUS.DENIED,
    CLAIM_STATUS.PENDING_INFO,
    CLAIM_STATUS.PARTIALLY_APPROVED,
  ];

  const memberClaims = getClaimsByMemberId(memberId);

  const attentionClaims = memberClaims.filter((claim) =>
    attentionStatuses.includes(claim.status)
  );

  const sorted = [...attentionClaims].sort((a, b) => {
    if (a.updatedAt < b.updatedAt) return 1;
    if (a.updatedAt > b.updatedAt) return -1;
    return 0;
  });

  return sorted.map((claim) => ({
    ...claim,
    statusLabel: CLAIM_STATUS_LABELS[claim.status] || claim.status,
    statusBadgeClass: CLAIM_STATUS_BADGE[claim.status] || 'hb-badge-neutral',
    typeLabel: CLAIM_TYPE_LABELS[claim.type] || claim.type,
    formattedBilledAmount: formatCurrency(claim.billedAmount),
    formattedMemberOwes: formatCurrency(claim.memberOwes),
    formattedServiceDate: formatDate(claim.serviceDate),
    hasEOB: claim.eobDocument !== null,
    canAppeal: claim.status === CLAIM_STATUS.DENIED || claim.status === CLAIM_STATUS.PARTIALLY_APPROVED,
  }));
};