import React, { createContext, useContext, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext.jsx';
import {
  initialize,
  reset,
  isGlassboxEnabled,
  isInitialized,
  getServiceState,
  tagAction as glassboxTagAction,
  tagClaimOpened,
  tagEOBDownloaded,
  tagIDCardDownloaded,
  tagIDCardPrinted,
  tagIDCardRequested,
  tagDocumentDownloaded,
  tagDocumentViewed,
  tagExternalLinkClicked,
  tagBenefitsViewed,
  tagPageViewed,
  tagSearchPerformed,
  getMaskingAttributes,
  getCurrentMaskingRules,
  maskClaimForCapture,
  maskProfileForCapture,
  maskIDCardForCapture,
  maskPrescriptionForCapture,
  GLASSBOX_ACTIONS,
} from '../services/glassboxService.js';

/**
 * @typedef {Object} GlassboxContextValue
 * @property {boolean} enabled - Whether Glassbox analytics is enabled
 * @property {boolean} initialized - Whether the Glassbox service has been initialized
 * @property {Function} tagAction - Tags a user action for Glassbox analytics tracking
 * @property {Function} tagClaimOpened - Tags a claim opened action
 * @property {Function} tagEOBDownloaded - Tags a claim EOB download action
 * @property {Function} tagIDCardDownloaded - Tags an ID card download action
 * @property {Function} tagIDCardPrinted - Tags an ID card print action
 * @property {Function} tagIDCardRequested - Tags an ID card request action
 * @property {Function} tagDocumentDownloaded - Tags a document download action
 * @property {Function} tagDocumentViewed - Tags a document view action
 * @property {Function} tagExternalLinkClicked - Tags an external link click action
 * @property {Function} tagBenefitsViewed - Tags a benefits viewed action
 * @property {Function} tagPageViewed - Tags a page view action
 * @property {Function} tagSearchPerformed - Tags a search performed action
 * @property {Function} getMaskingAttributes - Returns Glassbox masking DOM attributes for a data type
 * @property {Function} getMaskingRules - Returns the current masking rules
 * @property {Function} maskClaimForCapture - Masks a claim object for safe Glassbox capture
 * @property {Function} maskProfileForCapture - Masks a member profile for safe Glassbox capture
 * @property {Function} maskIDCardForCapture - Masks an ID card for safe Glassbox capture
 * @property {Function} maskPrescriptionForCapture - Masks a prescription for safe Glassbox capture
 * @property {Object} ACTIONS - Glassbox action type constants
 */

const GlassboxContext = createContext(null);

/**
 * Custom hook to consume the GlassboxContext.
 * Must be used within a GlassboxProvider.
 *
 * @returns {GlassboxContextValue} The Glassbox context value
 * @throws {Error} If used outside of a GlassboxProvider
 */
export const useGlassbox = () => {
  const context = useContext(GlassboxContext);
  if (!context) {
    throw new Error('useGlassbox must be used within a GlassboxProvider.');
  }
  return context;
};

/**
 * Glassbox analytics context provider component.
 * Initializes Glassbox on mount for authenticated users, applies masking rules,
 * and provides tagAction function and convenience tracking methods to child components.
 * Wraps authenticated routes only.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactElement} The provider component
 */
const GlassboxProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const initializedRef = useRef(false);

  /**
   * Initialize Glassbox when user authenticates.
   * Reset when user logs out.
   */
  useEffect(() => {
    if (isAuthenticated && user && user.memberId) {
      if (!initializedRef.current) {
        const result = initialize({
          userId: user.memberId,
          userRole: user.role,
        });

        if (result.success) {
          initializedRef.current = true;
        }
      }
    } else {
      if (initializedRef.current) {
        reset();
        initializedRef.current = false;
      }
    }
  }, [isAuthenticated, user]);

  /**
   * Cleanup on unmount.
   */
  useEffect(() => {
    return () => {
      if (initializedRef.current) {
        reset();
        initializedRef.current = false;
      }
    };
  }, []);

  /**
   * Tags a user action for Glassbox analytics tracking.
   *
   * @param {string} action - The action type (use GLASSBOX_ACTIONS constants)
   * @param {Object} [metadata] - Additional metadata about the action
   * @returns {Object} Result with success status and the masked metadata that was sent
   */
  const tagActionHandler = useCallback((action, metadata = {}) => {
    return glassboxTagAction(action, metadata);
  }, []);

  /**
   * Tags a claim opened action.
   *
   * @param {Object} claimData - Claim data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagClaimOpened = useCallback((claimData = {}) => {
    return tagClaimOpened(claimData);
  }, []);

  /**
   * Tags a claim EOB download action.
   *
   * @param {Object} eobData - EOB download data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagEOBDownloaded = useCallback((eobData = {}) => {
    return tagEOBDownloaded(eobData);
  }, []);

  /**
   * Tags an ID card download action.
   *
   * @param {Object} cardData - ID card data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagIDCardDownloaded = useCallback((cardData = {}) => {
    return tagIDCardDownloaded(cardData);
  }, []);

  /**
   * Tags an ID card print action.
   *
   * @param {Object} cardData - ID card data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagIDCardPrinted = useCallback((cardData = {}) => {
    return tagIDCardPrinted(cardData);
  }, []);

  /**
   * Tags an ID card request action.
   *
   * @param {Object} requestData - ID card request data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagIDCardRequested = useCallback((requestData = {}) => {
    return tagIDCardRequested(requestData);
  }, []);

  /**
   * Tags a document download action.
   *
   * @param {Object} docData - Document data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagDocumentDownloaded = useCallback((docData = {}) => {
    return tagDocumentDownloaded(docData);
  }, []);

  /**
   * Tags a document view action.
   *
   * @param {Object} docData - Document data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagDocumentViewed = useCallback((docData = {}) => {
    return tagDocumentViewed(docData);
  }, []);

  /**
   * Tags an external link click action.
   *
   * @param {Object} linkData - External link data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagExternalLinkClicked = useCallback((linkData = {}) => {
    return tagExternalLinkClicked(linkData);
  }, []);

  /**
   * Tags a benefits viewed action.
   *
   * @param {Object} benefitsData - Benefits data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagBenefitsViewed = useCallback((benefitsData = {}) => {
    return tagBenefitsViewed(benefitsData);
  }, []);

  /**
   * Tags a page view action.
   *
   * @param {Object} pageData - Page data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagPageViewed = useCallback((pageData = {}) => {
    return tagPageViewed(pageData);
  }, []);

  /**
   * Tags a search performed action.
   *
   * @param {Object} searchData - Search data to track
   * @returns {Object} Result from tagAction
   */
  const handleTagSearchPerformed = useCallback((searchData = {}) => {
    return tagSearchPerformed(searchData);
  }, []);

  /**
   * Returns Glassbox masking DOM attributes for a given data type.
   *
   * @param {string} dataType - The data type key (e.g., 'memberId', 'memberName')
   * @returns {Object} An object containing the data attributes for Glassbox masking
   */
  const handleGetMaskingAttributes = useCallback((dataType) => {
    return getMaskingAttributes(dataType);
  }, []);

  /**
   * Returns the current masking rules.
   *
   * @returns {Object} The masking rules object
   */
  const handleGetMaskingRules = useCallback(() => {
    return getCurrentMaskingRules();
  }, []);

  /**
   * Masks a claim object for safe Glassbox capture.
   *
   * @param {Object} claim - The claim data object
   * @returns {Object} Masked claim object
   */
  const handleMaskClaimForCapture = useCallback((claim) => {
    return maskClaimForCapture(claim);
  }, []);

  /**
   * Masks a member profile for safe Glassbox capture.
   *
   * @param {Object} profile - The member profile data object
   * @returns {Object} Masked profile object
   */
  const handleMaskProfileForCapture = useCallback((profile) => {
    return maskProfileForCapture(profile);
  }, []);

  /**
   * Masks an ID card for safe Glassbox capture.
   *
   * @param {Object} cardFront - The ID card front data object
   * @returns {Object} Masked ID card front object
   */
  const handleMaskIDCardForCapture = useCallback((cardFront) => {
    return maskIDCardForCapture(cardFront);
  }, []);

  /**
   * Masks a prescription for safe Glassbox capture.
   *
   * @param {Object} prescription - The prescription data object
   * @returns {Object} Masked prescription object
   */
  const handleMaskPrescriptionForCapture = useCallback((prescription) => {
    return maskPrescriptionForCapture(prescription);
  }, []);

  const contextValue = useMemo(() => ({
    enabled: isGlassboxEnabled(),
    initialized: initializedRef.current,
    tagAction: tagActionHandler,
    tagClaimOpened: handleTagClaimOpened,
    tagEOBDownloaded: handleTagEOBDownloaded,
    tagIDCardDownloaded: handleTagIDCardDownloaded,
    tagIDCardPrinted: handleTagIDCardPrinted,
    tagIDCardRequested: handleTagIDCardRequested,
    tagDocumentDownloaded: handleTagDocumentDownloaded,
    tagDocumentViewed: handleTagDocumentViewed,
    tagExternalLinkClicked: handleTagExternalLinkClicked,
    tagBenefitsViewed: handleTagBenefitsViewed,
    tagPageViewed: handleTagPageViewed,
    tagSearchPerformed: handleTagSearchPerformed,
    getMaskingAttributes: handleGetMaskingAttributes,
    getMaskingRules: handleGetMaskingRules,
    maskClaimForCapture: handleMaskClaimForCapture,
    maskProfileForCapture: handleMaskProfileForCapture,
    maskIDCardForCapture: handleMaskIDCardForCapture,
    maskPrescriptionForCapture: handleMaskPrescriptionForCapture,
    ACTIONS: GLASSBOX_ACTIONS,
  }), [
    tagActionHandler,
    handleTagClaimOpened,
    handleTagEOBDownloaded,
    handleTagIDCardDownloaded,
    handleTagIDCardPrinted,
    handleTagIDCardRequested,
    handleTagDocumentDownloaded,
    handleTagDocumentViewed,
    handleTagExternalLinkClicked,
    handleTagBenefitsViewed,
    handleTagPageViewed,
    handleTagSearchPerformed,
    handleGetMaskingAttributes,
    handleGetMaskingRules,
    handleMaskClaimForCapture,
    handleMaskProfileForCapture,
    handleMaskIDCardForCapture,
    handleMaskPrescriptionForCapture,
  ]);

  return (
    <GlassboxContext.Provider value={contextValue}>
      {children}
    </GlassboxContext.Provider>
  );
};

GlassboxProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { GlassboxContext };
export default GlassboxProvider;