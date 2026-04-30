import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import ClaimDetails from '../components/claims/ClaimDetails.jsx';
import { ROUTES } from '../constants/constants.js';

/**
 * ClaimDetailsPage component.
 * Claim details page that reads claim ID from route params, fetches claim data
 * via claimsService, and renders ClaimDetails component. Includes back navigation
 * to claims list. Uses HB CSS page-content layout.
 *
 * @returns {React.ReactElement} The claim details page element
 */
const ClaimDetailsPage = () => {
  const { id } = useParams();
  const { tagPageViewed } = useGlassbox();

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Claim Details',
      route: `/claims/${id || ''}`,
    });
  }, [tagPageViewed, id]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <ClaimDetails
        id="claim-details-page"
        claimId={id}
      />
    </div>
  );
};

export default ClaimDetailsPage;