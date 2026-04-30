/**
 * Audit logging service for the Healthcare Member Portal.
 * Logs document downloads, ID card downloads/prints, external link clicks,
 * and claim EOB downloads with user ID, action type, timestamp, and metadata.
 * Stores logs in localStorage for MVP; designed for backend API migration.
 *
 * @module auditLogger
 */

import { getItem, setItem } from '../utils/storage.js';
import { applyMasking } from '../utils/maskingUtils.js';

/**
 * Storage key for audit log entries.
 * @type {string}
 */
const AUDIT_LOG_STORAGE_KEY = 'hcp_audit_log';

/**
 * Maximum number of audit log entries to retain in localStorage.
 * Older entries are pruned when this limit is exceeded.
 * @type {number}
 */
const MAX_LOG_ENTRIES = 500;

/**
 * Audit action type constants.
 * @type {Object.<string, string>}
 */
export const AUDIT_ACTIONS = {
  DOCUMENT_DOWNLOAD: 'DOCUMENT_DOWNLOAD',
  IDCARD_DOWNLOAD: 'IDCARD_DOWNLOAD',
  IDCARD_PRINT: 'IDCARD_PRINT',
  EOB_DOWNLOAD: 'EOB_DOWNLOAD',
  EXTERNAL_LINK_CLICK: 'EXTERNAL_LINK_CLICK',
  CLAIM_VIEW: 'CLAIM_VIEW',
  IDCARD_REQUEST: 'IDCARD_REQUEST',
  NOTIFICATION_READ: 'NOTIFICATION_READ',
  NOTIFICATIONS_MARK_ALL_READ: 'NOTIFICATIONS_MARK_ALL_READ',
  BENEFITS_VIEW: 'BENEFITS_VIEW',
  DOCUMENT_VIEW: 'DOCUMENT_VIEW',
};

/**
 * Retrieves all audit log entries from storage.
 * @returns {Object[]} Array of audit log entry objects
 */
export const getAuditLog = () => {
  return getItem(AUDIT_LOG_STORAGE_KEY, []);
};

/**
 * Retrieves audit log entries filtered by member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of audit log entries for the member
 */
export const getAuditLogByMemberId = (memberId) => {
  const logs = getAuditLog();
  if (!memberId) {
    return logs;
  }
  return logs.filter((entry) => entry.memberId === memberId);
};

/**
 * Retrieves audit log entries filtered by action type.
 * @param {string} action - The audit action type
 * @returns {Object[]} Array of audit log entries matching the action
 */
export const getAuditLogByAction = (action) => {
  const logs = getAuditLog();
  if (!action) {
    return logs;
  }
  return logs.filter((entry) => entry.action === action);
};

/**
 * Retrieves audit log entries filtered by target ID.
 * @param {string} targetId - The target entity identifier
 * @returns {Object[]} Array of audit log entries matching the target ID
 */
export const getAuditLogByTargetId = (targetId) => {
  const logs = getAuditLog();
  if (!targetId) {
    return logs;
  }
  return logs.filter((entry) => entry.targetId === targetId);
};

/**
 * Prunes the audit log to keep only the most recent entries up to MAX_LOG_ENTRIES.
 * @param {Object[]} logs - The current audit log entries
 * @returns {Object[]} Pruned array of audit log entries
 */
const pruneLog = (logs) => {
  if (!Array.isArray(logs)) {
    return [];
  }
  if (logs.length <= MAX_LOG_ENTRIES) {
    return logs;
  }
  return logs.slice(logs.length - MAX_LOG_ENTRIES);
};

/**
 * Masks sensitive metadata fields before storing in the audit log.
 * Ensures PHI/PII is not persisted in plain text.
 * @param {Object|null|undefined} metadata - The metadata object to mask
 * @returns {Object} Masked metadata object
 */
const maskMetadata = (metadata) => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const masked = { ...metadata };

  if (masked.memberId) {
    masked.memberId = applyMasking('memberId', masked.memberId);
  }

  if (masked.claimNumber) {
    masked.claimNumber = applyMasking('claimNumber', masked.claimNumber);
  }

  if (masked.claimId) {
    masked.claimId = applyMasking('claimId', masked.claimId);
  }

  if (masked.subscriberId) {
    masked.subscriberId = applyMasking('subscriberId', masked.subscriberId);
  }

  if (masked.groupNumber) {
    masked.groupNumber = applyMasking('groupNumber', masked.groupNumber);
  }

  if (masked.documentId) {
    masked.documentId = applyMasking('documentId', masked.documentId);
  }

  if (masked.cardId) {
    masked.cardId = applyMasking('cardId', masked.cardId);
  }

  if (masked.patientName) {
    masked.patientName = applyMasking('memberName', masked.patientName);
  }

  if (masked.providerNPI) {
    masked.providerNPI = applyMasking('providerNPI', masked.providerNPI);
  }

  if (masked.rxNumber) {
    masked.rxNumber = applyMasking('rxNumber', masked.rxNumber);
  }

  return masked;
};

/**
 * Generates a unique log entry ID.
 * @returns {string} A unique log entry identifier
 */
const generateLogId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `LOG-${timestamp}-${random}`;
};

/**
 * Logs an audit event to storage.
 * This is the primary function for recording audit trail entries.
 * For MVP, events are stored in localStorage. Designed for easy migration
 * to a backend API endpoint (POST /api/audit-log).
 *
 * @param {Object} event - The audit event to log
 * @param {string} event.memberId - The member identifier performing the action
 * @param {string} event.action - The action type (use AUDIT_ACTIONS constants)
 * @param {string} [event.targetId] - The target entity identifier (document ID, card ID, claim ID, etc.)
 * @param {Object} [event.metadata] - Additional metadata about the event
 * @returns {Object} The created audit log entry
 */
