import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getBehavioralHealthResources,
  getBehavioralHealthResourcesByType,
  getFAQsByCategory,
  getNurseLineInfo,
} from '../../data/getCareData.js';
import { HB_CLASSES, EXTERNAL_URLS } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Alert from '../ui/Alert.jsx';
import Button from '../ui/Button.jsx';
import LeavingSiteModal from '../ui/LeavingSiteModal.jsx';

/**
 * Returns an SVG icon element for the given icon identifier.
 * @param {string} iconName - The icon identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getIcon = (iconName) => {
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

  switch (iconName) {
    case 'heart':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'video':
      return (
        <svg {...iconProps}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'map-pin':
      return (
        <svg {...iconProps}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'users':
      return (
        <svg {...iconProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'message-circle':
      return (
        <svg {...iconProps}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'alert-circle':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'info':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'globe':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

/**
 * Returns the Badge variant for a behavioral health resource type.
 * @param {string} type - The resource type string
 * @returns {string} The Badge variant
 */
const getResourceBadgeVariant = (type) => {
  switch (type) {
    case 'crisis':
      return 'error';
    case 'therapy':
      return 'brand';
    case 'substance':
      return 'warning';
    case 'general':
      return 'info';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for a resource type.
 * @param {string} type - The resource type string
 * @returns {string} The human-readable label
 */
const getResourceTypeLabel = (type) => {
  switch (type) {
    case 'crisis':
      return 'Crisis';
    case 'therapy':
      return 'Therapy';
    case 'substance':
      return 'Substance Abuse';
    case 'general':
      return 'General';
    default:
      return 'Resource';
  }
};

/**
 * BehavioralHealthSection component.
 * Behavioral Health subsection component displaying content-managed guidance,
 * FAQs in expandable accordion format, and resource links for crisis support,
 * therapy, substance abuse treatment, and general behavioral health services.
 * Uses HB CSS card and typography classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.showResources=true] - Whether to show the behavioral health resources section
 * @param {boolean} [props.showCrisisResources=true] - Whether to show crisis-specific resources prominently
 * @param {boolean} [props.showFAQs=true] - Whether to show the FAQ accordion section
 * @param {boolean} [props.showNurseLine=true] - Whether to show the nurse line banner
 * @param {boolean} [props.expandFirstFAQ=false] - Whether to expand the first FAQ item by default
 * @returns {React.ReactElement} The behavioral health section element
 */
const BehavioralHealthSection = ({ className, id, showResources, showCrisisResources, showFAQs, showNurseLine, expandFirstFAQ }) => {
  const { tagExternalLinkClicked } = useGlassbox();

  const [expandedFAQ, setExpandedFAQ] = useState(expandFirstFAQ ? 0 : null);
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');
  const [activeResourceFilter, setActiveResourceFilter] = useState('all');

  const allResources = getBehavioralHealthResources();
  const crisisResources = getBehavioralHealthResourcesByType('crisis');
  const behavioralHealthFAQs = getFAQsByCategory('behavioralHealth');
  const nurseLineInfo = getNurseLineInfo();

  /**
   * Returns filtered resources based on the active filter.
   * @returns {Object[]} Filtered resources
   */
  const filteredResources = activeResourceFilter === 'all'
    ? allResources
    : allResources.filter((resource) => resource.type === activeResourceFilter);

  /**
   * Handles opening an external link via the leaving site modal.
   * @param {string} url - The external URL
   * @param {string} title - The link title
   * @param {string} category - The link category
   */
  const handleExternalLink = useCallback((url, title, category) => {
    setLeavingSiteUrl(url);
    setLeavingSiteTitle(title);
    setLeavingSiteCategory(category);
    setIsLeavingSiteOpen(true);
  }, []);

  /**
   * Closes the leaving site modal.
   */
  const handleCloseLeavingSite = useCallback(() => {
    setIsLeavingSiteOpen(false);
    setLeavingSiteUrl('');
    setLeavingSiteTitle('');
    setLeavingSiteCategory('');
  }, []);

  /**
   * Handles FAQ toggle.
   * @param {number} index - The FAQ index
   */
  const handleToggleFAQ = useCallback((index) => {
    setExpandedFAQ((prev) => (prev === index ? null : index));
  }, []);

  /**
   * Expands all FAQ items.
   */
  const handleExpandAllFAQs = useCallback(() => {
    setExpandedFAQ('all');
  }, []);

  /**
   * Collapses all FAQ items.
   */
  const handleCollapseAllFAQs = useCallback(() => {
    setExpandedFAQ(null);
  }, []);

  /**
   * Checks if a FAQ item is expanded.
   * @param {number} index - The FAQ index
   * @returns {boolean} Whether the FAQ item is expanded
   */
  const isFAQExpanded = (index) => {
    if (expandedFAQ === 'all') {
      return true;
    }
    return expandedFAQ === index;
  };

  const hasExpandedFAQs = expandedFAQ !== null;

  /**
   * Handles resource type filter change.
   * @param {string} type - The resource type to filter by
   */
  const handleResourceFilterChange = useCallback((type) => {
    setActiveResourceFilter(type);
  }, []);

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const idPrefix = id || 'behavioral-health-section';

  /**
   * Resource type filter options.
   * @type {Object[]}
   */
  const resourceFilterOptions = [
    { id: 'all', label: 'All Resources' },
    { id: 'crisis', label: 'Crisis' },
    { id: 'therapy', label: 'Therapy' },
    { id: 'substance', label: 'Substance Abuse' },
    { id: 'general', label: 'General' },
  ];

  /**
   * Renders the crisis resources banner section.
   * @returns {React.ReactElement} Crisis resources banner
   */
  const renderCrisisResources = () => {
    if (!crisisResources || crisisResources.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: '#fef2f2',
            borderRadius: '0.5rem',
            border: '2px solid #fecaca',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              marginBottom: '0.75rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                borderRadius: '9999px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {getIcon('alert-circle')}
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  color: '#991b1b',
                  lineHeight: 1.3,
                }}
              >
                If You Are in Crisis
              </h3>
              <p
                style={{
                  margin: '0.125rem 0 0 0',
                  fontSize: '0.8125rem',
                  color: '#991b1b',
                  lineHeight: 1.4,
                }}
              >
                Help is available 24/7. You are not alone.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {crisisResources.map((resource) => (
              <div
                key={resource.resourceId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#ffffff',
                  borderRadius: '0.375rem',
                  border: '1px solid #fecaca',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
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
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {getIcon(resource.icon)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#991b1b',
                        lineHeight: 1.3,
                      }}
                    >
                      {resource.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#991b1b',
                        lineHeight: 1.4,
                        opacity: 0.8,
                      }}
                    >
                      {resource.availability}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  <a
                    href={resource.phone.startsWith('Text') ? undefined : `tel:${resource.phone}`}
                    aria-label={`Contact ${resource.title} at ${resource.phone}`}
                    className={HB_CLASSES.btnPrimary}
                    style={{
                      padding: '0.375rem 1rem',
                      fontSize: '0.875rem',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: '#ef4444',
                      borderColor: '#ef4444',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.borderColor = '#ef4444';
                    }}
                  >
                    {resource.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: '0.75rem 0 0 0',
              fontSize: '0.75rem',
              color: '#991b1b',
              lineHeight: 1.5,
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            For life-threatening emergencies, call 911 immediately.
          </p>
        </div>
      </div>
    );
  };

  /**
   * Renders the behavioral health resources section.
   * @returns {React.ReactElement} Resources section
   */
  const renderResources = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            Behavioral Health Resources
          </h3>
        </div>

        {/* Resource type filter tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap',
          }}
          role="tablist"
          aria-label="Filter resources by type"
        >
          {resourceFilterOptions.map((option) => {
            const isActive = activeResourceFilter === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleResourceFilterChange(option.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.375rem 0.75rem',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#0069cc' : '#6b7280',
                  backgroundColor: isActive ? '#e6f0fa' : 'transparent',
                  border: isActive ? '1px solid #0069cc' : '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Resource cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {filteredResources.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '2rem 1rem',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.5,
                }}
              >
                No resources found for the selected filter.
              </p>
              <button
                type="button"
                className={HB_CLASSES.btnSecondary}
                onClick={() => handleResourceFilterChange('all')}
                aria-label="Show all resources"
                style={{
                  padding: '0.375rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                Show All Resources
              </button>
            </div>
          ) : (
            filteredResources.map((resource) => (
              <div
                key={resource.resourceId}
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
                    {/* Resource header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
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
                            backgroundColor: resource.type === 'crisis' ? '#fef2f2' : '#e6f0fa',
                            color: resource.type === 'crisis' ? '#ef4444' : '#0069cc',
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          {getIcon(resource.icon)}
                        </div>
                        <div>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: '0.9375rem',
                              fontWeight: 600,
                              color: '#111827',
                              lineHeight: 1.3,
                            }}
                          >
                            {resource.title}
                          </h4>
                          <p
                            style={{
                              margin: '0.125rem 0 0 0',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              lineHeight: 1.4,
                            }}
                          >
                            {resource.availability}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getResourceBadgeVariant(resource.type)} size="sm">
                        {getResourceTypeLabel(resource.type)}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.5,
                      }}
                    >
                      {resource.description}
                    </p>

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '0.75rem',
                      }}
                    >
                      {resource.url && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleExternalLink(resource.url, resource.title, 'behavioral-health')}
                          ariaLabel={`Visit ${resource.title}`}
                          iconLeft={getIcon('globe')}
                        >
                          Visit Resource
                        </Button>
                      )}
                      {resource.phone && !resource.phone.startsWith('Text') && (
                        <a
                          href={`tel:${resource.phone}`}
                          aria-label={`Call ${resource.title} at ${resource.phone}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.8125rem',
                            color: '#0069cc',
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'color 0.15s ease-in-out',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#0054a3';
                            e.currentTarget.style.textDecoration = 'underline';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#0069cc';
                            e.currentTarget.style.textDecoration = 'none';
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
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                          {resource.phone}
                        </a>
                      )}
                      {resource.phone && resource.phone.startsWith('Text') && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            fontSize: '0.8125rem',
                            color: '#0069cc',
                            fontWeight: 500,
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
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                          </svg>
                          {resource.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders the nurse line info banner.
   * @returns {React.ReactElement} Nurse line banner
   */
  const renderNurseLineBanner = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#ecfdf5',
          borderRadius: '0.375rem',
          border: '1px solid #a7f3d0',
          flexWrap: 'wrap',
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
            backgroundColor: '#10b981',
            color: '#ffffff',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {getIcon('phone')}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4
            style={{
              margin: 0,
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#065f46',
              lineHeight: 1.3,
            }}
          >
            {nurseLineInfo.title}
          </h4>
          <p
            style={{
              margin: '0.125rem 0 0 0',
              fontSize: '0.75rem',
              color: '#065f46',
              lineHeight: 1.4,
            }}
          >
            {nurseLineInfo.description}
          </p>
        </div>
        <a
          href={`tel:${nurseLineInfo.phone}`}
          aria-label={`Call ${nurseLineInfo.title} at ${nurseLineInfo.phone}`}
          className={HB_CLASSES.btnSecondary}
          style={{
            padding: '0.375rem 1rem',
            fontSize: '0.875rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {nurseLineInfo.phone}
        </a>
      </div>
    );
  };

  /**
   * Renders the FAQ accordion section.
   * @returns {React.ReactElement|null} FAQ section or null
   */
  const renderFAQs = () => {
    if (!behavioralHealthFAQs || behavioralHealthFAQs.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#374151',
              lineHeight: 1.3,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Behavioral Health FAQs
          </h3>

          {behavioralHealthFAQs.length > 1 && (
            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={hasExpandedFAQs ? handleCollapseAllFAQs : handleExpandAllFAQs}
              aria-label={hasExpandedFAQs ? 'Collapse all FAQs' : 'Expand all FAQs'}
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
                {hasExpandedFAQs ? (
                  <polyline points="18 15 12 9 6 15" />
                ) : (
                  <polyline points="6 9 12 15 18 9" />
                )}
              </svg>
              {hasExpandedFAQs ? 'Collapse All' : 'Expand All'}
            </button>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
          role="list"
          aria-label="Behavioral health frequently asked questions"
        >
          {behavioralHealthFAQs.map((faq, index) => {
            const isExpanded = isFAQExpanded(index);
            const headerId = `${idPrefix}-faq-header-${index}`;
            const panelId = `${idPrefix}-faq-panel-${index}`;

            return (
              <div
                key={faq.faqId}
                role="listitem"
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* FAQ Header */}
                <button
                  type="button"
                  id={headerId}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() => handleToggleFAQ(index)}
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
                        width: '1.75rem',
                        height: '1.75rem',
                        borderRadius: '0.375rem',
                        backgroundColor: isExpanded ? '#e6f0fa' : '#f3f4f6',
                        color: isExpanded ? '#0069cc' : '#6b7280',
                        flexShrink: 0,
                        transition: 'all 0.15s ease-in-out',
                      }}
                      aria-hidden="true"
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
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#111827',
                        lineHeight: 1.4,
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {faq.question}
                    </span>
                  </div>

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

                {/* FAQ Panel */}
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
                    <p
                      style={{
                        margin: '0.75rem 0 0 0',
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.6,
                        paddingLeft: '2.375rem',
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        id={id || 'behavioral-health-section'}
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
              Behavioral Health
            </h2>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Access mental health resources, crisis support, therapy options, and substance abuse treatment information.
            </p>
          </div>

          {/* Summary badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="brand" size="sm">
              {allResources.length} resources
            </Badge>
            {behavioralHealthFAQs.length > 0 && (
              <Badge variant="info" size="sm">
                {behavioralHealthFAQs.length} FAQs
              </Badge>
            )}
          </div>
        </div>

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
                {getIcon('heart')}
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
                  Mental Health & Behavioral Health
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Resources, guidance, and frequently asked questions
                </p>
              </div>
            </div>
          </div>

          <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              {/* Info banner */}
              <Alert
                variant="info"
                dismissible={false}
                role="status"
              >
                Behavioral health benefits are provided at parity with medical benefits under your HealthFirst plan. No referral is required for outpatient therapy or psychiatric services. Your copay for in-network visits is $25.
              </Alert>

              {/* Crisis Resources */}
              {showCrisisResources && renderCrisisResources()}

              {/* General description */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#374151',
                    lineHeight: 1.5,
                  }}
                >
                  Your HealthFirst plan includes comprehensive behavioral health coverage for mental health counseling, psychiatric services, substance abuse treatment, and crisis intervention. All services are confidential and protected by federal and state privacy laws.
                </p>

                {/* Key benefits grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '0.75rem',
                      backgroundColor: '#ecfdf5',
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
                      Outpatient Therapy
                    </span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#065f46',
                        lineHeight: 1.2,
                      }}
                    >
                      $25 copay
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#065f46',
                        lineHeight: 1.4,
                      }}
                    >
                      Unlimited visits when medically necessary
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '0.75rem',
                      backgroundColor: '#eff6ff',
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
                      Virtual Therapy
                    </span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#1e40af',
                        lineHeight: 1.2,
                      }}
                    >
                      $25 copay
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#1e40af',
                        lineHeight: 1.4,
                      }}
                    >
                      Same copay as in-person visits
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      padding: '0.75rem',
                      backgroundColor: '#e6f0fa',
                      borderRadius: '0.375rem',
                      border: '1px solid #cce1f5',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 600,
                        color: '#0054a3',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        lineHeight: 1.4,
                      }}
                    >
                      No Referral Required
                    </span>
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0054a3',
                        lineHeight: 1.2,
                      }}
                    >
                      Direct Access
                    </span>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#0054a3',
                        lineHeight: 1.4,
                      }}
                    >
                      See any in-network provider directly
                    </span>
                  </div>
                </div>
              </div>

              {/* Resources Section */}
              {showResources && renderResources()}

              {/* Nurse Line Banner */}
              {showNurseLine && renderNurseLineBanner()}

              {/* FAQ Section */}
              {showFAQs && renderFAQs()}
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
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Behavioral Health Line:{' '}
                <a
                  href="tel:1-800-555-0175"
                  aria-label="Call Behavioral Health Line at 1-800-555-0175"
                  style={{
                    color: '#0069cc',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.15s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0054a3';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#0069cc';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  1-800-555-0175
                </a>
              </span>
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              For emergencies, call 911 | Crisis: call or text 988
            </span>
          </div>
        </div>
      </div>

      {/* Leaving Site Modal */}
      <LeavingSiteModal
        isOpen={isLeavingSiteOpen}
        onClose={handleCloseLeavingSite}
        url={leavingSiteUrl}
        title={leavingSiteTitle}
        category={leavingSiteCategory}
        id={`${idPrefix}-leaving-site-modal`}
      />
    </>
  );
};

BehavioralHealthSection.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  showResources: PropTypes.bool,
  showCrisisResources: PropTypes.bool,
  showFAQs: PropTypes.bool,
  showNurseLine: PropTypes.bool,
  expandFirstFAQ: PropTypes.bool,
};

BehavioralHealthSection.defaultProps = {
  className: '',
  id: undefined,
  showResources: true,
  showCrisisResources: true,
  showFAQs: true,
  showNurseLine: true,
  expandFirstFAQ: false,
};

export default BehavioralHealthSection;