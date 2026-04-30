import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { HB_CLASSES, ROUTES, EXTERNAL_URLS, SUPPORT } from '../../constants/constants.js';
import LeavingSiteModal from '../ui/LeavingSiteModal.jsx';

/**
 * FindCareCTAWidget component.
 * Dashboard widget displaying a Find Care & Cost call-to-action with prominent
 * navigation buttons to the Get Care section, telemedicine, and external provider
 * finder. Uses HB CSS card and button styling. Includes quick-access links for
 * common care-finding actions and a brief description of available resources.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The Find Care CTA widget element
 */
const FindCareCTAWidget = ({ className, id }) => {
  const navigate = useNavigate();

  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  /**
   * Handles navigation to the Find a Doctor page.
   */
  const handleFindDoctor = useCallback(() => {
    navigate(ROUTES.FIND_DOCTOR);
  }, [navigate]);

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

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Quick action items for the widget.
   * @type {Object[]}
   */
  const quickActions = [
    {
      id: 'find-doctor',
      label: 'Find a Doctor',
      description: 'Search for in-network providers near you',
      icon: 'search',
      action: handleFindDoctor,
      isExternal: false,
    },
    {
      id: 'doctor-finder',
      label: 'National Provider Directory',
      description: 'Browse our full provider network',
      icon: 'globe',
      action: () => handleExternalLink(EXTERNAL_URLS.doctorFinder, 'National Doctor & Hospital Finder', 'provider'),
      isExternal: true,
    },
    {
      id: 'telehealth',
      label: 'Telehealth Visit',
      description: 'See a doctor from home — 24/7',
      icon: 'video',
      action: () => handleExternalLink('https://telehealth.healthcarepayer.com', 'HealthFirst Telehealth', 'tool'),
      isExternal: true,
    },
  ];

  /**
   * Returns an SVG icon element for the given icon identifier.
   * @param {string} iconName - The icon identifier
   * @returns {React.ReactElement} The SVG icon element
   */
  const renderIcon = (iconName) => {
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
      case 'search':
        return (
          <svg {...iconProps}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
      case 'phone':
        return (
          <svg {...iconProps}>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

  return (
    <>
      <div
        id={id || 'find-care-cta-widget'}
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                Get Care
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Find providers, estimate costs & access telehealth
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
          {/* Description */}
          <p
            style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            Search for in-network doctors, specialists, hospitals, and pharmacies. Estimate your costs before your visit and access virtual care from home.
          </p>

          {/* Quick Actions */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            {quickActions.map((action) => (
              <button
                key={action.id}
                type="button"
                onClick={action.action}
                aria-label={action.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
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
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '0.375rem',
                    backgroundColor: '#ffffff',
                    color: '#0069cc',
                    flexShrink: 0,
                    border: '1px solid #e5e7eb',
                  }}
                  aria-hidden="true"
                >
                  {renderIcon(action.icon)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {action.label}
                    </span>
                    {action.isExternal && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                    }}
                  >
                    {action.description}
                  </span>
                </div>
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

          {/* Primary CTA Button */}
          <button
            type="button"
            className={`${HB_CLASSES.btnPrimary} hb-btn-block`}
            onClick={handleFindDoctor}
            aria-label="Find a doctor or provider"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Find a Doctor
          </button>
        </div>

        {/* Footer */}
        <div
          className={HB_CLASSES.cardFooter}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            flexWrap: 'wrap',
            padding: '0.75rem 1.5rem',
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
                href="tel:1-800-555-0150"
                aria-label="Call 24/7 Nurse Line at 1-800-555-0150"
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
                1-800-555-0150
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

      {/* Leaving Site Modal */}
      <LeavingSiteModal
        isOpen={isLeavingSiteOpen}
        onClose={handleCloseLeavingSite}
        url={leavingSiteUrl}
        title={leavingSiteTitle}
        category={leavingSiteCategory}
        id="find-care-cta-leaving-site-modal"
      />
    </>
  );
};

FindCareCTAWidget.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

FindCareCTAWidget.defaultProps = {
  className: '',
  id: undefined,
};

export default FindCareCTAWidget;