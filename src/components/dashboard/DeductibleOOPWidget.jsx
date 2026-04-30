import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDeductibleProgress, getOutOfPocketProgress } from '../../services/benefitsService.js';
import { HB_CLASSES, ROUTES, COVERAGE_TYPE_LABELS } from '../../constants/constants.js';
import ProgressBar from '../ui/ProgressBar.jsx';
import Badge from '../ui/Badge.jsx';

/**
 * Returns a coverage type icon SVG element.
 * @param {string} coverageType - The coverage type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getCoverageIcon = (coverageType) => {
  const iconProps = {
    width: '16',
    height: '16',
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
 * DeductibleOOPWidget component.
 * Dashboard widget displaying deductible and out-of-pocket progress bars
 * for individual and family tiers across all active coverage types. Shows
 * used/max amounts with currency formatting. Uses ProgressBar component
 * and HB CSS card styling. Provides quick link to the full Coverage page.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.tier='individual'] - Default tier to display ('individual' or 'family')
 * @returns {React.ReactElement} The deductible/OOP widget element
 */
const DeductibleOOPWidget = ({ className, id, tier: defaultTier }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deductibles, setDeductibles] = useState([]);
  const [outOfPocket, setOutOfPocket] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTier, setActiveTier] = useState(defaultTier || 'individual');

  /**
   * Fetches deductible and out-of-pocket progress data for the current member.
   */
  const fetchData = useCallback(() => {
    if (!user || !user.memberId) {
      setDeductibles([]);
      setOutOfPocket([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const deductibleData = getDeductibleProgress(user.memberId);
      const oopData = getOutOfPocketProgress(user.memberId);

      setDeductibles(deductibleData || []);
      setOutOfPocket(oopData || []);
    } catch (err) {
      console.error('[DeductibleOOPWidget] Error fetching deductible/OOP data:', err);
      setError('Unable to load deductible and out-of-pocket information.');
      setDeductibles([]);
      setOutOfPocket([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Fetch data on mount and when dependencies change.
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Handles navigation to the coverage page.
   */
  const handleViewCoverage = useCallback(() => {
    navigate(ROUTES.COVERAGE);
  }, [navigate]);

  /**
   * Handles tier toggle between individual and family.
   * @param {string} newTier - The tier to switch to
   */
  const handleTierChange = useCallback((newTier) => {
    setActiveTier(newTier);
  }, []);

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Filters out entries with zero max values for both deductible and OOP.
   * @param {Object} deductibleEntry - A deductible progress entry
   * @param {Object} oopEntry - An OOP progress entry
   * @param {string} tierKey - The tier key ('individual' or 'family')
   * @returns {boolean} True if the entry has meaningful data
   */
  const hasData = (deductibleEntry, oopEntry, tierKey) => {
    const dedMax = deductibleEntry?.[tierKey]?.max || 0;
    const oopMax = oopEntry?.[tierKey]?.max || 0;
    return dedMax > 0 || oopMax > 0;
  };

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
          gap: '1rem',
          padding: '0.5rem 0',
        }}
        role="status"
        aria-label="Loading deductible and out-of-pocket information"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #f3f4f6',
            }}
          >
            <div
              style={{
                width: '40%',
                height: '0.75rem',
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
                width: '60%',
                height: '0.625rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.25rem',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
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
      <div
        className={HB_CLASSES.alertWarning}
        role="alert"
        style={{
          margin: 0,
          fontSize: '0.8125rem',
        }}
      >
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
          style={{ flexShrink: 0, marginTop: '1px' }}
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span>{error}</span>
          <button
            type="button"
            onClick={fetchData}
            style={{
              display: 'inline',
              marginLeft: '0.5rem',
              padding: 0,
              background: 'none',
              border: 'none',
              color: '#92400e',
              fontWeight: 500,
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.8125rem',
            }}
            aria-label="Retry loading deductible and out-of-pocket information"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renders the empty state when no deductible/OOP data is found.
   * @returns {React.ReactElement} Empty state message
   */
  const renderEmpty = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.5rem 1rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '9999px',
            backgroundColor: '#f3f4f6',
            color: '#9ca3af',
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
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          No deductible or out-of-pocket information available.
        </p>
      </div>
    );
  };

  /**
   * Renders the deductible and OOP progress bars for all coverage types.
   * @returns {React.ReactElement} Progress bars content
   */
  const renderProgress = () => {
    const entries = deductibles.map((ded) => {
      const matchingOOP = outOfPocket.find(
        (oop) => oop.benefitId === ded.benefitId
      );
      return {
        deductible: ded,
        oop: matchingOOP || null,
      };
    });

    const filteredEntries = entries.filter((entry) => {
      return hasData(entry.deductible, entry.oop, activeTier);
    });

    if (filteredEntries.length === 0) {
      return renderEmpty();
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {filteredEntries.map((entry) => {
          const ded = entry.deductible;
          const oop = entry.oop;
          const dedTier = ded?.[activeTier];
          const oopTier = oop?.[activeTier];

          return (
            <button
              key={ded.benefitId}
              type="button"
              onClick={handleViewCoverage}
              aria-label={`View ${ded.coverageTypeLabel || 'coverage'} deductible and out-of-pocket details`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f0fa';
                e.currentTarget.style.borderColor = '#0069cc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
              onFocus={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f0fa';
                e.currentTarget.style.borderColor = '#0069cc';
              }}
              onBlur={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb';
                e.currentTarget.style.borderColor = '#e5e7eb';
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
                    fontSize: '0.8125rem',
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
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div
      id={id || 'deductible-oop-widget'}
      className={containerClassName}
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
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
            <h3
              style={{
                margin: 0,
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              Deductible & Out-of-Pocket
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              Track your spending progress
            </p>
          </div>
        </div>

        {/* Tier toggle */}
        {!isLoading && !error && deductibles.length > 0 && (
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
              aria-controls="deductible-oop-content"
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
              aria-controls="deductible-oop-content"
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
        )}
      </div>

      {/* Body */}
      <div
        id="deductible-oop-content"
        className={HB_CLASSES.cardBody}
        style={{ padding: '0.75rem 1rem' }}
        role="tabpanel"
        aria-label={`${activeTier === 'individual' ? 'Individual' : 'Family'} deductible and out-of-pocket progress`}
      >
        {isLoading && renderLoading()}
        {!isLoading && error && renderError()}
        {!isLoading && !error && deductibles.length === 0 && renderEmpty()}
        {!isLoading && !error && deductibles.length > 0 && renderProgress()}
      </div>

      {/* Footer */}
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
          onClick={handleViewCoverage}
          aria-label="View full coverage details"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.8125rem',
          }}
        >
          View Coverage
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

        {!isLoading && !error && deductibles.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

DeductibleOOPWidget.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  tier: PropTypes.oneOf(['individual', 'family']),
};

DeductibleOOPWidget.defaultProps = {
  className: '',
  id: undefined,
  tier: 'individual',
};

export default DeductibleOOPWidget;