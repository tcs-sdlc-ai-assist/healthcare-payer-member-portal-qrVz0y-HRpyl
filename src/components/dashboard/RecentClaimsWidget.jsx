import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getRecentClaims } from '../../services/claimsService.js';
import { HB_CLASSES, ROUTES, WIDGET_DEFAULTS } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';

/**
 * Returns the Badge variant string for a given claim status badge class.
 * @param {string} statusBadgeClass - The HB CSS badge class string
 * @returns {string} The Badge component variant
 */
const getBadgeVariant = (statusBadgeClass) => {
  if (!statusBadgeClass || typeof statusBadgeClass !== 'string') {
    return 'neutral';
  }

  if (statusBadgeClass.includes('hb-badge-success')) {
    return 'success';
  }
  if (statusBadgeClass.includes('hb-badge-warning')) {
    return 'warning';
  }
  if (statusBadgeClass.includes('hb-badge-error')) {
    return 'error';
  }
  if (statusBadgeClass.includes('hb-badge-info')) {
    return 'info';
  }
  if (statusBadgeClass.includes('hb-badge-brand')) {
    return 'brand';
  }

  return 'neutral';
};

/**
 * RecentClaimsWidget component.
 * Dashboard widget displaying the 3–5 most recent claims with claim number,
 * status badge, provider name, service date, and amount owed. Provides a
 * link to the full claims list. Uses HB CSS card, table, and badge styling.
 * Formats currency and dates using enriched claim data from claimsService.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {number} [props.count=5] - Number of recent claims to display (3–5)
 * @returns {React.ReactElement} The recent claims widget element
 */
const RecentClaimsWidget = ({ className, id, count }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const claimCount = typeof count === 'number' && count >= 1 && count <= 10 ? count : WIDGET_DEFAULTS.claimsToShow;

  /**
   * Fetches recent claims for the current member.
   */
  const fetchRecentClaims = useCallback(() => {
    if (!user || !user.memberId) {
      setClaims([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const recentClaims = getRecentClaims(user.memberId, claimCount);
      setClaims(recentClaims);
    } catch (err) {
      console.error('[RecentClaimsWidget] Error fetching recent claims:', err);
      setError('Unable to load recent claims.');
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, claimCount]);

  /**
   * Fetch claims on mount and when dependencies change.
   */
  useEffect(() => {
    fetchRecentClaims();
  }, [fetchRecentClaims]);

  /**
   * Handles navigation to the full claims list.
   */
  const handleViewAllClaims = useCallback(() => {
    navigate(ROUTES.CLAIMS);
  }, [navigate]);

  /**
   * Handles navigation to a specific claim detail page.
   * @param {string} claimId - The claim identifier
   */
  const handleClaimClick = useCallback((claimId) => {
    if (!claimId) {
      return;
    }
    navigate(`/claims/${claimId}`);
  }, [navigate]);

  const containerClassName = [
    HB_CLASSES.card,
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
          gap: '0.75rem',
          padding: '0.5rem 0',
        }}
        role="status"
        aria-label="Loading recent claims"
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0',
              borderBottom: index < 2 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '1rem',
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
            onClick={fetchRecentClaims}
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
            aria-label="Retry loading recent claims"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renders the empty state when no claims are found.
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
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
          No recent claims found.
        </p>
      </div>
    );
  };

  /**
   * Renders the claims table.
   * @returns {React.ReactElement} Claims table
   */
  const renderClaims = () => {
    return (
      <div
        style={{
          overflowX: 'auto',
        }}
        className="hb-scrollbar-thin"
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
          role="table"
          aria-label="Recent claims"
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Claim
              </th>
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Status
              </th>
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Provider
              </th>
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Date
              </th>
              <th
                style={{
                  padding: '0.5rem 0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                You Owe
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => {
              const isLast = index === claims.length - 1;

              return (
                <tr
                  key={claim.claimId}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease-in-out',
                  }}
                  onClick={() => handleClaimClick(claim.claimId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClaimClick(claim.claimId);
                    }
                  }}
                  tabIndex={0}
                  role="row"
                  aria-label={`Claim ${claim.claimNumber}, ${claim.statusLabel}, ${claim.formattedMemberOwes}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    style={{
                      padding: '0.625rem 0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#0069cc',
                          lineHeight: 1.3,
                        }}
                      >
                        {claim.claimNumber || claim.claimId}
                      </span>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: '#9ca3af',
                          lineHeight: 1.3,
                        }}
                      >
                        {claim.typeLabel || ''}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '0.625rem 0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Badge
                      variant={getBadgeVariant(claim.statusBadgeClass)}
                      size="sm"
                      dot
                    >
                      {claim.statusLabel || 'Unknown'}
                    </Badge>
                  </td>
                  <td
                    style={{
                      padding: '0.625rem 0.75rem',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '12rem',
                        display: 'inline-block',
                      }}
                      title={claim.provider || ''}
                    >
                      {claim.provider || '—'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.625rem 0.75rem',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#6b7280',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.formattedServiceDate || '—'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '0.625rem 0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: claim.memberOwes > 0 ? '#111827' : '#10b981',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.formattedMemberOwes || '$0.00'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      id={id || 'recent-claims-widget'}
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
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
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
              Recent Claims
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              Your latest claim activity
            </p>
          </div>
        </div>

        {/* Claim count badge */}
        {!isLoading && !error && claims.length > 0 && (
          <Badge variant="brand" size="sm">
            {claims.length}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div
        className={HB_CLASSES.cardBody}
        style={{ padding: '0.75rem 1rem' }}
      >
        {isLoading && renderLoading()}
        {!isLoading && error && renderError()}
        {!isLoading && !error && claims.length === 0 && renderEmpty()}
        {!isLoading && !error && claims.length > 0 && renderClaims()}
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
          onClick={handleViewAllClaims}
          aria-label="View all claims"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.8125rem',
          }}
        >
          View All Claims
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

        {!isLoading && !error && claims.length > 0 && (
          <span
            style={{
              fontSize: '0.6875rem',
              color: '#9ca3af',
              lineHeight: 1.4,
            }}
          >
            Showing {claims.length} most recent
          </span>
        )}
      </div>
    </div>
  );
};

RecentClaimsWidget.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  count: PropTypes.number,
};

RecentClaimsWidget.defaultProps = {
  className: '',
  id: undefined,
  count: undefined,
};

export default RecentClaimsWidget;