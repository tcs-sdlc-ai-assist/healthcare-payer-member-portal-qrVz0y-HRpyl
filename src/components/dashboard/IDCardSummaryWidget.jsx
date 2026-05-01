import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import { getIDCards } from '../../services/idCardService.js';
import { HB_CLASSES, ROUTES } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';

/**
 * Returns a coverage type icon SVG element.
 * @param {string} coverageType - The coverage type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getCoverageIcon = (coverageType) => {
  const iconProps = {
    width: '18',
    height: '18',
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
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
  }
};

/**
 * IDCardSummaryWidget component.
 * Dashboard widget showing a summary of the member's active ID cards with
 * member name, plan name, and masked member ID. Provides quick links to
 * the full ID Cards page. Uses HB CSS card styling and Glassbox
 * masking attributes for PHI/PII protection.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The ID card summary widget element
 */
const IDCardSummaryWidget = ({ className, id }) => {
  const { user } = useAuth();
  const { getMaskingAttributes } = useGlassbox();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches active ID cards for the current member.
   */
  const fetchIDCards = useCallback(() => {
    if (!user || !user.memberId) {
      setCards([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = getIDCards({ memberId: user.memberId, activeOnly: true });

      if (result.error) {
        setError(result.error);
        setCards([]);
      } else {
        setCards(result.cards || []);
      }
    } catch (err) {
      console.error('[IDCardSummaryWidget] Error fetching ID cards:', err);
      setError('Unable to load ID cards.');
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  /**
   * Fetch ID cards on mount and when dependencies change.
   */
  useEffect(() => {
    fetchIDCards();
  }, [fetchIDCards]);

  /**
   * Handles navigation to the ID cards page.
   */
  const handleViewAllCards = useCallback(() => {
    navigate(ROUTES.ID_CARDS);
  }, [navigate]);

  /**
   * Masks a member ID for display, showing only the last 4 characters.
   * @param {string} memberId - The member ID to mask
   * @returns {string} The masked member ID
   */
  const maskMemberIdForDisplay = (memberId) => {
    if (!memberId || typeof memberId !== 'string') {
      return '—';
    }

    if (memberId.length <= 4) {
      return memberId;
    }

    return '••••' + memberId.slice(-4);
  };

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const memberIdMaskingAttrs = getMaskingAttributes('memberId');
  const memberNameMaskingAttrs = getMaskingAttributes('memberName');

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
        aria-label="Loading ID cards"
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #f3f4f6',
            }}
          >
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div
                style={{
                  width: '70%',
                  height: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '50%',
                  height: '0.625rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
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
            onClick={fetchIDCards}
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
            aria-label="Retry loading ID cards"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  /**
   * Renders the empty state when no active ID cards are found.
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
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
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
          No active ID cards found.
        </p>
      </div>
    );
  };

  /**
   * Renders the ID card list.
   * @returns {React.ReactElement} ID card list
   */
  const renderCards = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        {cards.map((card) => (
          <button
            key={card.cardId}
            type="button"
            onClick={handleViewAllCards}
            aria-label={`View ${card.coverageTypeLabel || 'ID'} card details`}
            style={{
              display: 'flex',
              alignItems: 'center',
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
            {/* Coverage type icon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#0069cc',
                flexShrink: 0,
                border: '1px solid #e5e7eb',
              }}
              aria-hidden="true"
            >
              {getCoverageIcon(card.coverageType)}
            </div>

            {/* Card info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  marginBottom: '0.125rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#111827',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {card.front?.planName || card.coverageTypeLabel || 'ID Card'}
                </span>
                {card.isActive && (
                  <Badge variant="success" size="sm" dot>
                    Active
                  </Badge>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Member name (masked for Glassbox) */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                  {...memberNameMaskingAttrs}
                >
                  {card.front?.memberName || user?.displayName || '—'}
                </span>

                <span
                  style={{
                    color: '#d1d5db',
                    fontSize: '0.75rem',
                    userSelect: 'none',
                  }}
                  aria-hidden="true"
                >
                  |
                </span>

                {/* Member ID (masked for display and Glassbox) */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                    fontFamily: 'monospace',
                  }}
                  {...memberIdMaskingAttrs}
                  title="Member ID"
                >
                  {maskMemberIdForDisplay(card.front?.memberId || user?.memberId)}
                </span>
              </div>
            </div>

            {/* Chevron */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      id={id || 'id-card-summary-widget'}
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
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
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
              ID Cards
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              Your active insurance cards
            </p>
          </div>
        </div>

        {/* Card count badge */}
        {!isLoading && !error && cards.length > 0 && (
          <Badge variant="brand" size="sm">
            {cards.length}
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
        {!isLoading && !error && cards.length === 0 && renderEmpty()}
        {!isLoading && !error && cards.length > 0 && renderCards()}
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
          onClick={handleViewAllCards}
          aria-label="View all ID cards"
          style={{
            padding: '0.25rem 0.5rem',
            fontSize: '0.8125rem',
          }}
        >
          View All Cards
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

        {!isLoading && !error && cards.length > 0 && (
          <span
            style={{
              fontSize: '0.6875rem',
              color: '#9ca3af',
              lineHeight: 1.4,
            }}
          >
            {cards.length} active {cards.length === 1 ? 'card' : 'cards'}
          </span>
        )}
      </div>
    </div>
  );
};

IDCardSummaryWidget.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

IDCardSummaryWidget.defaultProps = {
  className: '',
  id: undefined,
};

export default IDCardSummaryWidget;
