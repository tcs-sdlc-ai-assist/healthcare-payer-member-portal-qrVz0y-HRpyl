/**
 * Glassbox analytics integration service for the Healthcare Member Portal.
 * Initializes Glassbox on authenticated routes, applies PHI/PII masking rules
 * from maskingUtils, and provides tagAction function for tracking key user actions
 * (claim opened, ID card downloaded/printed, external link clicks, document downloads).
 *
 * @module glassboxService
 */

import { APP_CONFIG } from '../constants/constants.js';
import {
  getMaskingRules,
  getGlassboxMaskingAttributes,
  isGlassboxMaskingEnabled,
  getClaimMaskingFieldMap,
  getMemberProfileMaskingFieldMap,
  getIDCardMaskingFieldMap,
  getPrescriptionMaskingFieldMap,
  applyMaskingToObject,
  applyMasking,
} from '../utils/maskingUtils.js';

/**
 * Glassbox action type constants for tracking user interactions.
 * @type {Object.<string, string>}
 */
export const GLASSBOX_ACTIONS = {
  CLAIM_OPENED: 'CLAIM_OPENED',
  CLAIM_EOB_DOWNLOADED: 'CLAIM_EOB_DOWNLOADED',
  IDCARD_DOWNLOADED: 'IDCARD_DOWNLOADED',
  IDCARD_PRINTED: 'IDCARD_PRINTED',
  IDCARD_REQUESTED: 'IDCARD_REQUESTED',
  DOCUMENT_DOWNLOADED: 'DOCUMENT_DOWNLOADED',
  DOCUMENT_VIEWED: 'DOCUMENT_VIEWED',
  EXTERNAL_LINK_CLICKED: 'EXTERNAL_LINK_CLICKED',
  BENEFITS_VIEWED: 'BENEFITS_VIEWED',
  NOTIFICATION_READ: 'NOTIFICATION_READ',
  NOTIFICATIONS_MARK_ALL_READ: 'NOTIFICATIONS_MARK_ALL_READ',
  SEARCH_PERFORMED: 'SEARCH_PERFORMED',
  PAGE_VIEWED: 'PAGE_VIEWED',
  SESSION_EXTENDED: 'SESSION_EXTENDED',
  LOGOUT: 'LOGOUT',
};

/**
 * Internal state for the Glassbox service.
 * @type {Object}
 */
let _state = {
  initialized: false,
  enabled: false,
  maskingRules: null,
  userId: null,
};

/**
 * Checks whether Glassbox analytics is enabled based on application configuration.
 *
 * @returns {boolean} True if Glassbox is enabled
 */
export const isGlassboxEnabled = () => {
  return APP_CONFIG.glassboxEnabled === true;
};

/**
 * Initializes the Glassbox analytics service.
 * Should be called once on authenticated routes after the user session is established.
 * Loads masking rules and configures Glassbox for PHI/PII protection.
 *
 * @param {Object} [options] - Initialization options
 * @param {string} [options.userId] - The authenticated user's member ID (will be masked)
 * @param {string} [options.userRole] - The authenticated user's role
 * @returns {Object} Initialization result with success status
 */
export const initialize = (options = {}) => {
  if (_state.initialized) {
    return {
      success: true,
      alreadyInitialized: true,
      enabled: _state.enabled,
    };
  }

  const enabled = isGlassboxEnabled();

  _state.enabled = enabled;
  _state.maskingRules = getMaskingRules();
  _state.userId = options.userId ? applyMasking('memberId', options.userId) : null;
  _state.initialized = true;

  if (enabled) {
    try {
      applyMaskingConfiguration();

      if (options.userId) {
        setUserContext({
          maskedUserId: _state.userId,
          userRole: options.userRole || null,
        });
      }
    } catch (error) {
      console.error('[glassboxService] Error during Glassbox initialization:', error);
      return {
        success: false,
        alreadyInitialized: false,
        enabled,
        error: 'Failed to initialize Glassbox analytics.',
      };
    }
  }

  return {
    success: true,
    alreadyInitialized: false,
    enabled,
  };
};

/**
 * Applies PHI/PII masking configuration for Glassbox session recording.
 * Configures masking rules so that sensitive data is not captured in plain text.
 */
const applyMaskingConfiguration = () => {
  if (!_state.enabled) {
    return;
  }

  const rules = _state.maskingRules || getMaskingRules();

  if (typeof window !== 'undefined' && window._clck) {
    try {
      const maskingConfig = Object.keys(rules).map((dataType) => ({
        type: dataType,
        strategy: rules[dataType].strategy,
        selector: `[data-glassbox-mask-type="${dataType}"]`,
      }));

      window._clck('setMaskingConfig', maskingConfig);
    } catch (error) {
      console.error('[glassboxService] Error applying masking configuration:', error);
    }
  }
};

