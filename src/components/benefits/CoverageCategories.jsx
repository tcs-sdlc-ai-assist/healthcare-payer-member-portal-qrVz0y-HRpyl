import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getBenefitDetails,
  getBenefits,
  getCoverageCategories,
  getPharmacyTiers,
} from '../../services/benefitsService.js';
import { HB_CLASSES, COVERAGE_TYPE_LABELS } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';
import CoverageSelector from '../shared/CoverageSelector.jsx';

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
 * Returns a category icon SVG element.
 * @param {string} category - The category name
 * @returns {React.ReactElement} The SVG icon element
 */
const getCategoryIcon = (category) => {
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

  const lowerCategory = (category || '').toLowerCase();

  if (lowerCategory.includes('preventive')) {
    return (
      <svg {...iconProps}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    );
  }
  if (lowerCategory.includes('primary care')) {
    return (
      <svg {...iconProps}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (lowerCategory.includes('specialist')) {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    );
  }
  if (lowerCategory.includes('urgent')) {
    return (
      <svg {...iconProps}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    );
  }
  if (lowerCategory.includes('emergency')) {
    return (
      <svg {...iconProps}>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    );
  }
  if (lowerCategory.includes('hospital') && lowerCategory.includes('inpatient')) {
    return (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  if (lowerCategory.includes('hospital') && lowerCategory.includes('outpatient')) {
    return (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  if (lowerCategory.includes('lab') || lowerCategory.includes('pathology')) {
    return (
      <svg {...iconProps}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  if (lowerCategory.includes('imaging') || lowerCategory.includes('x-ray') || lowerCategory.includes('mri')) {
    return (
      <svg {...iconProps}>
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
      </svg>
    );
  }
  if (lowerCategory.includes('mental health') || lowerCategory.includes('behavioral') || lowerCategory.includes('counseling')) {
    return (
      <svg {...iconProps}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (lowerCategory.includes('substance')) {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    );
  }
  if (lowerCategory.includes('orthodontia') || lowerCategory.includes('dental')) {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      </svg>
    );
  }
  if (lowerCategory.includes('eye') || lowerCategory.includes('vision') || lowerCategory.includes('contact') || lowerCategory.includes('frame') || lowerCategory.includes('laser')) {
    return (
      <svg {...iconProps}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (lowerCategory.includes('pharmacy') || lowerCategory.includes('prescription') || lowerCategory.includes('medication') || lowerCategory.includes('retail') || lowerCategory.includes('mail order') || lowerCategory.includes('specialty')) {
    return (
      <svg {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    );
  }
  if (lowerCategory.includes('crisis')) {
    return (
      <svg {...iconProps}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (lowerCategory.includes('psychiatric')) {
    return (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  if (lowerCategory.includes('telehealth') || lowerCategory.includes('virtual')) {
    return (
      <svg {...iconProps}>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    );
  }

  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
};

/**
 * AccordionItem component.
 * Renders a single expandable/collapsible coverage category section.
 *
 * @param {Object} props
 * @param {Object} props.category - The coverage category object
 * @param {boolean} props.isExpanded - Whether the section is expanded
 * @param {Function} props.onToggle - Callback to toggle expansion
 * @param {number} props.index - The index of this item
 * @param {string} props.idPrefix - ID prefix for accessibility
 * @returns {React.ReactElement} The accordion item element
 */
const AccordionItem = ({ category, isExpanded, onToggle, index, idPrefix }) => {
  const headerId = `${idPrefix}-header-${index}`;
  const panelId = `${idPrefix}-panel-${index}`;

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Accordion Header */}
      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onToggle(index)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: isExpanded ? '#f9fafb' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.15s ease-in-out',
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flex: 1,
            minWidth: 0,
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
              backgroundColor: isExpanded ? '#e6f0fa' : '#f3f4f6',
              color: isExpanded ? '#0069cc' : '#6b7280',
              flexShrink: 0,
              transition: 'all 0.15s ease-in-out',
            }}
            aria-hidden="true"
          >
            {getCategoryIcon(category.category)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              {category.category}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {category.description}
            </span>
          </div>
        </div>

        {/* In-network copay badge */}
        {category.inNetworkCopay && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'none',
            }}
            className="tablet:hb-inline-flex"
            aria-hidden="true"
          >
            {category.inNetworkCopay}
          </span>
        )}

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Accordion Panel */}
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          style={{
            padding: '0 1rem 1rem 1rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              paddingTop: '0.75rem',
            }}
          >
            {/* Description */}
            <p
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                color: '#374151',
                lineHeight: 1.5,
              }}
            >
              {category.description}
            </p>

            {/* Cost Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {/* In-Network Copay */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #a7f3d0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#065f46',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  In-Network Copay
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#065f46',
                    lineHeight: 1.2,
                  }}
                >
                  {category.inNetworkCopay || 'N/A'}
                </span>
              </div>

              {/* Out-of-Network Copay */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #fde68a',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#92400e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Out-of-Network
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#92400e',
                    lineHeight: 1.2,
                  }}
                >
                  {category.outOfNetworkCopay || 'N/A'}
                </span>
              </div>

              {/* Coinsurance */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bfdbfe',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#1e40af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Coinsurance
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1e40af',
                    lineHeight: 1.2,
                  }}
                >
                  {category.coinsurance || 'N/A'}
                </span>
              </div>
            </div>

            {/* Notes */}
            {category.notes && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bfdbfe',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#1e40af',
                    lineHeight: 1.5,
                  }}
                >
                  {category.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AccordionItem.propTypes = {
  category: PropTypes.shape({
    category: PropTypes.string,
    description: PropTypes.string,
    inNetworkCopay: PropTypes.string,
    outOfNetworkCopay: PropTypes.string,
    coinsurance: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  idPrefix: PropTypes.string.isRequired,
};

/**
 * PharmacyTierItem component.
 * Renders a single expandable/collapsible pharmacy tier section.
 *
 * @param {Object} props
 * @param {Object} props.tier - The pharmacy tier object
 * @param {boolean} props.isExpanded - Whether the section is expanded
 * @param {Function} props.onToggle - Callback to toggle expansion
 * @param {number} props.index - The index of this item
 * @param {string} props.idPrefix - ID prefix for accessibility
 * @returns {React.ReactElement} The pharmacy tier item element
 */
const PharmacyTierItem = ({ tier, isExpanded, onToggle, index, idPrefix }) => {
  const headerId = `${idPrefix}-rx-header-${index}`;
  const panelId = `${idPrefix}-rx-panel-${index}`;

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Tier Header */}
      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onToggle(index)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: isExpanded ? '#f9fafb' : '#ffffff',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'background-color 0.15s ease-in-out',
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.backgroundColor = '#ffffff';
          }
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            flex: 1,
            minWidth: 0,
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
              backgroundColor: isExpanded ? '#e6f0fa' : '#f3f4f6',
              color: isExpanded ? '#0069cc' : '#6b7280',
              flexShrink: 0,
              transition: 'all 0.15s ease-in-out',
            }}
            aria-hidden="true"
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
              style={{ flexShrink: 0 }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              {tier.tier}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              {tier.description}
            </span>
          </div>
        </div>

        {/* Retail copay badge */}
        {tier.retailCopay && (
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              display: 'none',
            }}
            className="tablet:hb-inline-flex"
            aria-hidden="true"
          >
            {tier.retailCopay}
          </span>
        )}

        {/* Chevron */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease-in-out',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Tier Panel */}
      {isExpanded && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          style={{
            padding: '0 1rem 1rem 1rem',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              paddingTop: '0.75rem',
            }}
          >
            {/* Cost Details Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {/* Retail Copay (30-day) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #a7f3d0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#065f46',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Retail (30-day)
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#065f46',
                    lineHeight: 1.2,
                  }}
                >
                  {tier.retailCopay || 'N/A'}
                </span>
              </div>

              {/* Mail Order Copay (90-day) */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bfdbfe',
                }}
              >
                <span
                  style={{
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    color: '#1e40af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Mail Order (90-day)
                </span>
                <span
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#1e40af',
                    lineHeight: 1.2,
                  }}
                >
                  {tier.mailOrderCopay || 'N/A'}
                </span>
              </div>

              {/* Deductible Applies */}
              {tier.deductibleApplies !== undefined && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    padding: '0.75rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.375rem',
                    border: tier.deductibleApplies ? '1px solid #fde68a' : '1px solid #a7f3d0',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: tier.deductibleApplies ? '#92400e' : '#065f46',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: 1.4,
                    }}
                  >
                    Deductible
                  </span>
                  <span
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: tier.deductibleApplies ? '#92400e' : '#065f46',
                      lineHeight: 1.2,
                    }}
                  >
                    {tier.deductibleApplies ? 'Applies' : 'Waived'}
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            {tier.notes && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '0.375rem',
                  border: '1px solid #bfdbfe',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0, marginTop: '2px' }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#1e40af',
                    lineHeight: 1.5,
                  }}
                >
                  {tier.notes}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

