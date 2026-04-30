import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getFindCareCategories,
  getCostEstimates,
  getTelemedicineProviders,
  getTelemedicineGuidance,
  getNurseLineInfo,
  getExternalLinks,
  getExternalLinksByCategory,
  getFAQsByCategory,
} from '../../data/getCareData.js';
import { HB_CLASSES, ROUTES, EXTERNAL_URLS, SUPPORT } from '../../constants/constants.js';
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
    case 'user':
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'stethoscope':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'building':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
    case 'smile':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'pill':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'flask':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
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
    case 'phone':
      return (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'dollar-sign':
      return (
        <svg {...iconProps}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
    case 'map-pin':
      return (
        <svg {...iconProps}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
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
 * FindCareSection component.
 * Find Care & Cost section component with search/browse interface for care options.
 * Includes external link to National Doctor & Hospital Finder that triggers LeavingSiteModal.
 * Displays find care categories, cost estimates, telemedicine providers, and quick links.
 * Uses HB CSS card and button classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.defaultTab='findCare'] - Default active tab ('findCare', 'costEstimates', 'telemedicine')
 * @returns {React.ReactElement} The find care section element
 */
const FindCareSection = ({ className, id, defaultTab }) => {
  const { user } = useAuth();
  const { tagExternalLinkClicked, tagPageViewed } = useGlassbox();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(defaultTab || 'findCare');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const findCareCategories = getFindCareCategories();
  const costEstimates = getCostEstimates();
  const telemedicineProviders = getTelemedicineProviders();
  const telemedicineGuidance = getTelemedicineGuidance();
  const nurseLineInfo = getNurseLineInfo();
  const externalLinks = getExternalLinks();
  const findCareFAQs = getFAQsByCategory('findCare');
  const costFAQs = getFAQsByCategory('cost');

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
   * Handles tab change.
   * @param {string} tab - The tab identifier
   */
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setSearchQuery('');
  }, []);

  /**
   * Handles search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  /**
   * Handles clearing the search input.
   */
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  /**
   * Handles FAQ toggle.
   * @param {string} faqId - The FAQ identifier
   */
  const handleToggleFAQ = useCallback((faqId) => {
    setExpandedFAQ((prev) => (prev === faqId ? null : faqId));
  }, []);

  /**
   * Handles navigation to the Find a Doctor page.
   */
  const handleFindDoctor = useCallback(() => {
    navigate(ROUTES.FIND_DOCTOR);
  }, [navigate]);

  /**
   * Filters find care categories by search query.
   * @returns {Object[]} Filtered categories
   */
  const filteredCategories = searchQuery.trim().length > 0
    ? findCareCategories.filter((category) => {
        const query = searchQuery.toLowerCase();
        return (
          category.title.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          category.searchHints.some((hint) => hint.toLowerCase().includes(query))
        );
      })
    : findCareCategories;

  /**
   * Filters cost estimates by search query.
   * @returns {Object[]} Filtered cost estimates
   */
  const filteredCostEstimates = searchQuery.trim().length > 0
    ? costEstimates.filter((estimate) => {
        const query = searchQuery.toLowerCase();
        return (
          estimate.serviceType.toLowerCase().includes(query) ||
          estimate.description.toLowerCase().includes(query)
        );
      })
    : costEstimates;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Tab configuration.
   * @type {Object[]}
   */
  const tabs = [
    { id: 'findCare', label: 'Find Care', icon: 'search' },
    { id: 'costEstimates', label: 'Cost Estimates', icon: 'dollar-sign' },
    { id: 'telemedicine', label: 'Telehealth', icon: 'video' },
  ];

  /**
   * Renders the tab navigation.
   * @returns {React.ReactElement} Tab navigation
   */
  const renderTabs = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
        }}
        role="tablist"
        aria-label="Find Care sections"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`findcare-panel-${tab.id}`}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
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
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: isActive ? '#0069cc' : '#9ca3af',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {getIcon(tab.icon)}
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * Renders the search bar for the active tab.
   * @param {string} placeholder - Placeholder text
   * @returns {React.ReactElement} Search bar
   */
  const renderSearchBar = (placeholder) => {
    return (
      <div
        style={{
          position: 'relative',
          marginBottom: '1.5rem',
          maxWidth: '28rem',
        }}
      >
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
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={HB_CLASSES.formInput}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={placeholder}
          autoComplete="off"
          aria-label={placeholder}
          style={{
            paddingLeft: '2.5rem',
            paddingRight: searchQuery.length > 0 ? '2.5rem' : '0.75rem',
            fontSize: '0.875rem',
          }}
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={handleClearSearch}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.5rem',
              height: '1.5rem',
              padding: 0,
              background: 'none',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              color: '#9ca3af',
              transition: 'color 0.15s ease-in-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9ca3af';
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
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  };

  /**
   * Renders the Find Care tab content.
   * @returns {React.ReactElement} Find Care content
   */
  const renderFindCareContent = () => {
    return (
      <div
        id="findcare-panel-findCare"
        role="tabpanel"
        aria-label="Find Care"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Search */}
        {renderSearchBar('Search for a doctor, specialist, facility, or service...')}

        {/* Primary CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#e6f0fa',
            borderRadius: '0.5rem',
            border: '1px solid #cce1f5',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#0069cc',
              color: '#ffffff',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {getIcon('globe')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              National Doctor & Hospital Finder
            </h3>
            <p
              style={{
                margin: '0.125rem 0 0 0',
                fontSize: '0.8125rem',
                color: '#374151',
                lineHeight: 1.4,
              }}
            >
              Search our comprehensive national directory of in-network providers.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExternalLink(EXTERNAL_URLS.doctorFinder, 'National Doctor & Hospital Finder', 'provider')}
            ariaLabel="Open National Doctor & Hospital Finder"
            iconRight={
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
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            }
          >
            Find a Provider
          </Button>
        </div>

        {/* Care Categories Grid */}
        <div>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            Browse by Category
          </h3>

          {filteredCategories.length === 0 ? (
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
                {getIcon('search')}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.5,
                }}
              >
                No categories match &ldquo;{searchQuery}&rdquo;. Try a different search term.
              </p>
              <button
                type="button"
                className={HB_CLASSES.btnSecondary}
                onClick={handleClearSearch}
                aria-label="Clear search"
                style={{
                  padding: '0.375rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {filteredCategories.map((category) => (
                <button
                  key={category.categoryId}
                  type="button"
                  onClick={() => handleExternalLink(category.externalUrl, category.title, 'provider')}
                  aria-label={`Find ${category.title}`}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6f0fa';
                    e.currentTarget.style.borderColor = '#0069cc';
                    e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = '#e6f0fa';
                    e.currentTarget.style.borderColor = '#0069cc';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e5e7eb';
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
                    {getIcon(category.icon)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: '#111827',
                          lineHeight: 1.3,
                        }}
                      >
                        {category.title}
                      </span>
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
                      {category.description}
                    </span>
                    <div
                      style={{
                        marginTop: '0.375rem',
                      }}
                    >
                      <Badge variant="brand" size="sm">
                        {category.coverageTypeLabel}
                      </Badge>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nurse Line */}
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

        {/* Find Care FAQs */}
        {findCareFAQs.length > 0 && (
          <div>
            <h3
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Frequently Asked Questions
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              {findCareFAQs.slice(0, 5).map((faq) => {
                const isExpanded = expandedFAQ === faq.faqId;

                return (
                  <div
                    key={faq.faqId}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-panel-${faq.faqId}`}
                      onClick={() => handleToggleFAQ(faq.faqId)}
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
                    {isExpanded && (
                      <div
                        id={`faq-panel-${faq.faqId}`}
                        role="region"
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
        )}
      </div>
    );
  };

  /**
   * Renders the Cost Estimates tab content.
   * @returns {React.ReactElement} Cost Estimates content
   */
  const renderCostEstimatesContent = () => {
    return (
      <div
        id="findcare-panel-costEstimates"
        role="tabpanel"
        aria-label="Cost Estimates"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Info banner */}
        <Alert
          variant="info"
          dismissible={false}
          role="status"
        >
          Cost estimates are based on your HealthFirst PPO 5000 plan. Actual costs may vary depending on the provider, facility, and services rendered.
        </Alert>

        {/* Search */}
        {renderSearchBar('Search for a service or procedure...')}

        {/* Cost Estimates Table */}
        {filteredCostEstimates.length === 0 ? (
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
              No cost estimates match &ldquo;{searchQuery}&rdquo;. Try a different search term.
            </p>
            <button
              type="button"
              className={HB_CLASSES.btnSecondary}
              onClick={handleClearSearch}
              aria-label="Clear search"
              style={{
                padding: '0.375rem 1rem',
                fontSize: '0.875rem',
              }}
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {filteredCostEstimates.map((estimate) => (
              <div
                key={estimate.estimateId}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {estimate.serviceType}
                    </h4>
                    <p
                      style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                      }}
                    >
                      {estimate.description}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.125rem',
                      padding: '0.625rem 0.75rem',
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
                      In-Network
                    </span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#065f46',
                        lineHeight: 1.2,
                      }}
                    >
                      {estimate.inNetworkRange}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.125rem',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: '#fffbeb',
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
                        fontSize: '0.9375rem',
                        fontWeight: 700,
                        color: '#92400e',
                        lineHeight: 1.2,
                      }}
                    >
                      {estimate.outOfNetworkRange}
                    </span>
                  </div>
                </div>

                {estimate.notes && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.375rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#eff6ff',
                      borderRadius: '0.375rem',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
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
                        fontSize: '0.6875rem',
                        color: '#1e40af',
                        lineHeight: 1.5,
                      }}
                    >
                      {estimate.notes}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cost FAQs */}
        {costFAQs.length > 0 && (
          <div>
            <h3
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Cost FAQs
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.375rem',
              }}
            >
              {costFAQs.slice(0, 4).map((faq) => {
                const isExpanded = expandedFAQ === faq.faqId;

                return (
                  <div
                    key={faq.faqId}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      overflow: 'hidden',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`faq-panel-${faq.faqId}`}
                      onClick={() => handleToggleFAQ(faq.faqId)}
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
                    {isExpanded && (
                      <div
                        id={`faq-panel-${faq.faqId}`}
                        role="region"
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
        )}
      </div>
    );
  };

  /**
   * Renders the Telemedicine tab content.
   * @returns {React.ReactElement} Telemedicine content
   */
  const renderTelemedicineContent = () => {
    return (
      <div
        id="findcare-panel-telemedicine"
        role="tabpanel"
        aria-label="Telehealth"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Telemedicine Guidance */}
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
            {telemedicineGuidance.description}
          </p>

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
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#065f46',
                  lineHeight: 1.3,
                }}
              >
                ✓ When to Use Telehealth
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  listStyleType: 'disc',
                }}
              >
                {telemedicineGuidance.whenToUse.slice(0, 5).map((item, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '0.75rem',
                      color: '#065f46',
                      lineHeight: 1.5,
                      marginBottom: '0.25rem',
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
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#991b1b',
                  lineHeight: 1.3,
                }}
              >
                ✗ When NOT to Use Telehealth
              </h4>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  listStyleType: 'disc',
                }}
              >
                {telemedicineGuidance.whenNotToUse.slice(0, 5).map((item, index) => (
                  <li
                    key={index}
                    style={{
                      fontSize: '0.75rem',
                      color: '#991b1b',
                      lineHeight: 1.5,
                      marginBottom: '0.25rem',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Telemedicine Providers */}
        <div>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
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
                        gap: '0.5rem',
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

        {/* How to Get Started */}
        <div>
          <h3
            style={{
              margin: '0 0 0.75rem 0',
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
      </div>
    );
  };

  /**
   * Renders the active tab content.
   * @returns {React.ReactElement} Active tab content
   */
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'findCare':
        return renderFindCareContent();
      case 'costEstimates':
        return renderCostEstimatesContent();
      case 'telemedicine':
        return renderTelemedicineContent();
      default:
        return renderFindCareContent();
    }
  };

  return (
    <>
      <div
        id={id || 'find-care-section'}
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
              Find Care & Estimate Costs
            </h1>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Search for in-network providers, estimate your costs, and access virtual care options.
            </p>
          </div>

          {/* Quick action badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="brand" size="sm">
              {findCareCategories.length} categories
            </Badge>
            <Badge variant="info" size="sm">
              {telemedicineProviders.length} telehealth options
            </Badge>
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
                {getIcon('search')}
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
                  Get Care
                </h2>
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

          <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
            {/* Tabs */}
            {renderTabs()}

            {/* Active Tab Content */}
            {renderActiveTabContent()}
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

        {/* External Links Section */}
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div
            className={HB_CLASSES.cardHeader}
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
              {getIcon('globe')}
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
                Quick Links
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                External resources and directories
              </p>
            </div>
          </div>

          <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '0.5rem',
              }}
            >
              {externalLinks.slice(0, 6).map((link) => (
                <button
                  key={link.linkId}
                  type="button"
                  onClick={() => handleExternalLink(link.url, link.title, link.category)}
                  aria-label={link.title}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    width: '100%',
                    padding: '0.625rem 0.75rem',
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
                    {getIcon(link.icon)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#111827',
                          lineHeight: 1.3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {link.title}
                      </span>
                      <svg
                        width="10"
                        height="10"
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
                    </div>
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                      }}
                    >
                      {link.description}
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
        id="find-care-section-leaving-site-modal"
      />
    </>
  );
};

FindCareSection.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  defaultTab: PropTypes.oneOf(['findCare', 'costEstimates', 'telemedicine']),
};

FindCareSection.defaultProps = {
  className: '',
  id: undefined,
  defaultTab: 'findCare',
};

export default FindCareSection;