/**
 * Sets the user context for Glassbox session recording.
 * Only masked/non-PHI data is sent to Glassbox.
 *
 * @param {Object} context - User context data
 * @param {string} [context.maskedUserId] - Masked user ID
 * @param {string} [context.userRole] - User role
 */
const setUserContext = (context) => {
  if (!_state.enabled) {
    return;
  }

  if (typeof window !== 'undefined' && window._clck) {
    try {
      window._clck('setUserContext', {
        userId: context.maskedUserId || 'anonymous',
        role: context.userRole || 'unknown',
      });
    } catch (error) {
      console.error('[glassboxService] Error setting user context:', error);
    }
  }
};

/**
 * Tags a user action for Glassbox analytics tracking.
 * Masks any PHI/PII in the action metadata before sending to Glassbox.
 * This is the primary function for tracking key user interactions.
 *
 * @param {string} action - The action type (use GLASSBOX_ACTIONS constants)
 * @param {Object} [metadata] - Additional metadata about the action
 * @returns {Object} Result with success status and the masked metadata that was sent
 */
export const tagAction = (action, metadata = {}) => {
  if (!action || typeof action !== 'string') {
    console.error('[glassboxService] Invalid action: action must be a non-empty string.');
    return {
      success: false,
      error: 'Invalid action.',
      maskedMetadata: null,
    };
  }

  const maskedMetadata = maskActionMetadata(action, metadata);

  if (!_state.enabled) {
    return {
      success: true,
      enabled: false,
      action,
      maskedMetadata,
    };
  }

  try {
    if (typeof window !== 'undefined' && window._clck) {
      window._clck('tagAction', action, maskedMetadata);
    }

    return {
      success: true,
      enabled: true,
      action,
      maskedMetadata,
    };
  } catch (error) {
    console.error('[glassboxService] Error tagging action:', error);
    return {
      success: false,
      error: 'Failed to tag action.',
      action,
      maskedMetadata,
    };
  }
};

/**
 * Masks PHI/PII fields in action metadata based on the action type.
 * Determines the appropriate field mapping based on the action and applies masking.
 *
 * @param {string} action - The action type
 * @param {Object} metadata - The raw metadata object
 * @returns {Object} Masked metadata object safe for Glassbox
 */
const maskActionMetadata = (action, metadata) => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const masked = { ...metadata };

  if (masked.memberId) {
    masked.memberId = applyMasking('memberId', masked.memberId);
  }

  if (masked.claimId) {
    masked.claimId = applyMasking('claimId', masked.claimId);
  }

  if (masked.claimNumber) {
    masked.claimNumber = applyMasking('claimNumber', masked.claimNumber);
  }

  if (masked.patientName) {
    masked.patientName = applyMasking('memberName', masked.patientName);
  }

  if (masked.memberName) {
    masked.memberName = applyMasking('memberName', masked.memberName);
  }

  if (masked.subscriberId) {
    masked.subscriberId = applyMasking('subscriberId', masked.subscriberId);
  }

  if (masked.groupNumber) {
    masked.groupNumber = applyMasking('groupNumber', masked.groupNumber);
  }

  if (masked.providerNPI) {
    masked.providerNPI = applyMasking('providerNPI', masked.providerNPI);
  }

  if (masked.documentId) {
    masked.documentId = applyMasking('documentId', masked.documentId);
  }

  if (masked.cardId) {
    masked.cardId = applyMasking('cardId', masked.cardId);
  }

  if (masked.rxNumber) {
    masked.rxNumber = applyMasking('rxNumber', masked.rxNumber);
  }

  if (masked.diagnosisCode) {
    masked.diagnosisCode = applyMasking('diagnosisCode', masked.diagnosisCode);
  }

  if (masked.billedAmount !== undefined && masked.billedAmount !== null) {
    masked.billedAmount = applyMasking('financialAmount', masked.billedAmount);
  }

  if (masked.paidAmount !== undefined && masked.paidAmount !== null) {
    masked.paidAmount = applyMasking('financialAmount', masked.paidAmount);
  }

  if (masked.memberOwes !== undefined && masked.memberOwes !== null) {
    masked.memberOwes = applyMasking('financialAmount', masked.memberOwes);
  }

  if (masked.email) {
    masked.email = applyMasking('email', masked.email);
  }

  if (masked.phone) {
    masked.phone = applyMasking('phone', masked.phone);
  }

  if (masked.dateOfBirth) {
    masked.dateOfBirth = applyMasking('dateOfBirth', masked.dateOfBirth);
  }

  if (masked.address && typeof masked.address === 'string') {
    masked.address = applyMasking('address', masked.address);
  }

  return masked;
};

