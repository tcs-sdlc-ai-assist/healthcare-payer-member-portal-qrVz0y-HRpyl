import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getBenefits,
  getBenefitDetails,
  getBenefitsSummaryForMember,
  getDeductibleProgress,
  getOutOfPocketProgress,
  getCoverageTypeOptions,
  getPlanStatusOptions,
} from '../../services/benefitsService.js';
import { HB_CLASSES, ROUTES, COVERAGE_TYPE_LABELS } from '../../constants/constants.js';
import ProgressBar from '../ui/ProgressBar.jsx';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';
import CoverageSelector from '../shared/CoverageSelector.jsx';

/**
 * Returns the ProgressBar variant based on the percentage filled.
 * @param {number} percentage - The percentage value (0-100)
 * @returns {string} The ProgressBar variant string
 */
const getProgressVariant = (percentage) => {
  if (percentage >= 90) {
    return 'error';
  }
  if (percentage >= 70) {
    return 'warning';
  }
  if (percentage >= 40) {
    return 'brand';
  }
  return 'success';
};

/**
 * Returns a coverage type icon SVG element.
 * @param {string} coverageType - The coverage type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getCoverageIcon = (coverageType) => {
  const iconProps = {
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (coverageType) {
    case 'MEDICAL':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'DENTAL':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 'VISION':
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'PHARMACY':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'BEHAVIORAL_HEALTH':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
};

/**
 * Returns the Badge variant for a plan status.
 * @param {string} planStatus - The plan status string
 * @returns {string} The Badge variant
 */
const getPlanStatusBadgeVariant = (planStatus) => {
  switch (planStatus) {
    case 'active':
      return 'success';
    case 'terminated':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'neutral';
  }
};

/**
 * BenefitsSummary component.
 * Benefits at a glance component displaying plan status, plan type,
 * deductible progress (individual/family), and out-of-pocket progress
 * (individual/family) using ProgressBar components. Shows coverage
 * selector for switching between plans. Uses HB CSS card and grid classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.defaultCoverageType] - Default coverage type to display
 * @param {string} [props.defaultTier='individual'] - Default tier to display ('individual' or 'family')
 * @returns {React.ReactElement} The benefits summary element
 */