PharmacyTierItem.propTypes = {
  tier: PropTypes.shape({
    tier: PropTypes.string,
    description: PropTypes.string,
    retailCopay: PropTypes.string,
    mailOrderCopay: PropTypes.string,
    deductibleApplies: PropTypes.bool,
    notes: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  idPrefix: PropTypes.string.isRequired,
};

/**
 * CoverageCategories component.
 * Coverage category details component displaying copay/coinsurance information
 * for each benefit category (preventive care, specialist, emergency, hospital,
 * lab, imaging, mental health, pharmacy tiers). Uses expandable/collapsible
 * sections with HB CSS accordion-style layout. Shows in-network and
 * out-of-network costs. Includes coverage type selector for switching
 * between plans.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.defaultCoverageType] - Default coverage type to display
 * @param {string} [props.benefitId] - Specific benefit ID to display (overrides coverage type selector)
 * @param {boolean} [props.showCoverageSelector=true] - Whether to show the coverage type selector
 * @param {boolean} [props.expandFirstItem=true] - Whether to expand the first category item by default
 * @returns {React.ReactElement} The coverage categories element
 */
const CoverageCategories = ({ className, id, defaultCoverageType, benefitId, showCoverageSelector, expandFirstItem }) => {
  const { user } = useAuth();
  const { tagBenefitsViewed } = useGlassbox();

  const [benefits, setBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [coverageCategories, setCoverageCategories] = useState([]);
  const [pharmacyTiers, setPharmacyTiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoverageType, setSelectedCoverageType] = useState(defaultCoverageType || '');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedTiers, setExpandedTiers] = useState({});

  /**
   * Fetches benefits data for the current member.
   */
  const fetchBenefitsData = useCallback(() => {
    if (!user || !user.memberId) {
      setBenefits([]);
      setSelectedBenefit(null);
      setCoverageCategories([]);
      setPharmacyTiers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (benefitId) {
        const detail = getBenefitDetails(benefitId, {
          memberId: user.memberId,
          logView: true,
        });

        if (!detail) {
          setError('Benefit not found.');
          setSelectedBenefit(null);
          setCoverageCategories([]);
          setPharmacyTiers([]);
        } else {
          setSelectedBenefit(detail);
          setBenefits([detail]);

          const categories = getCoverageCategories(benefitId);
          setCoverageCategories(categories);

          const tiers = getPharmacyTiers(benefitId);
          setPharmacyTiers(tiers);

          if (expandFirstItem && categories.length > 0) {
            setExpandedCategories({ 0: true });
          }

          tagBenefitsViewed({
            coverageType: detail.coverageType,
            planName: detail.planName,
          });
        }
      } else {
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
          setSelectedBenefit(null);
          setCoverageCategories([]);
          setPharmacyTiers([]);
        } else {
          const benefitsList = result.benefits || [];
          setBenefits(benefitsList);

          if (benefitsList.length > 0) {
            const firstBenefit = benefitsList[0];
            setSelectedBenefit(firstBenefit);

            const categories = getCoverageCategories(firstBenefit.benefitId);
            setCoverageCategories(categories);

            const tiers = getPharmacyTiers(firstBenefit.benefitId);
            setPharmacyTiers(tiers);

            if (expandFirstItem && categories.length > 0) {
              setExpandedCategories({ 0: true });
            } else {
              setExpandedCategories({});
            }
            setExpandedTiers({});

            tagBenefitsViewed({
              coverageType: firstBenefit.coverageType || 'ALL',
              planName: firstBenefit.planName || null,
            });
          } else {
            setSelectedBenefit(null);
            setCoverageCategories([]);
            setPharmacyTiers([]);
          }
        }
      }
    } catch (err) {
      console.error('[CoverageCategories] Error fetching benefits data:', err);
      setError('Unable to load coverage information. Please try again.');
      setBenefits([]);
      setSelectedBenefit(null);
      setCoverageCategories([]);
      setPharmacyTiers([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, benefitId, selectedCoverageType, expandFirstItem, tagBenefitsViewed]);

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
    setExpandedCategories({});
    setExpandedTiers({});
  }, []);

  /**
   * Handles selecting a specific benefit from the list.
   * @param {Object} benefit - The benefit to select
   */
  const handleBenefitSelect = useCallback((benefit) => {
    if (!benefit || !benefit.benefitId) {
      return;
    }

    setSelectedBenefit(benefit);

    const categories = getCoverageCategories(benefit.benefitId);
    setCoverageCategories(categories);

    const tiers = getPharmacyTiers(benefit.benefitId);
    setPharmacyTiers(tiers);

    if (expandFirstItem && categories.length > 0) {
      setExpandedCategories({ 0: true });
    } else {
      setExpandedCategories({});
    }
    setExpandedTiers({});
  }, [expandFirstItem]);

  /**
   * Toggles a coverage category accordion item.
   * @param {number} index - The index of the category to toggle
   */
  const handleToggleCategory = useCallback((index) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  /**
   * Toggles a pharmacy tier accordion item.
   * @param {number} index - The index of the tier to toggle
   */
  const handleToggleTier = useCallback((index) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  /**
   * Expands all coverage category items.
   */
  const handleExpandAll = useCallback(() => {
    const allExpanded = {};
    coverageCategories.forEach((_, index) => {
      allExpanded[index] = true;
    });
    setExpandedCategories(allExpanded);

    const allTiersExpanded = {};
    pharmacyTiers.forEach((_, index) => {
      allTiersExpanded[index] = true;
    });
    setExpandedTiers(allTiersExpanded);
  }, [coverageCategories, pharmacyTiers]);

  /**
   * Collapses all coverage category items.
   */
  const handleCollapseAll = useCallback(() => {
    setExpandedCategories({});
    setExpandedTiers({});
  }, []);

  const hasExpandedItems = Object.values(expandedCategories).some(Boolean) || Object.values(expandedTiers).some(Boolean);
  const totalItems = coverageCategories.length + pharmacyTiers.length;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const idPrefix = id || 'coverage-categories';

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
        }}
        role="status"
        aria-label="Loading coverage categories"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #f3f4f6',
            }}
          >
            <div
              style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.375rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div
                style={{
                  width: '60%',
                  height: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '80%',
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
      <Alert
        variant="error"
        title="Error Loading Coverage Details"
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
          aria-label="Retry loading coverage details"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no coverage categories are found.
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
            No coverage details found
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
              ? 'No coverage categories are available for the selected coverage type. Try selecting a different coverage type.'
              : 'No active coverage categories are available for your plan.'}
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
   * Renders the benefit plan tabs when multiple benefits are available.
   * @returns {React.ReactElement|null} Plan tabs or null
   */
  const renderPlanTabs = () => {
    if (benefitId || benefits.length <= 1) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          flexWrap: 'wrap',
          marginBottom: '1rem',
        }}
        role="tablist"
        aria-label="Select a coverage plan"
      >
        {benefits.map((benefit) => {
          const isSelected = selectedBenefit && selectedBenefit.benefitId === benefit.benefitId;

          return (
            <button
              key={benefit.benefitId}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleBenefitSelect(benefit)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? '#0069cc' : '#6b7280',
                backgroundColor: isSelected ? '#e6f0fa' : 'transparent',
                border: isSelected ? '1px solid #0069cc' : '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease-in-out',
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: isSelected ? '#0069cc' : '#9ca3af',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {getCoverageIcon(benefit.coverageType)}
              </span>
              {benefit.coverageTypeLabel || benefit.planName || 'Coverage'}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * Renders the coverage categories content.
   * @returns {React.ReactElement} Coverage categories content
   */
  const renderContent = () => {
    const hasCategories = coverageCategories.length > 0;
    const hasTiers = pharmacyTiers.length > 0;

    if (!hasCategories && !hasTiers) {
      return renderEmpty();
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Plan Tabs */}
        {renderPlanTabs()}

        {/* Selected Plan Info */}
        {selectedBenefit && (
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
                {getCoverageIcon(selectedBenefit.coverageType)}
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
                  {selectedBenefit.coverageTypeLabel || selectedBenefit.planName || 'Coverage Details'}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {selectedBenefit.planName || ''} {selectedBenefit.planType ? `(${selectedBenefit.planType})` : ''}
                </p>
              </div>
            </div>

            {/* Expand/Collapse All */}
            {totalItems > 1 && (
              <button
                type="button"
                className={HB_CLASSES.btnTertiary}
                onClick={hasExpandedItems ? handleCollapseAll : handleExpandAll}
                aria-label={hasExpandedItems ? 'Collapse all sections' : 'Expand all sections'}
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
                  {hasExpandedItems ? (
                    <>
                      <polyline points="18 15 12 9 6 15" />
                    </>
                  ) : (
                    <>
                      <polyline points="6 9 12 15 18 9" />
                    </>
                  )}
                </svg>
                {hasExpandedItems ? 'Collapse All' : 'Expand All'}
              </button>
            )}
          </div>
        )}

        {/* Coverage Categories Accordion */}
        {hasCategories && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Coverage Categories
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
              role="list"
              aria-label="Coverage categories"
            >
              {coverageCategories.map((category, index) => (
                <div key={`${category.category}-${index}`} role="listitem">
                  <AccordionItem
                    category={category}
                    isExpanded={!!expandedCategories[index]}
                    onToggle={handleToggleCategory}
                    index={index}
                    idPrefix={idPrefix}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pharmacy Tiers Accordion */}
        {hasTiers && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Pharmacy Tiers
            </h4>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
              role="list"
              aria-label="Pharmacy tiers"
            >
              {pharmacyTiers.map((tier, index) => (
                <div key={`${tier.tier}-${index}`} role="listitem">
                  <PharmacyTierItem
                    tier={tier}
                    isExpanded={!!expandedTiers[index]}
                    onToggle={handleToggleTier}
                    index={index}
                    idPrefix={idPrefix}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan Notes */}
        {selectedBenefit && selectedBenefit.notes && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.375rem',
              border: '1px solid #fde68a',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: '2px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#92400e',
                  marginBottom: '0.125rem',
                }}
              >
                Plan Notes
              </span>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: '#92400e',
                  lineHeight: 1.5,
                }}
              >
                {selectedBenefit.notes}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id={id || 'coverage-categories'}
      className={containerClassName || undefined}
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
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
            }}
          >
            Coverage Details
          </h2>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            View copays, coinsurance, and coverage details for each service category.
          </p>
        </div>

        {/* Category count badge */}
        {!isLoading && !error && coverageCategories.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="brand" size="sm">
              {coverageCategories.length} {coverageCategories.length === 1 ? 'category' : 'categories'}
            </Badge>
            {pharmacyTiers.length > 0 && (
              <Badge variant="info" size="sm">
                {pharmacyTiers.length} pharmacy {pharmacyTiers.length === 1 ? 'tier' : 'tiers'}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Coverage Type Filter */}
      {showCoverageSelector && !benefitId && (
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
            id={`${idPrefix}-coverage-filter`}
            ariaLabel="Filter coverage categories by coverage type"
          />
        </div>
      )}

      {/* Main Content Card */}
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
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
                Copays & Coinsurance
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                In-network and out-of-network cost details
              </p>
            </div>
          </div>
        </div>

        <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
          {isLoading && renderLoading()}
          {!isLoading && error && renderError()}
          {!isLoading && !error && renderContent()}
        </div>

        {!isLoading && !error && (coverageCategories.length > 0 || pharmacyTiers.length > 0) && (
          <div
            className={HB_CLASSES.cardFooter}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              Costs shown are estimates. Actual costs may vary based on services rendered.
            </span>

            {selectedBenefit && (
              <span
                style={{
                  fontSize: '0.6875rem',
                  color: '#9ca3af',
                  lineHeight: 1.4,
                }}
              >
                {selectedBenefit.coverageTypeLabel || ''} • {selectedBenefit.planType || ''}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CoverageCategories.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  defaultCoverageType: PropTypes.string,
  benefitId: PropTypes.string,
  showCoverageSelector: PropTypes.bool,
  expandFirstItem: PropTypes.bool,
};

CoverageCategories.defaultProps = {
  className: '',
  id: undefined,
  defaultCoverageType: undefined,
  benefitId: undefined,
  showCoverageSelector: true,
  expandFirstItem: true,
};

export default CoverageCategories;