/**
 * Tags a claim opened action for Glassbox tracking.
 *
 * @param {Object} claimData - Claim data to track
 * @param {string} [claimData.claimId] - The claim identifier
 * @param {string} [claimData.claimNumber] - The claim number
 * @param {string} [claimData.claimType] - The claim type
 * @param {string} [claimData.status] - The claim status
 * @returns {Object} Result from tagAction
 */
export const tagClaimOpened = (claimData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.CLAIM_OPENED, {
    claimId: claimData.claimId,
    claimNumber: claimData.claimNumber,
    claimType: claimData.claimType || null,
    status: claimData.status || null,
  });
};

/**
 * Tags a claim EOB download action for Glassbox tracking.
 *
 * @param {Object} eobData - EOB download data to track
 * @param {string} [eobData.claimId] - The claim identifier
 * @param {string} [eobData.claimNumber] - The claim number
 * @param {string} [eobData.documentId] - The EOB document identifier
 * @returns {Object} Result from tagAction
 */
export const tagEOBDownloaded = (eobData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.CLAIM_EOB_DOWNLOADED, {
    claimId: eobData.claimId,
    claimNumber: eobData.claimNumber,
    documentId: eobData.documentId || null,
  });
};

/**
 * Tags an ID card download action for Glassbox tracking.
 *
 * @param {Object} cardData - ID card data to track
 * @param {string} [cardData.cardId] - The card identifier
 * @param {string} [cardData.coverageType] - The coverage type
 * @param {string} [cardData.planName] - The plan name
 * @returns {Object} Result from tagAction
 */
export const tagIDCardDownloaded = (cardData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.IDCARD_DOWNLOADED, {
    cardId: cardData.cardId,
    coverageType: cardData.coverageType || null,
    planName: cardData.planName || null,
  });
};

/**
 * Tags an ID card print action for Glassbox tracking.
 *
 * @param {Object} cardData - ID card data to track
 * @param {string} [cardData.cardId] - The card identifier
 * @param {string} [cardData.coverageType] - The coverage type
 * @param {string} [cardData.planName] - The plan name
 * @returns {Object} Result from tagAction
 */
export const tagIDCardPrinted = (cardData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.IDCARD_PRINTED, {
    cardId: cardData.cardId,
    coverageType: cardData.coverageType || null,
    planName: cardData.planName || null,
  });
};

/**
 * Tags an ID card request action for Glassbox tracking.
 *
 * @param {Object} requestData - ID card request data to track
 * @param {string} [requestData.coverageType] - The coverage type
 * @param {string} [requestData.reason] - The reason for the request
 * @returns {Object} Result from tagAction
 */
export const tagIDCardRequested = (requestData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.IDCARD_REQUESTED, {
    coverageType: requestData.coverageType || null,
    reason: requestData.reason || null,
  });
};

/**
 * Tags a document download action for Glassbox tracking.
 *
 * @param {Object} docData - Document data to track
 * @param {string} [docData.documentId] - The document identifier
 * @param {string} [docData.category] - The document category
 * @param {string} [docData.title] - The document title
 * @returns {Object} Result from tagAction
 */
export const tagDocumentDownloaded = (docData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.DOCUMENT_DOWNLOADED, {
    documentId: docData.documentId,
    category: docData.category || null,
    title: docData.title || null,
  });
};

/**
 * Tags a document view action for Glassbox tracking.
 *
 * @param {Object} docData - Document data to track
 * @param {string} [docData.documentId] - The document identifier
 * @param {string} [docData.category] - The document category
 * @param {string} [docData.title] - The document title
 * @returns {Object} Result from tagAction
 */
export const tagDocumentViewed = (docData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.DOCUMENT_VIEWED, {
    documentId: docData.documentId,
    category: docData.category || null,
    title: docData.title || null,
  });
};

/**
 * Tags an external link click action for Glassbox tracking.
 *
 * @param {Object} linkData - External link data to track
 * @param {string} [linkData.url] - The external URL
 * @param {string} [linkData.title] - The link title
 * @param {string} [linkData.category] - The link category
 * @returns {Object} Result from tagAction
 */
export const tagExternalLinkClicked = (linkData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.EXTERNAL_LINK_CLICKED, {
    url: linkData.url || null,
    title: linkData.title || null,
    category: linkData.category || null,
  });
};

/**
 * Tags a benefits viewed action for Glassbox tracking.
 *
 * @param {Object} benefitsData - Benefits data to track
 * @param {string} [benefitsData.coverageType] - The coverage type viewed
 * @param {string} [benefitsData.planName] - The plan name
 * @returns {Object} Result from tagAction
 */
