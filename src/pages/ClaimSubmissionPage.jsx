import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import ClaimSubmissionForm from '../components/claims/ClaimSubmissionForm.jsx';
import { ROUTES } from '../constants/constants.js';

/**
 * ClaimSubmissionPage component.
 * Claim submission page rendering ClaimSubmissionForm component.
 * Includes page header and back navigation to claims list.
 * Uses HB CSS page-content layout.
 *
 * @returns {React.ReactElement} The claim submission page element
 */
const ClaimSubmissionPage = () => {
  const navigate = useNavigate();
  const { tagPageViewed } = useGlassbox();

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Submit a Claim',
      route: '/claims/submit',
    });
  }, [tagPageViewed]);

  /**
   * Handles navigation back to the claims list.
   */
  const handleBackToClaims = useCallback(() => {
    navigate(ROUTES.CLAIMS);
  }, [navigate]);

  /**
   * Handles successful claim submission.
   * @param {Object} result - The submission result object
   */
  const handleSuccess = useCallback((result) => {
    // Success is handled within ClaimSubmissionForm with inline confirmation
  }, []);

  /**
   * Handles cancel action by navigating back to claims list.
   */
  const handleCancel = useCallback(() => {
    navigate(ROUTES.CLAIMS);
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Back Navigation */}
      <div>
        <button
          type="button"
          className="hb-btn hb-btn-tertiary"
          onClick={handleBackToClaims}
          aria-label="Go back to claims list"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.8125rem',
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Claims
        </button>
      </div>

      {/* Claim Submission Form */}
      <ClaimSubmissionForm
        id="claim-submission-page-form"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ClaimSubmissionPage;