import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import { ROUTES } from '../constants/constants.js';
import BenefitsSummary from '../components/benefits/BenefitsSummary.jsx';
import CoverageCategories from '../components/benefits/CoverageCategories.jsx';

/**
 * BenefitsPage component.
 * Benefits & Coverage page composing BenefitsSummary and CoverageCategories
 * components. Manages selected coverage state shared between components.
 * Uses HB CSS page-content layout and grid classes.
 *
 * @returns {React.ReactElement} The benefits page element
 */
const BenefitsPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  const [selectedCoverageType, setSelectedCoverageType] = useState('');
  const [selectedTier, setSelectedTier] = useState('individual');

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Benefits & Coverage',
      route: ROUTES.COVERAGE,
    });
  }, [tagPageViewed]);

  /**
   * Handles coverage type change from either component.
   * @param {string} value - The new coverage type value
   */
  const handleCoverageTypeChange = useCallback((value) => {
    setSelectedCoverageType(value);
  }, []);

  /**
   * Handles tier change.
   * @param {string} value - The new tier value ('individual' or 'family')
   */
  const handleTierChange = useCallback((value) => {
    setSelectedTier(value);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
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
          Benefits & Coverage
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          Review your plan details, deductible progress, out-of-pocket spending, and coverage categories.
        </p>
      </div>

      {/* Benefits Summary Section */}
      <BenefitsSummary
        id="benefits-page-summary"
        defaultCoverageType={selectedCoverageType || undefined}
        defaultTier={selectedTier}
      />

      {/* Coverage Categories Section */}
      <CoverageCategories
        id="benefits-page-coverage-categories"
        defaultCoverageType={selectedCoverageType || undefined}
        showCoverageSelector={true}
        expandFirstItem={true}
      />
    </div>
  );
};

export default BenefitsPage;