export const tagBenefitsViewed = (benefitsData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.BENEFITS_VIEWED, {
    coverageType: benefitsData.coverageType || null,
    planName: benefitsData.planName || null,
  });
};

/**
 * Tags a page view action for Glassbox tracking.
 *
 * @param {Object} pageData - Page data to track
 * @param {string} [pageData.pageName] - The page name
 * @param {string} [pageData.route] - The route path
 * @returns {Object} Result from tagAction
 */
export const tagPageViewed = (pageData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.PAGE_VIEWED, {
    pageName: pageData.pageName || null,
    route: pageData.route || null,
  });
};

/**
 * Tags a search performed action for Glassbox tracking.
 *
 * @param {Object} searchData - Search data to track
 * @param {string} [searchData.query] - The search query (not PHI/PII)
 * @param {number} [searchData.resultCount] - Number of results found
 * @param {string} [searchData.category] - The search category filter
 * @returns {Object} Result from tagAction
 */
export const tagSearchPerformed = (searchData = {}) => {
  return tagAction(GLASSBOX_ACTIONS.SEARCH_PERFORMED, {
    query: searchData.query || null,
    resultCount: searchData.resultCount || 0,
    category: searchData.category || null,
  });
};

/**
 * Returns the Glassbox data-masking DOM attributes for a given data type.
 * These attributes instruct Glassbox to mask the element's content during
 * session recording.
 *
 * @param {string} dataType - The data type key (e.g., 'memberId', 'memberName')
 * @returns {Object} An object containing the data attributes for Glassbox masking
 */
export const getMaskingAttributes = (dataType) => {
  return getGlassboxMaskingAttributes(dataType);
};

/**
 * Returns the current masking rules for reference.
 *
 * @returns {Object} The masking rules object
 */
export const getCurrentMaskingRules = () => {
  return _state.maskingRules || getMaskingRules();
};

/**
 * Returns whether the Glassbox service has been initialized.
 *
 * @returns {boolean} True if initialized
 */
export const isInitialized = () => {
  return _state.initialized;
};

/**
 * Returns the current state of the Glassbox service.
 *
 * @returns {Object} Current service state (initialized, enabled, masked userId)
 */
export const getServiceState = () => {
  return {
    initialized: _state.initialized,
    enabled: _state.enabled,
    userId: _state.userId,
    hasMaskingRules: _state.maskingRules !== null,
  };
};

/**
 * Resets the Glassbox service state.
 * Should be called on logout to clear user context.
 *
 * @returns {Object} Result with success status
 */
export const reset = () => {
  _state = {
    initialized: false,
    enabled: false,
    maskingRules: null,
    userId: null,
  };

  if (typeof window !== 'undefined' && window._clck) {
    try {
      window._clck('clearUserContext');
    } catch (error) {
      console.error('[glassboxService] Error clearing Glassbox user context:', error);
    }
  }

  return {
    success: true,
  };
};

/**
 * Masks a claim object for safe Glassbox capture.
 * Convenience wrapper around applyMaskingToObject with claim field mapping.
 *
 * @param {Object} claim - The claim data object
 * @returns {Object} Masked claim object
 */
export const maskClaimForCapture = (claim) => {
  if (!claim || typeof claim !== 'object') {
    return {};
  }

  return applyMaskingToObject(claim, getClaimMaskingFieldMap());
};

/**
 * Masks a member profile object for safe Glassbox capture.
 * Convenience wrapper around applyMaskingToObject with member profile field mapping.
 *
 * @param {Object} profile - The member profile data object
 * @returns {Object} Masked profile object
 */
export const maskProfileForCapture = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return {};
  }

  return applyMaskingToObject(profile, getMemberProfileMaskingFieldMap());
};

/**
 * Masks an ID card object for safe Glassbox capture.
 * Convenience wrapper around applyMaskingToObject with ID card field mapping.
 *
 * @param {Object} cardFront - The ID card front data object
 * @returns {Object} Masked ID card front object
 */
export const maskIDCardForCapture = (cardFront) => {
  if (!cardFront || typeof cardFront !== 'object') {
    return {};
  }

  return applyMaskingToObject(cardFront, getIDCardMaskingFieldMap());
};

/**
 * Masks a prescription object for safe Glassbox capture.
 * Convenience wrapper around applyMaskingToObject with prescription field mapping.
 *
 * @param {Object} prescription - The prescription data object
 * @returns {Object} Masked prescription object
 */
export const maskPrescriptionForCapture = (prescription) => {
  if (!prescription || typeof prescription !== 'object') {
    return {};
  }

  return applyMaskingToObject(prescription, getPrescriptionMaskingFieldMap());
};