const BenefitsSummary = ({ className, id, defaultCoverageType, defaultTier }) => {
  const { user } = useAuth();
  const { tagBenefitsViewed } = useGlassbox();
  const navigate = useNavigate();

  const [benefits, setBenefits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [deductibles, setDeductibles] = useState([]);
  const [outOfPocket, setOutOfPocket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoverageType, setSelectedCoverageType] = useState(defaultCoverageType || '');
  const [activeTier, setActiveTier] = useState(defaultTier || 'individual');

  /**
   * Fetches benefits data for the current member.
   */
  const fetchBenefitsData = useCallback(() => {
    if (!user || !user.memberId) {
      setBenefits([]);
      setSummary(null);
      setDeductibles([]);
      setOutOfPocket([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        memberId: user.memberId,
        activeOnly: true,
      };

      if (selectedCoverageType) {
        params.coverageType = selectedCoverageType;
      }

      const result = getBenefits(params);

      if (result.error) {
        setError(result.error);
        setBenefits([]);
        setSummary(null);
      } else {
        setBenefits(result.benefits || []);
        setSummary(result.summary || null);
      }

      const deductibleData = getDeductibleProgress(user.memberId);
      const oopData = getOutOfPocketProgress(user.memberId);

      setDeductibles(deductibleData || []);
      setOutOfPocket(oopData || []);

      tagBenefitsViewed({
        coverageType: selectedCoverageType || 'ALL',
        planName: null,
      });
    } catch (err) {
      console.error('[BenefitsSummary] Error fetching benefits data:', err);
      setError('Unable to load benefits information. Please try again.');
      setBenefits([]);
      setSummary(null);
      setDeductibles([]);
      setOutOfPocket([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, selectedCoverageType, tagBenefitsViewed]);

  /**
   * Fetch benefits data on mount and when dependencies change.
   */
  useEffect(() => {
    fetchBenefitsData();
  }, [fetchBenefitsData]);

  /**
   * Handles coverage type filter change.
   * @param {string} value - The new coverage type value
   */
  const handleCoverageTypeChange = useCallback((value) => {
    setSelectedCoverageType(value);
  }, []);

  /**
   * Handles tier toggle between individual and family.
   * @param {string} newTier - The tier to switch to
   */
  const handleTierChange = useCallback((newTier) => {
    setActiveTier(newTier);
  }, []);

  /**
   * Handles navigation to the full coverage page.
   */
  const handleViewFullCoverage = useCallback(() => {
    navigate(ROUTES.COVERAGE);
  }, [navigate]);

  /**
   * Filters deductible and OOP data by selected coverage type.
   * @param {Object[]} data - Array of deductible or OOP progress objects
   * @returns {Object[]} Filtered array
   */
  const filterByCoverageType = useCallback((data) => {
    if (!selectedCoverageType) {
      return data;
    }
    return data.filter((item) => item.coverageType === selectedCoverageType);
  }, [selectedCoverageType]);

  const filteredDeductibles = filterByCoverageType(deductibles);
  const filteredOutOfPocket = filterByCoverageType(outOfPocket);

  /**
   * Filters benefits by selected coverage type.
   */
  const filteredBenefits = selectedCoverageType
    ? benefits.filter((b) => b.coverageType === selectedCoverageType)
    : benefits;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders the loading skeleton state.
   * @returns {React.ReactElement} Loading skeleton
   */
  const renderLoading = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
        role="status"
        aria-label="Loading benefits information"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={HB_CLASSES.card}
            style={{ overflow: 'hidden' }}
          >
            <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '50%',
                    height: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '0.625rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '9999px',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
                <div
                  style={{
                    width: '70%',
                    height: '0.625rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.25rem',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
      </div>
    );
  };

  /**
   * Renders the error state.
   * @returns {React.ReactElement} Error message
   */
  const renderError = () => {
    return (
      <Alert
        variant="error"
        title="Error Loading Benefits"
        dismissible={false}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={fetchBenefitsData}
          style={{
            display: 'inline',
            marginLeft: '0.5rem',
            padding: 0,
            background: 'none',
            border: 'none',
            color: '#991b1b',
            fontWeight: 500,
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          aria-label="Retry loading benefits"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no benefits are found.
   * @returns {React.ReactElement} Empty state message
   */
  const renderEmpty = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '3rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <p
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              lineHeight: 1.3,
            }}
          >
            No benefits found
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
              maxWidth: '24rem',
            }}
          >
            {selectedCoverageType
              ? 'No benefits match the selected coverage type. Try selecting a different coverage type.'
              : 'You don\'t have any active benefits on file.'}
          </p>
        </div>
        {selectedCoverageType && (
          <button
            type="button"
            className={HB_CLASSES.btnSecondary}
            onClick={() => setSelectedCoverageType('')}
            aria-label="Clear coverage type filter"
            style={{
              padding: '0.375rem 1rem',
              fontSize: '0.875rem',
            }}
          >
            Show All Coverages
          </button>
        )}
      </div>
    );
  };

  /**
   * Renders the overall summary card with aggregated deductible and OOP totals.
   * @returns {React.ReactElement} Summary card
   */
  const renderSummaryCard = () => {
    if (!summary) {
      return null;
    }

    return (
      <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
        <div
          className={HB_CLASSES.cardHeader}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '0.5rem',
                backgroundColor: '#e6f0fa',
                color: '#0069cc',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.0625rem',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.3,
                }}
              >
                Benefits Overview
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Your active plan summary at a glance
              </p>
            </div>
          </div>

          {/* Tier toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '0.375rem',
              padding: '0.125rem',
            }}
            role="tablist"
            aria-label="Select individual or family tier"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTier === 'individual'}
              aria-controls="benefits-summary-content"
              onClick={() => handleTierChange('individual')}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.6875rem',
                fontWeight: activeTier === 'individual' ? 600 : 400,
                color: activeTier === 'individual' ? '#0069cc' : '#6b7280',
                backgroundColor: activeTier === 'individual' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                lineHeight: 1.4,
                boxShadow: activeTier === 'individual' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
              }}
            >
              Individual
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTier === 'family'}
              aria-controls="benefits-summary-content"
              onClick={() => handleTierChange('family')}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.6875rem',
                fontWeight: activeTier === 'family' ? 600 : 400,
                color: activeTier === 'family' ? '#0069cc' : '#6b7280',
                backgroundColor: activeTier === 'family' ? '#ffffff' : 'transparent',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                lineHeight: 1.4,
                boxShadow: activeTier === 'family' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
              }}
            >
              Family
            </button>
          </div>
        </div>

        <div
          id="benefits-summary-content"
          className={HB_CLASSES.cardBody}
          style={{ padding: '1rem 1.5rem' }}
          role="tabpanel"
          aria-label={`${activeTier === 'individual' ? 'Individual' : 'Family'} benefits summary`}
        >
          {/* Quick stats row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.4,
                }}
              >
                Active Plans
              </span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.2,
                }}
              >
                {summary.activeBenefits || 0}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.4,
                }}
              >
                Total Deductible
              </span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.2,
                }}
              >
                {summary.formattedTotalDeductibleUsed || '$0.00'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                of {summary.formattedTotalDeductibleMax || '$0.00'}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1.4,
                }}
              >
                Total Out-of-Pocket
              </span>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  lineHeight: 1.2,
                }}
              >
                {summary.formattedTotalOOPUsed || '$0.00'}
              </span>
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                of {summary.formattedTotalOOPMax || '$0.00'}
              </span>
            </div>
          </div>

          {/* Deductible & OOP progress per coverage type */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {filteredDeductibles.map((ded) => {
              const matchingOOP = filteredOutOfPocket.find(
                (oop) => oop.benefitId === ded.benefitId
              );
              const dedTier = ded?.[activeTier];
              const oopTier = matchingOOP?.[activeTier];

              const hasData = (dedTier && dedTier.max > 0) || (oopTier && oopTier.max > 0);

              if (!hasData) {
                return null;
              }

              return (
                <div
                  key={ded.benefitId}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                  }}
                >
                  {/* Coverage type header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: '#ffffff',
                        color: '#0069cc',
                        flexShrink: 0,
                        border: '1px solid #e5e7eb',
                      }}
                      aria-hidden="true"
                    >
                      {getCoverageIcon(ded.coverageType)}
                    </div>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {ded.coverageTypeLabel || ded.planName || 'Coverage'}
                    </span>
                  </div>

                  {/* Deductible progress */}
                  {dedTier && dedTier.max > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Deductible
                      </span>
                      <ProgressBar
                        used={dedTier.used}
                        max={dedTier.max}
                        variant={getProgressVariant(dedTier.percentage)}
                        size="sm"
                        showAmounts={true}
                        showPercentage={true}
                        showRemaining={false}
                        usedLabel="used"
                        maxLabel="max"
                        label={`${ded.coverageTypeLabel || ''} ${activeTier} deductible`}
                        animate={true}
                      />
                    </div>
                  )}

                  {/* Out-of-Pocket progress */}
                  {oopTier && oopTier.max > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Out-of-Pocket Max
                      </span>
                      <ProgressBar
                        used={oopTier.used}
                        max={oopTier.max}
                        variant={getProgressVariant(oopTier.percentage)}
                        size="sm"
                        showAmounts={true}
                        showPercentage={true}
                        showRemaining={false}
                        usedLabel="used"
                        maxLabel="max"
                        label={`${ded.coverageTypeLabel || ''} ${activeTier} out-of-pocket maximum`}
                        animate={true}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={HB_CLASSES.cardFooter}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
          }}
        >
          <button
            type="button"
            className={HB_CLASSES.btnTertiary}
            onClick={handleViewFullCoverage}
            aria-label="View full coverage details"
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.8125rem',
            }}
          >
            View Full Coverage
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <span
            style={{
              fontSize: '0.6875rem',
              color: '#9ca3af',
              lineHeight: 1.4,
              textTransform: 'capitalize',
            }}
          >
            {activeTier} tier
          </span>
        </div>
      </div>
    );
  };

  /**
   * Renders the plan cards for each active benefit.
   * @returns {React.ReactElement} Plan cards
   */
  const renderPlanCards = () => {
    if (filteredBenefits.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          Active Plans
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredBenefits.map((benefit) => (
            <div
              key={benefit.benefitId}
              className={HB_CLASSES.card}
              style={{ overflow: 'hidden' }}
            >
              <div
                className={HB_CLASSES.cardBody}
                style={{ padding: '1rem 1.25rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {/* Plan header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '0.375rem',
                          backgroundColor: '#e6f0fa',
                          color: '#0069cc',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {getCoverageIcon(benefit.coverageType)}
                      </div>
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            color: '#111827',
                            lineHeight: 1.3,
                          }}
                        >
                          {benefit.coverageTypeLabel || 'Coverage'}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          {benefit.planName || ''}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={getPlanStatusBadgeVariant(benefit.planStatus)}
                      size="sm"
                      dot
                    >
                      {benefit.formattedPlanStatus || 'Unknown'}
                    </Badge>
                  </div>

                  {/* Plan details */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Plan Type
                      </span>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#111827',
                        }}
                      >
                        {benefit.planType || '—'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Effective
                      </span>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#111827',
                        }}
                      >
                        {benefit.formattedEffectiveDate || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Deductible progress for this plan */}
                  {benefit.deductibleProgress && benefit.deductibleProgress[activeTier] && benefit.deductibleProgress[activeTier].max > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '0.625rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Deductible ({activeTier})
                      </span>
                      <ProgressBar
                        used={benefit.deductibleProgress[activeTier].used}
                        max={benefit.deductibleProgress[activeTier].max}
                        variant={getProgressVariant(benefit.deductibleProgress[activeTier].percentage)}
                        size="sm"
                        showAmounts={true}
                        showPercentage={true}
                        showRemaining={false}
                        usedLabel="used"
                        maxLabel="max"
                        label={`${benefit.coverageTypeLabel || ''} ${activeTier} deductible`}
                        animate={true}
                      />
                    </div>
                  )}

                  {/* OOP progress for this plan */}
                  {benefit.outOfPocketProgress && benefit.outOfPocketProgress[activeTier] && benefit.outOfPocketProgress[activeTier].max > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: '#6b7280',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Out-of-Pocket ({activeTier})
                      </span>
                      <ProgressBar
                        used={benefit.outOfPocketProgress[activeTier].used}
                        max={benefit.outOfPocketProgress[activeTier].max}
                        variant={getProgressVariant(benefit.outOfPocketProgress[activeTier].percentage)}
                        size="sm"
                        showAmounts={true}
                        showPercentage={true}
                        showRemaining={false}
                        usedLabel="used"
                        maxLabel="max"
                        label={`${benefit.coverageTypeLabel || ''} ${activeTier} out-of-pocket maximum`}
                        animate={true}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the benefits summary content.
   * @returns {React.ReactElement} Benefits summary content
   */
  const renderContent = () => {
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
              Benefits Summary
            </h1>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              View your plan details, deductible progress, and out-of-pocket spending.
            </p>
          </div>

          {/* Summary badges */}
          {summary && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <Badge variant="brand" size="sm">
                {summary.activeBenefits} active {summary.activeBenefits === 1 ? 'plan' : 'plans'}
              </Badge>
            </div>
          )}
        </div>

        {/* Coverage Type Filter */}
        <div
          style={{
            maxWidth: '20rem',
          }}
        >
          <CoverageSelector
            value={selectedCoverageType}
            onChange={handleCoverageTypeChange}
            label="Filter by Coverage"
            placeholder="All Coverages"
            showAllOption={true}
            source="benefits"
            size="sm"
            native={true}
            block={true}
            id="benefits-coverage-filter"
            ariaLabel="Filter benefits by coverage type"
          />
        </div>

        {/* Summary Card with Deductible & OOP Progress */}
        {summary && renderSummaryCard()}

        {/* Individual Plan Cards */}
        {renderPlanCards()}

        {/* Empty state for filtered results */}
        {filteredBenefits.length === 0 && !isLoading && !error && renderEmpty()}
      </div>
    );
  };

  return (
    <div
      id={id || 'benefits-summary'}
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {isLoading && renderLoading()}
      {!isLoading && error && renderError()}
      {!isLoading && !error && renderContent()}
    </div>
  );
};

BenefitsSummary.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  defaultCoverageType: PropTypes.string,
  defaultTier: PropTypes.oneOf(['individual', 'family']),
};

BenefitsSummary.defaultProps = {
  className: '',
  id: undefined,
  defaultCoverageType: undefined,
  defaultTier: 'individual',
};

export default BenefitsSummary;