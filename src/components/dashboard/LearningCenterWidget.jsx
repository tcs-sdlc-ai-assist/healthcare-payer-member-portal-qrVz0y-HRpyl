import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { HB_CLASSES, ROUTES, EXTERNAL_URLS } from '../../constants/constants.js';
import LeavingSiteModal from '../ui/LeavingSiteModal.jsx';

/**
 * Featured learning center content items.
 * Static educational resources for the dashboard widget.
 * Contains NO PHI/PII — only general health education content.
 *
 * @type {Object[]}
 */
const LEARNING_CENTER_ITEMS = [
  {
    id: 'lc-001',
    title: 'Understanding Your Explanation of Benefits (EOB)',
    description: 'Learn how to read your EOB document, understand what your plan paid, and what you may owe for services.',
    icon: 'file-text',
    route: ROUTES.DOCUMENTS,
    category: 'benefits',
    isExternal: false,
  },
  {
    id: 'lc-002',
    title: 'Preventive Care: What\'s Covered at No Cost',
    description: 'Discover which preventive screenings, immunizations, and wellness visits are covered at 100% under your plan.',
    icon: 'shield',
    route: ROUTES.COVERAGE,
    category: 'preventive',
    isExternal: false,
  },
  {
    id: 'lc-003',
    title: 'How to Save on Prescription Costs',
    description: 'Tips for reducing your out-of-pocket pharmacy costs, including generics, mail order, and patient assistance programs.',
    icon: 'pill',
    route: ROUTES.COVERAGE,
    category: 'pharmacy',
    isExternal: false,
  },
  {
    id: 'lc-004',
    title: 'When to Use Telehealth vs. Urgent Care vs. ER',
    description: 'Know where to go for care based on your symptoms — and how to avoid unnecessary emergency room costs.',
    icon: 'video',
    route: ROUTES.FIND_DOCTOR,
    category: 'care',
    isExternal: false,
  },
  {
    id: 'lc-005',
    title: 'Mental Health Resources & Support',
    description: 'Access confidential behavioral health services, crisis support, and wellness programs included with your plan.',
    icon: 'heart',
    route: ROUTES.FIND_DOCTOR,
    category: 'behavioral',
    isExternal: false,
  },
];

/**
 * Maximum number of featured items to display in the widget.
 * @type {number}
 */
const MAX_FEATURED_ITEMS = 3;

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
    case 'file-text':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'pill':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
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
    case 'book':
      return (
        <svg {...iconProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
};

/**
 * LearningCenterWidget component.
 * Dashboard widget displaying Learning Center content with health tips,
 * articles, and educational resources. Shows 2-3 featured items with
 * titles and brief descriptions. Uses HB CSS card and link styling.
 * Provides quick access to educational content and health literacy resources.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {number} [props.count=3] - Number of featured items to display (2-3)
 * @returns {React.ReactElement} The learning center widget element
 */
const LearningCenterWidget = ({ className, id, count }) => {
  const navigate = useNavigate();

  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  const itemCount = typeof count === 'number' && count >= 1 && count <= 5
    ? count
    : MAX_FEATURED_ITEMS;

  const featuredItems = LEARNING_CENTER_ITEMS.slice(0, itemCount);

  /**
   * Handles navigation to an internal route.
   * @param {string} route - The route path to navigate to
   */
  const handleNavigate = useCallback((route) => {
    if (route) {
      navigate(route);
    }
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

  /**
   * Handles clicking on a learning center item.
   * @param {Object} item - The learning center item
   */
  const handleItemClick = useCallback((item) => {
    if (item.isExternal && item.externalUrl) {
      handleExternalLink(item.externalUrl, item.title, item.category);
    } else if (item.route) {
      handleNavigate(item.route);
    }
  }, [handleNavigate, handleExternalLink]);

  /**
   * Handles navigation to the full documents/resources page.
   */
  const handleViewAll = useCallback(() => {
    navigate(ROUTES.DOCUMENTS);
  }, [navigate]);

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <>
      <div
        id={id || 'learning-center-widget'}
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
              {renderIcon('book')}
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
                Learning Center
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Health tips & educational resources
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className={HB_CLASSES.cardBody}
          style={{ padding: '0.75rem 1rem' }}
        >
          {/* Description */}
          <p
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem',
              color: '#374151',
              lineHeight: 1.5,
            }}
          >
            Stay informed about your health plan benefits, preventive care options, and ways to save on healthcare costs.
          </p>

          {/* Featured Items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {featuredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                aria-label={item.title}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
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
                {/* Icon */}
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
                    marginTop: '0.0625rem',
                  }}
                  aria-hidden="true"
                >
                  {renderIcon(item.icon)}
                </div>

                {/* Content */}
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
                      }}
                    >
                      {item.title}
                    </span>
                    {item.isExternal && (
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
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.description}
                  </span>
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
                  style={{ flexShrink: 0, marginTop: '0.25rem' }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
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
            onClick={handleViewAll}
            aria-label="View all learning resources"
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.8125rem',
            }}
          >
            View All Resources
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
            }}
          >
            {featuredItems.length} featured {featuredItems.length === 1 ? 'article' : 'articles'}
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
        id="learning-center-leaving-site-modal"
      />
    </>
  );
};

LearningCenterWidget.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  count: PropTypes.number,
};

LearningCenterWidget.defaultProps = {
  className: '',
  id: undefined,
  count: undefined,
};

export default LearningCenterWidget;