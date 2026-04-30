import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getTelemedicineProviders,
  getTelemedicineGuidance,
  getNurseLineInfo,
  getFAQsByCategory,
  getBehavioralHealthResources,
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
    case 'video':
      return (
        <svg {...iconProps}>
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
    case 'phone':
      return (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...iconProps}>
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'x-circle':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
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
 * TelemedicineSection component.
 * Telemedicine subsection component displaying content-managed guidance, FAQs in
 * expandable accordion format, and links to telemedicine resources. Shows when to
 * use telehealth vs. when not to, how to get started steps, available telehealth
 * providers with copay info, and telemedicine FAQs. Uses HB CSS card and typography classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.showProviders=true] - Whether to show the telehealth providers section
 * @param {boolean} [props.showGuidance=true] - Whether to show the when to use / when not to use guidance
 * @param {boolean} [props.showFAQs=true] - Whether to show the FAQ accordion section
 * @param {boolean} [props.showHowToGetStarted=true] - Whether to show the how to get started steps
 * @param {boolean} [props.expandFirstFAQ=false] - Whether to expand the first FAQ item by default
 * @returns {React.ReactElement} The telemedicine section element
 */
const TelemedicineSection = ({ className, id, showProviders, showGuidance, showFAQs, showHowToGetStarted, expandFirstFAQ }) => {
  const { tagExternalLinkClicked } = useGlassbox();

  const [expandedFAQ, setExpandedFAQ] = useState(expandFirstFAQ ? 0 : null);
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  const telemedicineProviders = getTelemedicineProviders();
  const telemedicineGuidance = getTelemedicineGuidance();
  const nurseLineInfo = getNurseLineInfo();
  const telemedicineFAQs = getFAQsByCategory('telemedicine');

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

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const idPrefix = id || 'telemedicine-section';

  /**
   * Renders the telemedicine guidance section (when to use / when not to use).
   * @returns {React.ReactElement} Guidance section
   */
  const renderGuidance = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div>
          <h3
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            {telemedicineGuidance.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.875rem',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            {telemedicineGuidance.description}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {/* When to Use */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '0.375rem',
              border: '1px solid #a7f3d0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#065f46',
                  lineHeight: 1.3,
                }}
              >
                When to Use Telehealth
              </h4>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.25rem',
                listStyleType: 'disc',
              }}
            >
              {telemedicineGuidance.whenToUse.map((item, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#065f46',
                    lineHeight: 1.5,
                    marginBottom: '0.375rem',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* When NOT to Use */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#fef2f2',
              borderRadius: '0.375rem',
              border: '1px solid #fecaca',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h4
                style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#991b1b',
                  lineHeight: 1.3,
                }}
              >
                When NOT to Use Telehealth
              </h4>
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: '1.25rem',
                listStyleType: 'disc',
              }}
            >
              {telemedicineGuidance.whenNotToUse.map((item, index) => (
                <li
                  key={index}
                  style={{
                    fontSize: '0.8125rem',
                    color: '#991b1b',
                    lineHeight: 1.5,
                    marginBottom: '0.375rem',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders the telehealth providers section.
   * @returns {React.ReactElement} Providers section
   */
  const renderProviders = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
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
          Telehealth Services
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {telemedicineProviders.map((provider) => (
            <div
              key={provider.providerId}
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
                  {/* Provider header */}
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
                          backgroundColor: '#e6f0fa',
                          color: '#0069cc',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {getIcon(provider.icon)}
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
                          {provider.name}
                        </h4>
                        <p
                          style={{
                            margin: '0.125rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          {provider.availability}
                        </p>
                      </div>
                    </div>
                    <Badge variant="brand" size="sm">
                      {provider.copay}
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
                    {provider.description}
                  </p>

                  {/* Services offered */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.375rem',
                    }}
                  >
                    {provider.servicesOffered.slice(0, 4).map((service, index) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          padding: '0.125rem 0.5rem',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: '#374151',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {service}
                      </span>
                    ))}
                    {provider.servicesOffered.length > 4 && (
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '0.125rem 0.5rem',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          color: '#6b7280',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        +{provider.servicesOffered.length - 4} more
                      </span>
                    )}
                  </div>

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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExternalLink(provider.url, provider.name, 'tool')}
                      ariaLabel={`Start a ${provider.name} visit`}
                      iconLeft={getIcon(provider.icon)}
                    >
                      Start Visit
                    </Button>
                    <a
                      href={`tel:${provider.phone}`}
                      aria-label={`Call ${provider.name} at ${provider.phone}`}
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
                      {provider.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the how to get started steps section.
   * @returns {React.ReactElement} How to get started section
   */
  const renderHowToGetStarted = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
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
          How to Get Started
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {telemedicineGuidance.howToGetStarted.map((step) => (
            <div
              key={step.step}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.375rem',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.75rem',
                  height: '1.75rem',
                  borderRadius: '9999px',
                  backgroundColor: '#0069cc',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {step.step}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#111827',
                    lineHeight: 1.3,
                    marginBottom: '0.125rem',
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the FAQ accordion section.
   * @returns {React.ReactElement} FAQ section
   */
  const renderFAQs = () => {
    if (!telemedicineFAQs || telemedicineFAQs.length === 0) {
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
            Telehealth FAQs
          </h3>

          {telemedicineFAQs.length > 1 && (
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
          aria-label="Telehealth frequently asked questions"
        >
          {telemedicineFAQs.map((faq, index) => {
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

  return (
    <>
      <div
        id={id || 'telemedicine-section'}
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
              Telehealth Services
            </h2>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Access virtual care from the comfort of your home — 24/7 for many services.
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
              {telemedicineProviders.length} telehealth options
            </Badge>
            {telemedicineFAQs.length > 0 && (
              <Badge variant="info" size="sm">
                {telemedicineFAQs.length} FAQs
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
                {getIcon('video')}
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
                  Telehealth & Virtual Care
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Guidance, providers, and frequently asked questions
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
                Telehealth visits are covered under your HealthFirst plan. Copays vary by visit type — see provider details below for specific costs.
              </Alert>

              {/* Guidance Section */}
              {showGuidance && renderGuidance()}

              {/* Providers Section */}
              {showProviders && renderProviders()}

              {/* How to Get Started Section */}
              {showHowToGetStarted && renderHowToGetStarted()}

              {/* Nurse Line Banner */}
              {renderNurseLineBanner()}

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
                24/7 Nurse Line:{' '}
                <a
                  href={`tel:${nurseLineInfo.phone}`}
                  aria-label={`Call 24/7 Nurse Line at ${nurseLineInfo.phone}`}
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
                  {nurseLineInfo.phone}
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
              For emergencies, call 911
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

TelemedicineSection.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  showProviders: PropTypes.bool,
  showGuidance: PropTypes.bool,
  showFAQs: PropTypes.bool,
  showHowToGetStarted: PropTypes.bool,
  expandFirstFAQ: PropTypes.bool,
};

TelemedicineSection.defaultProps = {
  className: '',
  id: undefined,
  showProviders: true,
  showGuidance: true,
  showFAQs: true,
  showHowToGetStarted: true,
  expandFirstFAQ: false,
};

export default TelemedicineSection;