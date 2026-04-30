import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import ClaimsList from '../components/claims/ClaimsList.jsx';
import Button from '../components/ui/Button.jsx';
import { ROUTES } from '../constants/constants.js';

/**
 * ClaimsPage component.
 * Claims page composing ClaimsList component. Provides page header with
 * 'Submit a Claim' button that navigates to ClaimSubmissionPage.
 * Uses HB CSS page-content layout.
 *
 * @returns {React.ReactElement} The claims page element
 */
const ClaimsPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();
  const navigate = useNavigate();

  /**
   * Tag page view on mount.
   */
  React.useEffect(() => {
    tagPageViewed({
      pageName: 'Claims',
      route: ROUTES.CLAIMS,
    });
  }, [tagPageViewed]);

  /**
   * Handles navigation to the claim submission page.
   */
  const handleSubmitClaim = useCallback(() => {
    navigate('/claims/submit');
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Page Header with Submit a Claim button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Claims
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            View and track your medical, dental, vision, and pharmacy claims.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSubmitClaim}
          ariaLabel="Submit a new claim"
          iconLeft={
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          }
        >
          Submit a Claim
        </Button>
      </div>

      {/* Claims List */}
      <ClaimsList id="claims-page-list" />
    </div>
  );
};

export default ClaimsPage;