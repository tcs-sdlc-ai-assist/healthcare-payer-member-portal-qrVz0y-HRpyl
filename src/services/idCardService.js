/**
 * ID Card business logic service for the Healthcare Member Portal.
 * Provides getIDCards (with filtering), getIDCardPdf (with audit logging),
 * and requestNewCard (stub with confirmation record) functions.
 * Consumes idCardsData fixture and integrates with auditLogger for downloads/prints/requests.
 *
 * @module idCardService
 */

import {
  getIDCardsByMemberId,
  getActiveIDCardsByMemberId,
  getIDCardById,
  getIDCardsByCoverageType,
  getIDCardsByCoverageId,
  filterIDCards,
  getIDCardsSummary,
} from '../data/idCardsData.js';
import {
  logIDCardDownload,
  logIDCardPrint,
  logIDCardRequest,
  AUDIT_ACTIONS,
  logEvent,
} from '../services/auditLogger.js';
import { generateIDCardPDF, generateAllIDCardsPDF, getPDFBlob } from '../utils/pdfGenerator.js';
import { COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../constants/constants.js';
import { formatDate } from '../utils/formatters.js';

/**
 * Retrieves a filtered and sorted list of ID cards for a member.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - The member identifier (required)
 * @param {string} [params.coverageType] - Coverage type filter (MEDICAL, DENTAL, VISION, etc.)
 * @param {string} [params.status] - Card status filter ('active', 'expired', 'requested')
 * @param {string} [params.cardType] - Card type filter ('primary', 'dependent')
 * @param {string} [params.sortBy] - Sort field ('issueDate', 'expirationDate', 'coverageType')
 * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
 * @param {boolean} [params.activeOnly=false] - Whether to return only active cards
 * @returns {Object} Object with cards array, summary, and error
 */
export const getIDCards = (params = {}) => {
  if (!params.memberId) {
    return {
      cards: [],
      summary: null,
      error: 'memberId is required.',
    };
  }

  if (params.activeOnly) {
    let activeCards = getActiveIDCardsByMemberId(params.memberId);

    if (params.coverageType) {
      activeCards = activeCards.filter((card) => card.coverageType === params.coverageType);
    }

    const enrichedCards = activeCards.map((card) => enrichCard(card));

    const summary = getIDCardsSummary(params.memberId);

    return {
      cards: enrichedCards,
      summary,
      error: null,
    };
  }

  const filters = {
    memberId: params.memberId,
  };

  if (params.coverageType) {
    filters.coverageType = params.coverageType;
  }

  if (params.status) {
    filters.status = params.status;
  }

  if (params.cardType) {
    filters.cardType = params.cardType;
  }

  if (params.sortBy) {
    filters.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    filters.sortOrder = params.sortOrder;
  }

  const filteredCards = filterIDCards(filters);

  const enrichedCards = filteredCards.map((card) => enrichCard(card));

  const summary = getIDCardsSummary(params.memberId);

  return {
    cards: enrichedCards,
    summary,
    error: null,
  };
};

/**
 * Retrieves a single ID card by its card ID.
 *
 * @param {string} cardId - The card identifier
 * @returns {Object|null} Enriched ID card object or null if not found
 */
export const getIDCardDetails = (cardId) => {
  if (!cardId) {
    return null;
  }

  const card = getIDCardById(cardId);

  if (!card) {
    return null;
  }

  return enrichCard(card);
};

/**
 * Retrieves ID cards filtered by coverage type for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {string} coverageType - The coverage type to filter by
 * @returns {Object[]} Array of enriched ID card objects
 */
export const getIDCardsByCoverage = (memberId, coverageType) => {
  if (!memberId || !coverageType) {
    return [];
  }

  const cards = getIDCardsByCoverageType(memberId, coverageType);

  return cards.map((card) => enrichCard(card));
};

/**
 * Generates and returns a PDF for a single ID card.
 * Logs an ID card download audit event.
 *
 * @param {string} cardId - The card identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @param {boolean} [options.download=true] - Whether to trigger a browser download
 * @param {string} [options.filename] - Custom filename for the download
 * @returns {Object} Result object with success status, pdf document, and blob
 */
export const getIDCardPdf = (cardId, options = {}) => {
  if (!cardId) {
    return {
      success: false,
      error: 'cardId is required.',
      doc: null,
      blob: null,
    };
  }

  const card = getIDCardById(cardId);

  if (!card) {
    return {
      success: false,
      error: 'ID card not found.',
      doc: null,
      blob: null,
    };
  }

  try {
    const download = options.download !== undefined ? options.download : true;
    const filename = options.filename || `ID_Card_${card.front.planType || 'Card'}_${card.front.memberId || 'member'}.pdf`;

    const doc = generateIDCardPDF(card, {
      download,
      filename,
    });

    if (options.memberId) {
      logIDCardDownload(options.memberId, cardId, {
        coverageType: card.coverageType,
        planName: card.front.planName,
        cardType: card.cardType,
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
    console.error('[idCardService] Error generating ID card PDF:', error);
    return {
      success: false,
      error: 'Unable to generate ID card PDF. Please try again later.',
      doc: null,
      blob: null,
    };
  }
};

/**
 * Generates and returns a PDF containing all active ID cards for a member.
 * Logs an ID card download audit event for each card.
 *
 * @param {string} memberId - The member identifier
 * @param {Object} [options] - Options
 * @param {boolean} [options.download=true] - Whether to trigger a browser download
 * @param {string} [options.filename] - Custom filename for the download
 * @returns {Object} Result object with success status, pdf document, and blob
 */
export const getAllIDCardsPdf = (memberId, options = {}) => {
  if (!memberId) {
    return {
      success: false,
      error: 'memberId is required.',
      doc: null,
      blob: null,
    };
  }

  const activeCards = getActiveIDCardsByMemberId(memberId);

  if (!activeCards || activeCards.length === 0) {
    return {
      success: false,
      error: 'No active ID cards found.',
      doc: null,
      blob: null,
    };
  }

  try {
    const download = options.download !== undefined ? options.download : true;
    const filename = options.filename || 'All_ID_Cards.pdf';

    const doc = generateAllIDCardsPDF(activeCards, {
      download,
      filename,
    });

    activeCards.forEach((card) => {
      logIDCardDownload(memberId, card.cardId, {
        coverageType: card.coverageType,
        planName: card.front.planName,
        cardType: card.cardType,
        fileName: filename,
        bulkDownload: true,
      });
    });

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
      cardCount: activeCards.length,
    };
  } catch (error) {
    console.error('[idCardService] Error generating all ID cards PDF:', error);
    return {
      success: false,
      error: 'Unable to generate ID cards PDF. Please try again later.',
      doc: null,
      blob: null,
    };
  }
};

/**
 * Logs a print event for an ID card.
 *
 * @param {string} cardId - The card identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @returns {Object} Result object with success status
 */
export const printIDCard = (cardId, options = {}) => {
  if (!cardId) {
    return {
      success: false,
      error: 'cardId is required.',
    };
  }

  const card = getIDCardById(cardId);

  if (!card) {
    return {
      success: false,
      error: 'ID card not found.',
    };
  }

  if (options.memberId) {
    logIDCardPrint(options.memberId, cardId, {
      coverageType: card.coverageType,
      planName: card.front.planName,
      cardType: card.cardType,
    });
  }

  return {
    success: true,
    error: null,
  };
};

/**
 * Submits a request for a new ID card (stub implementation for MVP).
 * Returns a mock confirmation response and logs the request.
 *
 * @param {Object} requestData - The card request data
 * @param {string} requestData.memberId - The member identifier (required)
 * @param {string} requestData.coverageId - The coverage identifier for the requested card (required)
 * @param {string} [requestData.reason] - Reason for the request (lost, damaged, name_change, other)
 * @param {string} [requestData.notes] - Additional notes
 * @returns {Object} Request result with confirmation details
 */
export const requestNewCard = (requestData = {}) => {
  if (!requestData.memberId) {
    return {
      success: false,
      error: 'memberId is required.',
      requestId: null,
      status: null,
      message: null,
    };
  }

  if (!requestData.coverageId) {
    return {
      success: false,
      error: 'coverageId is required.',
      requestId: null,
      status: null,
      message: null,
    };
  }

  const existingCards = getIDCardsByCoverageId(requestData.coverageId);

  if (!existingCards || existingCards.length === 0) {
    return {
      success: false,
      error: 'No ID card found for the specified coverage.',
      requestId: null,
      status: null,
      message: null,
    };
  }

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const stubRequestId = `REQ-${timestamp}-${random}`;

  const matchingCard = existingCards.find((card) => card.status === 'active') || existingCards[0];

  logIDCardRequest(requestData.memberId, requestData.coverageId, {
    requestId: stubRequestId,
    coverageType: matchingCard.coverageType,
    planName: matchingCard.front.planName,
    reason: requestData.reason || 'not_specified',
    notes: requestData.notes || '',
  });

  return {
    success: true,
    error: null,
    requestId: stubRequestId,
    status: 'submitted',
    message: 'Your request for a new ID card has been received. You can expect to receive your new card within 7-10 business days.',
    submittedAt: new Date().toISOString(),
    coverageType: matchingCard.coverageType,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[matchingCard.coverageType] || matchingCard.coverageType,
    planName: matchingCard.front.planName,
  };
};

/**
 * Returns a summary of ID cards for a given member.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} ID cards summary object or null if memberId is not provided
 */
export const getIDCardsSummaryForMember = (memberId) => {
  if (!memberId) {
    return null;
  }

  return getIDCardsSummary(memberId);
};

/**
 * Returns all available coverage type options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for coverage types
 */
export const getCoverageTypeOptions = () => {
  return Object.entries(COVERAGE_TYPE).map(([key, value]) => ({
    value,
    label: COVERAGE_TYPE_LABELS[value] || key,
  }));
};

/**
 * Returns all available card status options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for card statuses
 */
export const getCardStatusOptions = () => {
  return [
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'requested', label: 'Requested' },
  ];
};

/**
 * Enriches an ID card object with computed display properties.
 *
 * @param {Object} card - The raw ID card data object
 * @returns {Object} Enriched ID card object with additional display properties
 */
const enrichCard = (card) => {
  if (!card) {
    return null;
  }

  return {
    ...card,
    coverageTypeLabel: COVERAGE_TYPE_LABELS[card.coverageType] || card.coverageType,
    formattedIssueDate: formatDate(card.issueDate),
    formattedExpirationDate: formatDate(card.expirationDate),
    isActive: card.status === 'active',
    isExpired: card.status === 'expired',
    statusLabel: card.status ? card.status.charAt(0).toUpperCase() + card.status.slice(1) : 'Unknown',
  };
};
