import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import { HB_CLASSES } from '../constants/constants.js';
import FindCareSection from '../components/getcare/FindCareSection.jsx';
import TelemedicineSection from '../components/getcare/TelemedicineSection.jsx';
import BehavioralHealthSection from '../components/getcare/BehavioralHealthSection.jsx';

/**
 * Returns an SVG icon element for the given icon identifier.
 * @param {string} iconName - The icon identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getSectionIcon = (iconName) => {
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
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

/**
 * Section tab configuration for the Get Care page.
 * @type {Object[]}
 */
const SECTIONS = [
  {
    id: 'findCare',
    label: 'Find Care & Cost',
    icon: 'search',
    description: 'Search for providers, estimate costs, and access care resources.',
  },
  {
    id: 'telemedicine',
    label: 'Telehealth',
    icon: 'video',
    description: 'Access virtual care from the comfort of your home.',
  },
  {
    id: 'behavioralHealth',
    label: 'Behavioral Health',
    icon: 'heart',
    description: 'Mental health resources, crisis support, and therapy options.',
  },
];

/**
 * GetCarePage component.
 * Get Care page composing FindCareSection, TelemedicineSection, and
 * BehavioralHealthSection subsections. Uses HB CSS grid and page-content
 * layout. Includes tab or section navigation between subsections.
 * Tags page view via Glassbox on mount and section change.
 *
 * @returns {React.ReactElement} The Get Care page element
 */
const GetCarePage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState('findCare');

  /**
   * Parse hash from URL to set initial active section.
   */
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      const matchingSection = SECTIONS.find((section) => section.id === hash);
      if (matchingSection) {
        setActiveSection(matchingSection.id);
      }
    }
  }, [location.hash]);

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Get Care',
      route: '/find-doctor',
    });
  }, [tagPageViewed]);

  /**
   * Handles section tab change.
   * @param {string} sectionId - The section identifier to switch to
   */
  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);

    tagPageViewed({
      pageName: `Get Care - ${SECTIONS.find((s) => s.id === sectionId)?.label || sectionId}`,
      route: `/find-doctor#${sectionId}`,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tagPageViewed]);

  /**
   * Renders the section navigation tabs.
   * @returns {React.ReactElement} Section navigation tabs
   */
  const renderSectionNav = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {/* Tab navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            flexWrap: 'wrap',
          }}
          role="tablist"
          aria-label="Get Care sections"
        >
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`getcare-panel-${section.id}`}
                onClick={() => handleSectionChange(section.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#0069cc' : '#6b7280',
                  backgroundColor: isActive ? '#e6f0fa' : 'transparent',
                  border: isActive ? '2px solid #0069cc' : '2px solid #d1d5db',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#9ca3af';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '1.5rem',
                    height: '1.5rem',
                    color: isActive ? '#0069cc' : '#9ca3af',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {getSectionIcon(section.icon)}
                </span>
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active section description */}
        {SECTIONS.map((section) => {
          if (section.id !== activeSection) {
            return null;
          }

          return (
            <p
              key={`desc-${section.id}`}
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              {section.description}
            </p>
          );
        })}
      </div>
    );
  };

  /**
   * Renders the active section content.
   * @returns {React.ReactElement} Active section content
   */
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'findCare':
        return (
          <div
            id="getcare-panel-findCare"
            role="tabpanel"
            aria-label="Find Care & Cost"
          >
            <FindCareSection
              id="getcare-find-care-section"
              defaultTab="findCare"
            />
          </div>
        );
      case 'telemedicine':
        return (
          <div
            id="getcare-panel-telemedicine"
            role="tabpanel"
            aria-label="Telehealth"
          >
            <TelemedicineSection
              id="getcare-telemedicine-section"
              showProviders={true}
              showGuidance={true}
              showFAQs={true}
              showHowToGetStarted={true}
              expandFirstFAQ={false}
            />
          </div>
        );
      case 'behavioralHealth':
        return (
          <div
            id="getcare-panel-behavioralHealth"
            role="tabpanel"
            aria-label="Behavioral Health"
          >
            <BehavioralHealthSection
              id="getcare-behavioral-health-section"
              showResources={true}
              showCrisisResources={true}
              showFAQs={true}
              showNurseLine={true}
              expandFirstFAQ={false}
            />
          </div>
        );
      default:
        return (
          <div
            id="getcare-panel-findCare"
            role="tabpanel"
            aria-label="Find Care & Cost"
          >
            <FindCareSection
              id="getcare-find-care-section"
              defaultTab="findCare"
            />
          </div>
        );
    }
  };

  return (
    <div
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
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
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
          Get Care
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          Find in-network providers, estimate costs, access telehealth, and explore behavioral health resources.
        </p>
      </div>

      {/* Section Navigation */}
      {renderSectionNav()}

      {/* Active Section Content */}
      {renderActiveSection()}
    </div>
  );
};

export default GetCarePage;