export const logEvent = (event) => {
  if (!event || typeof event !== 'object') {
    console.error('[auditLogger] Invalid event: event must be an object.');
    return null;
  }

  if (!event.memberId) {
    console.error('[auditLogger] Invalid event: memberId is required.');
    return null;
  }

  if (!event.action) {
    console.error('[auditLogger] Invalid event: action is required.');
    return null;
  }

  const maskedMetadata = maskMetadata(event.metadata || {});

  const logEntry = {
    logId: generateLogId(),
    memberId: event.memberId,
    action: event.action,
    targetId: event.targetId || null,
    timestamp: new Date().toISOString(),
    metadata: maskedMetadata,
  };

  try {
    const logs = getAuditLog();
    logs.push(logEntry);
    const prunedLogs = pruneLog(logs);
    setItem(AUDIT_LOG_STORAGE_KEY, prunedLogs);
  } catch (error) {
    console.error('[auditLogger] Error writing audit log entry:', error);
  }

  return logEntry;
};

/**
 * Logs a document download event.
 * @param {string} memberId - The member identifier
 * @param {string} documentId - The document identifier
 * @param {Object} [metadata] - Additional metadata (title, category, fileName, etc.)
 * @returns {Object} The created audit log entry
 */
export const logDocumentDownload = (memberId, documentId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.DOCUMENT_DOWNLOAD,
    targetId: documentId,
    metadata: {
      ...metadata,
      documentId,
    },
  });
};

/**
 * Logs an ID card download event.
 * @param {string} memberId - The member identifier
 * @param {string} cardId - The ID card identifier
 * @param {Object} [metadata] - Additional metadata (coverageType, planName, etc.)
 * @returns {Object} The created audit log entry
 */
export const logIDCardDownload = (memberId, cardId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.IDCARD_DOWNLOAD,
    targetId: cardId,
    metadata: {
      ...metadata,
      cardId,
    },
  });
};

/**
 * Logs an ID card print event.
 * @param {string} memberId - The member identifier
 * @param {string} cardId - The ID card identifier
 * @param {Object} [metadata] - Additional metadata (coverageType, planName, etc.)
 * @returns {Object} The created audit log entry
 */
export const logIDCardPrint = (memberId, cardId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.IDCARD_PRINT,
    targetId: cardId,
    metadata: {
      ...metadata,
      cardId,
    },
  });
};

/**
 * Logs a claim EOB download event.
 * @param {string} memberId - The member identifier
 * @param {string} claimId - The claim identifier
 * @param {Object} [metadata] - Additional metadata (claimNumber, claimType, etc.)
 * @returns {Object} The created audit log entry
 */
export const logEOBDownload = (memberId, claimId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.EOB_DOWNLOAD,
    targetId: claimId,
    metadata: {
      ...metadata,
      claimId,
    },
  });
};

/**
 * Logs an external link click event.
 * @param {string} memberId - The member identifier
 * @param {string} url - The external URL that was clicked
 * @param {Object} [metadata] - Additional metadata (linkTitle, linkCategory, etc.)
 * @returns {Object} The created audit log entry
 */
export const logExternalLinkClick = (memberId, url, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.EXTERNAL_LINK_CLICK,
    targetId: url,
    metadata: {
      ...metadata,
      url,
    },
  });
};

/**
 * Logs an ID card request event.
 * @param {string} memberId - The member identifier
 * @param {string} coverageId - The coverage identifier for the requested card
 * @param {Object} [metadata] - Additional metadata (coverageType, reason, etc.)
 * @returns {Object} The created audit log entry
 */
export const logIDCardRequest = (memberId, coverageId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.IDCARD_REQUEST,
    targetId: coverageId,
    metadata: {
      ...metadata,
      coverageId,
    },
  });
};

/**
 * Logs a claim view event.
 * @param {string} memberId - The member identifier
 * @param {string} claimId - The claim identifier
 * @param {Object} [metadata] - Additional metadata (claimNumber, claimType, etc.)
 * @returns {Object} The created audit log entry
 */
export const logClaimView = (memberId, claimId, metadata = {}) => {
  return logEvent({
    memberId,
    action: AUDIT_ACTIONS.CLAIM_VIEW,
    targetId: claimId,
    metadata: {
      ...metadata,
      claimId,
    },
  });
};

/**
 * Clears all audit log entries from storage.
 * Intended for development/testing use only.
 * @returns {boolean} True if the log was cleared successfully
 */
export const clearAuditLog = () => {
  try {
    setItem(AUDIT_LOG_STORAGE_KEY, []);
    return true;
  } catch (error) {
    console.error('[auditLogger] Error clearing audit log:', error);
    return false;
  }
};

/**
 * Returns a summary of audit log activity for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with total events, action counts, and most recent event
 */
export const getAuditLogSummary = (memberId) => {
  const memberLogs = getAuditLogByMemberId(memberId);

  const actionCounts = {};
  Object.values(AUDIT_ACTIONS).forEach((action) => {
    actionCounts[action] = 0;
  });

  memberLogs.forEach((entry) => {
    if (actionCounts[entry.action] !== undefined) {
      actionCounts[entry.action] += 1;
    }
  });

  const sortedLogs = [...memberLogs].sort((a, b) => {
    if (a.timestamp < b.timestamp) return 1;
    if (a.timestamp > b.timestamp) return -1;
    return 0;
  });

  return {
    totalEvents: memberLogs.length,
    actionCounts,
    mostRecentEvent: sortedLogs.length > 0 ? sortedLogs[0] : null,
  };
};