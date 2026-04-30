import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import { HB_CLASSES } from '../../constants/constants.js';
import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

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
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
  }
};

/**
 * IDCardPreview component.
 * Displays front and back of the selected ID card with flip animation.
 * Supports enlarge button opening card in Modal at larger size.
 * Displays member ID, group number, plan name, PCP, copay amounts,
 * RxBIN, and network info. PHI/PII fields have data-glassbox-mask attributes.
 * Uses HB CSS card and image classes.
 *
 * @param {Object} props
 * @param {Object} props.card - The ID card data object (enriched from idCardService)
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {Function} [props.onDownload] - Callback invoked when the download button is clicked
 * @param {Function} [props.onPrint] - Callback invoked when the print button is clicked
 * @param {Function} [props.onRequestNew] - Callback invoked when the request new card button is clicked
 * @param {boolean} [props.showActions=true] - Whether to show download/print/request action buttons
 * @returns {React.ReactElement} The ID card preview element
 */
const IDCardPreview = ({ card, className, id, onDownload, onPrint, onRequestNew, showActions }) => {
  const { getMaskingAttributes } = useGlassbox();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);
  const [enlargedSide, setEnlargedSide] = useState('front');

  const memberIdMaskingAttrs = getMaskingAttributes('memberId');
  const groupNumberMaskingAttrs = getMaskingAttributes('groupNumber');
  const subscriberIdMaskingAttrs = getMaskingAttributes('subscriberId');
  const memberNameMaskingAttrs = getMaskingAttributes('memberName');

  /**
   * Toggles the card between front and back views.
   */
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  /**
   * Opens the enlarged modal for the current side.
   */
  const handleEnlarge = useCallback(() => {
    setEnlargedSide(isFlipped ? 'back' : 'front');
    setIsEnlarged(true);
  }, [isFlipped]);

  /**
   * Closes the enlarged modal.
   */
  const handleCloseEnlarged = useCallback(() => {
    setIsEnlarged(false);
  }, []);

  /**
   * Toggles the enlarged modal between front and back.
   */
  const handleEnlargedFlip = useCallback(() => {
    setEnlargedSide((prev) => (prev === 'front' ? 'back' : 'front'));
  }, []);

  /**
   * Handles download button click.
   */
  const handleDownload = useCallback(() => {
    if (onDownload && typeof onDownload === 'function') {
      onDownload(card);
    }
  }, [onDownload, card]);

  /**
   * Handles print button click.
   */
  const handlePrint = useCallback(() => {
    if (onPrint && typeof onPrint === 'function') {
      onPrint(card);
    }
  }, [onPrint, card]);

  /**
   * Handles request new card button click.
   */
  const handleRequestNew = useCallback(() => {
    if (onRequestNew && typeof onRequestNew === 'function') {
      onRequestNew(card);
    }
  }, [onRequestNew, card]);

  if (!card || !card.front || !card.back) {
    return null;
  }

  const front = card.front;
  const back = card.back;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders the front of the ID card.
   * @param {boolean} [isLarge=false] - Whether to render at enlarged size
   * @returns {React.ReactElement} The card front element
   */
  const renderCardFront = (isLarge = false) => {
    const cardPadding = isLarge ? '1.5rem' : '1rem';
    const titleSize = isLarge ? '1.125rem' : '0.9375rem';
    const labelSize = isLarge ? '0.6875rem' : '0.625rem';
    const valueSize = isLarge ? '0.875rem' : '0.8125rem';
    const copayLabelSize = isLarge ? '0.625rem' : '0.5625rem';
    const copayValueSize = isLarge ? '0.875rem' : '0.75rem';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${isLarge ? '0.875rem 1.5rem' : '0.625rem 1rem'}`,
            background: 'linear-gradient(135deg, #0069cc 0%, #003f7a 100%)',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              HealthFirst
            </span>
            <span
              style={{
                fontSize: isLarge ? '0.8125rem' : '0.75rem',
                fontWeight: 400,
                opacity: 0.9,
              }}
            >
              {front.planName || ''}
            </span>
          </div>
          {front.planType && (
            <span
              style={{
                fontSize: isLarge ? '0.75rem' : '0.6875rem',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
              }}
            >
              {front.planType}
            </span>
          )}
        </div>

        {/* Card body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isLarge ? '0.75rem' : '0.5rem',
            padding: cardPadding,
          }}
        >
          {/* Member name */}
          <div
            style={{
              fontSize: isLarge ? '1rem' : '0.9375rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
            {...memberNameMaskingAttrs}
          >
            {front.memberName || '—'}
          </div>

          {/* Two column info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: isLarge ? '0.5rem' : '0.375rem',
            }}
          >
            {/* Member ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
              <span
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Member ID
              </span>
              <span
                style={{
                  fontSize: valueSize,
                  fontWeight: 500,
                  color: '#111827',
                  fontFamily: 'monospace',
                }}
                {...memberIdMaskingAttrs}
              >
                {front.memberId || '—'}
              </span>
            </div>

            {/* Group Number */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
              <span
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Group
              </span>
              <span
                style={{
                  fontSize: valueSize,
                  fontWeight: 500,
                  color: '#111827',
                  fontFamily: 'monospace',
                }}
                {...groupNumberMaskingAttrs}
              >
                {front.groupNumber || '—'}
              </span>
            </div>

            {/* Subscriber ID */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
              <span
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Subscriber
              </span>
              <span
                style={{
                  fontSize: valueSize,
                  fontWeight: 500,
                  color: '#111827',
                  fontFamily: 'monospace',
                }}
                {...subscriberIdMaskingAttrs}
              >
                {front.subscriberId || '—'}
              </span>
            </div>

            {/* Effective Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
              <span
                style={{
                  fontSize: labelSize,
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
                  fontSize: valueSize,
                  fontWeight: 500,
                  color: '#111827',
                }}
              >
                {front.effectiveDate || '—'}
              </span>
            </div>
          </div>

          {/* PCP Info */}
          {front.pcpName && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.0625rem',
              }}
            >
              <span
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Primary Care Physician
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    fontSize: valueSize,
                    fontWeight: 500,
                    color: '#111827',
                  }}
                >
                  {front.pcpName}
                </span>
                {front.pcpPhone && (
                  <span
                    style={{
                      fontSize: isLarge ? '0.75rem' : '0.6875rem',
                      color: '#6b7280',
                    }}
                  >
                    {front.pcpPhone}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Network */}
          {front.networkName && (
            <div
              style={{
                fontSize: isLarge ? '0.6875rem' : '0.625rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              {front.networkName}
            </div>
          )}

          {/* Copays */}
          {front.copays && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: isLarge ? '0.625rem' : '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: copayLabelSize,
                  fontWeight: 700,
                  color: '#0069cc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Copays
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.25rem',
                }}
              >
                {[
                  { label: 'Primary Care', value: front.copays.primaryCare },
                  { label: 'Specialist', value: front.copays.specialist },
                  { label: 'Urgent Care', value: front.copays.urgentCare },
                  { label: 'ER', value: front.copays.emergencyRoom },
                ].map((copay) => (
                  <div
                    key={copay.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.0625rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: copayLabelSize,
                        color: '#6b7280',
                        lineHeight: 1.3,
                      }}
                    >
                      {copay.label}
                    </span>
                    <span
                      style={{
                        fontSize: copayValueSize,
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {copay.value || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the back of the ID card.
   * @param {boolean} [isLarge=false] - Whether to render at enlarged size
   * @returns {React.ReactElement} The card back element
   */
  const renderCardBack = (isLarge = false) => {
    const cardPadding = isLarge ? '1.5rem' : '1rem';
    const labelSize = isLarge ? '0.6875rem' : '0.625rem';
    const valueSize = isLarge ? '0.8125rem' : '0.75rem';
    const sectionTitleSize = isLarge ? '0.6875rem' : '0.625rem';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Header bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `${isLarge ? '0.625rem 1.5rem' : '0.5rem 1rem'}`,
            backgroundColor: '#374151',
            color: '#ffffff',
          }}
        >
          <span
            style={{
              fontSize: isLarge ? '0.8125rem' : '0.75rem',
              fontWeight: 600,
            }}
          >
            Important Information
          </span>
          <span
            style={{
              fontSize: isLarge ? '0.6875rem' : '0.625rem',
              opacity: 0.7,
            }}
          >
            {front.planType || 'ID Card'} — Back
          </span>
        </div>

        {/* Card body */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isLarge ? '0.75rem' : '0.5rem',
            padding: cardPadding,
          }}
        >
          {/* Rx Info */}
          {back.rxInfo && (back.rxInfo.rxBIN || back.rxInfo.rxPCN || back.rxInfo.rxGroup) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
              }}
            >
              <span
                style={{
                  fontSize: sectionTitleSize,
                  fontWeight: 700,
                  color: '#0069cc',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Pharmacy / Rx Info
              </span>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.25rem',
                }}
              >
                {back.rxInfo.rxBIN && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                    <span
                      style={{
                        fontSize: labelSize,
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      RxBIN
                    </span>
                    <span
                      style={{
                        fontSize: valueSize,
                        fontWeight: 500,
                        color: '#111827',
                        fontFamily: 'monospace',
                      }}
                    >
                      {back.rxInfo.rxBIN}
                    </span>
                  </div>
                )}
                {back.rxInfo.rxPCN && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                    <span
                      style={{
                        fontSize: labelSize,
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      RxPCN
                    </span>
                    <span
                      style={{
                        fontSize: valueSize,
                        fontWeight: 500,
                        color: '#111827',
                        fontFamily: 'monospace',
                      }}
                    >
                      {back.rxInfo.rxPCN}
                    </span>
                  </div>
                )}
                {back.rxInfo.rxGroup && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.0625rem' }}>
                    <span
                      style={{
                        fontSize: labelSize,
                        fontWeight: 600,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      RxGroup
                    </span>
                    <span
                      style={{
                        fontSize: valueSize,
                        fontWeight: 500,
                        color: '#111827',
                        fontFamily: 'monospace',
                      }}
                    >
                      {back.rxInfo.rxGroup}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Phone Numbers */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              borderTop: (back.rxInfo && (back.rxInfo.rxBIN || back.rxInfo.rxPCN || back.rxInfo.rxGroup)) ? '1px solid #e5e7eb' : 'none',
              paddingTop: (back.rxInfo && (back.rxInfo.rxBIN || back.rxInfo.rxPCN || back.rxInfo.rxGroup)) ? '0.5rem' : '0',
            }}
          >
            <span
              style={{
                fontSize: sectionTitleSize,
                fontWeight: 700,
                color: '#0069cc',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Important Phone Numbers
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1875rem',
              }}
            >
              {[
                { label: 'Member Services', value: back.memberServicesPhone },
                { label: 'Claims', value: back.claimsPhone },
                { label: '24/7 Nurse Line', value: back.nurseLinePhone },
                { label: 'Behavioral Health', value: back.mentalHealthPhone },
                { label: 'Pre-Authorization', value: back.preAuthPhone },
              ]
                .filter((entry) => entry.value)
                .map((entry) => (
                  <div
                    key={entry.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: labelSize,
                        fontWeight: 600,
                        color: '#6b7280',
                        minWidth: isLarge ? '8rem' : '7rem',
                      }}
                    >
                      {entry.label}:
                    </span>
                    <span
                      style={{
                        fontSize: valueSize,
                        fontWeight: 500,
                        color: '#111827',
                      }}
                    >
                      {entry.value}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Claims Address */}
          {back.claimsAddress && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.125rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: labelSize,
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Claims Address
              </span>
              <span
                style={{
                  fontSize: isLarge ? '0.75rem' : '0.6875rem',
                  color: '#374151',
                  lineHeight: 1.4,
                }}
              >
                {back.claimsAddress}
              </span>
            </div>
          )}

          {/* Emergency Instructions */}
          {back.emergencyInstructions && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.375rem',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '0.5rem',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
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
              <span
                style={{
                  fontSize: isLarge ? '0.6875rem' : '0.625rem',
                  color: '#991b1b',
                  lineHeight: 1.4,
                }}
              >
                {back.emergencyInstructions}
              </span>
            </div>
          )}

          {/* Website */}
          {back.websiteUrl && (
            <div
              style={{
                fontSize: isLarge ? '0.6875rem' : '0.625rem',
                color: '#0069cc',
                lineHeight: 1.4,
              }}
            >
              {back.websiteUrl}
            </div>
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the enlarged modal content.
   * @returns {React.ReactElement} The modal body content
   */
  const renderEnlargedModalBody = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Side indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <button
            type="button"
            onClick={() => setEnlargedSide('front')}
            style={{
              padding: '0.375rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: enlargedSide === 'front' ? 600 : 400,
              color: enlargedSide === 'front' ? '#0069cc' : '#6b7280',
              backgroundColor: enlargedSide === 'front' ? '#e6f0fa' : 'transparent',
              border: enlargedSide === 'front' ? '1px solid #0069cc' : '1px solid #d1d5db',
              borderRadius: '0.375rem 0 0 0.375rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
            }}
            aria-label="View front of card"
            aria-pressed={enlargedSide === 'front'}
          >
            Front
          </button>
          <button
            type="button"
            onClick={() => setEnlargedSide('back')}
            style={{
              padding: '0.375rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: enlargedSide === 'back' ? 600 : 400,
              color: enlargedSide === 'back' ? '#0069cc' : '#6b7280',
              backgroundColor: enlargedSide === 'back' ? '#e6f0fa' : 'transparent',
              border: enlargedSide === 'back' ? '1px solid #0069cc' : '1px solid #d1d5db',
              borderRadius: '0 0.375rem 0.375rem 0',
              cursor: 'pointer',
              transition: 'all 0.15s ease-in-out',
              marginLeft: '-1px',
            }}
            aria-label="View back of card"
            aria-pressed={enlargedSide === 'back'}
          >
            Back
          </button>
        </div>

        {/* Enlarged card */}
        {enlargedSide === 'front' ? renderCardFront(true) : renderCardBack(true)}
      </div>
    );
  };

  /**
   * Renders the enlarged modal footer.
   * @returns {React.ReactElement} The modal footer content
   */
  const renderEnlargedModalFooter = () => {
    return (
      <>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleEnlargedFlip}
          ariaLabel={enlargedSide === 'front' ? 'Flip to back of card' : 'Flip to front of card'}
          iconLeft={
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
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
          }
        >
          Flip Card
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCloseEnlarged}
          ariaLabel="Close enlarged view"
        >
          Close
        </Button>
      </>
    );
  };

  return (
    <>
      <div
        id={id || 'id-card-preview'}
        className={containerClassName || undefined}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Card header with coverage type and status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
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
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '0.5rem',
                backgroundColor: '#e6f0fa',
                color: '#0069cc',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {getCoverageIcon(card.coverageType)}
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.3,
                }}
              >
                {card.coverageTypeLabel || front.planName || 'ID Card'}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                {front.planName || ''}
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {card.isActive !== undefined && (
              <Badge
                variant={card.isActive ? 'success' : 'neutral'}
                size="sm"
                dot
              >
                {card.statusLabel || (card.isActive ? 'Active' : 'Inactive')}
              </Badge>
            )}
          </div>
        </div>

        {/* Card preview area */}
        <div
          style={{
            position: 'relative',
          }}
        >
          {/* Card content with flip */}
          <div
            style={{
              perspective: '1000px',
            }}
          >
            <div
              style={{
                position: 'relative',
                transition: 'transform 0.6s ease-in-out',
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  display: isFlipped ? 'none' : 'block',
                }}
                aria-hidden={isFlipped}
              >
                {renderCardFront(false)}
              </div>

              {/* Back */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  display: isFlipped ? 'block' : 'none',
                }}
                aria-hidden={!isFlipped}
              >
                {renderCardBack(false)}
              </div>
            </div>
          </div>

          {/* Side indicator label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '0.5rem',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              aria-live="polite"
            >
              {isFlipped ? 'Back' : 'Front'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Left actions: flip and enlarge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={handleFlip}
              aria-label={isFlipped ? 'Flip to front of card' : 'Flip to back of card'}
              style={{
                padding: '0.25rem 0.625rem',
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
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Flip Card
            </button>

            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={handleEnlarge}
              aria-label="Enlarge ID card view"
              style={{
                padding: '0.25rem 0.625rem',
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
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              Enlarge
            </button>
          </div>

          {/* Right actions: download, print, request */}
          {showActions && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              {onDownload && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  ariaLabel="Download ID card as PDF"
                  iconLeft={
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
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  }
                >
                  Download
                </Button>
              )}

              {onPrint && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePrint}
                  ariaLabel="Print ID card"
                  iconLeft={
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
                    >
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                  }
                >
                  Print
                </Button>
              )}

              {onRequestNew && (
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={handleRequestNew}
                  ariaLabel="Request a new ID card"
                >
                  Request New
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enlarged Modal */}
      <Modal
        isOpen={isEnlarged}
        onClose={handleCloseEnlarged}
        title={`${card.coverageTypeLabel || front.planName || 'ID Card'} — ${enlargedSide === 'front' ? 'Front' : 'Back'}`}
        size="lg"
        body={renderEnlargedModalBody()}
        footer={renderEnlargedModalFooter()}
        showCloseButton={true}
        closeOnOverlayClick={true}
        closeOnEscape={true}
        id={id ? `${id}-enlarged-modal` : 'id-card-preview-enlarged-modal'}
        centered={true}
      />
    </>
  );
};

IDCardPreview.propTypes = {
  card: PropTypes.shape({
    cardId: PropTypes.string,
    memberId: PropTypes.string,
    coverageId: PropTypes.string,
    coverageType: PropTypes.string,
    coverageTypeLabel: PropTypes.string,
    cardType: PropTypes.string,
    issueDate: PropTypes.string,
    expirationDate: PropTypes.string,
    isActive: PropTypes.bool,
    isExpired: PropTypes.bool,
    statusLabel: PropTypes.string,
    front: PropTypes.shape({
      planName: PropTypes.string,
      planType: PropTypes.string,
      memberName: PropTypes.string,
      memberId: PropTypes.string,
      groupNumber: PropTypes.string,
      subscriberId: PropTypes.string,
      effectiveDate: PropTypes.string,
      pcpName: PropTypes.string,
      pcpPhone: PropTypes.string,
      networkName: PropTypes.string,
      copays: PropTypes.shape({
        primaryCare: PropTypes.string,
        specialist: PropTypes.string,
        urgentCare: PropTypes.string,
        emergencyRoom: PropTypes.string,
      }),
    }),
    back: PropTypes.shape({
      rxInfo: PropTypes.shape({
        rxBIN: PropTypes.string,
        rxPCN: PropTypes.string,
        rxGroup: PropTypes.string,
      }),
      claimsAddress: PropTypes.string,
      claimsPhone: PropTypes.string,
      memberServicesPhone: PropTypes.string,
      nurseLinePhone: PropTypes.string,
      mentalHealthPhone: PropTypes.string,
      preAuthPhone: PropTypes.string,
      websiteUrl: PropTypes.string,
      providerDirectoryUrl: PropTypes.string,
      emergencyInstructions: PropTypes.string,
    }),
  }),
  className: PropTypes.string,
  id: PropTypes.string,
  onDownload: PropTypes.func,
  onPrint: PropTypes.func,
  onRequestNew: PropTypes.func,
  showActions: PropTypes.bool,
};

IDCardPreview.defaultProps = {
  card: undefined,
  className: '',
  id: undefined,
  onDownload: undefined,
  onPrint: undefined,
  onRequestNew: undefined,
  showActions: true,
};

export default IDCardPreview;