import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import {
  getWellnessPrograms,
  getWellnessProgramsByCategory,
  getHealthAssessmentsByMemberId,
  getPreventiveCareRemindersByMemberId,
  getWellnessGoalsByMemberId,
  getWellnessIncentivesByMemberId,
  getWellnessSummary,
} from '../data/wellnessData.js';
import { HB_CLASSES, ROUTES } from '../constants/constants.js';
import Badge from '../components/ui/Badge.jsx';
import Alert from '../components/ui/Alert.jsx';
import Button from '../components/ui/Button.jsx';
import ProgressBar from '../components/ui/ProgressBar.jsx';
import LeavingSiteModal from '../components/ui/LeavingSiteModal.jsx';

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
    case 'activity':
      return (
        <svg {...iconProps}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'sun':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
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
    case 'trending-down':
      return (
        <svg {...iconProps}>
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
          <polyline points="17 18 23 18 23 12" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...iconProps}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'award':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case 'target':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...iconProps}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
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
    default:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
};

/**
 * Returns the Badge variant for a program category.
 * @param {string} category - The program category
 * @returns {string} The Badge variant
 */
const getProgramCategoryBadgeVariant = (category) => {
  switch (category) {
    case 'fitness':
      return 'brand';
    case 'nutrition':
      return 'success';
    case 'mental_health':
      return 'info';
    case 'chronic_care':
      return 'warning';
    case 'lifestyle':
      return 'neutral';
    case 'preventive':
      return 'success';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for a program category.
 * @param {string} category - The program category
 * @returns {string} The human-readable label
 */
const getProgramCategoryLabel = (category) => {
  switch (category) {
    case 'fitness':
      return 'Fitness';
    case 'nutrition':
      return 'Nutrition';
    case 'mental_health':
      return 'Mental Health';
    case 'chronic_care':
      return 'Chronic Care';
    case 'lifestyle':
      return 'Lifestyle';
    case 'preventive':
      return 'Preventive';
    default:
      return 'General';
  }
};

/**
 * Returns the Badge variant for an assessment status.
 * @param {string} status - The assessment status
 * @returns {string} The Badge variant
 */
const getAssessmentStatusBadgeVariant = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'available':
      return 'brand';
    case 'in_progress':
      return 'warning';
    case 'expired':
      return 'error';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for an assessment status.
 * @param {string} status - The assessment status
 * @returns {string} The human-readable label
 */
const getAssessmentStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'available':
      return 'Available';
    case 'in_progress':
      return 'In Progress';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
};

/**
 * Returns the Badge variant for a reminder status.
 * @param {string} status - The reminder status
 * @returns {string} The Badge variant
 */
const getReminderStatusBadgeVariant = (status) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'due':
      return 'warning';
    case 'upcoming':
      return 'info';
    case 'overdue':
      return 'error';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for a reminder status.
 * @param {string} status - The reminder status
 * @returns {string} The human-readable label
 */
const getReminderStatusLabel = (status) => {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'due':
      return 'Due';
    case 'upcoming':
      return 'Upcoming';
    case 'overdue':
      return 'Overdue';
    default:
      return 'Unknown';
  }
};

/**
 * Returns the Badge variant for an incentive status.
 * @param {string} status - The incentive status
 * @returns {string} The Badge variant
 */
const getIncentiveStatusBadgeVariant = (status) => {
  switch (status) {
    case 'earned':
      return 'success';
    case 'available':
      return 'brand';
    case 'redeemed':
      return 'info';
    case 'expired':
      return 'error';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for an incentive status.
 * @param {string} status - The incentive status
 * @returns {string} The human-readable label
 */
const getIncentiveStatusLabel = (status) => {
  switch (status) {
    case 'earned':
      return 'Earned';
    case 'available':
      return 'Available';
    case 'redeemed':
      return 'Redeemed';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
};

/**
 * Returns the Badge variant for a goal status.
 * @param {string} status - The goal status
 * @returns {string} The Badge variant
 */
const getGoalStatusBadgeVariant = (status) => {
  switch (status) {
    case 'active':
      return 'brand';
    case 'completed':
      return 'success';
    case 'paused':
      return 'warning';
    default:
      return 'neutral';
  }
};

/**
 * Section tab configuration for the Wellness page.
 * @type {Object[]}
 */
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: 'target' },
  { id: 'programs', label: 'Programs', icon: 'activity' },
  { id: 'assessments', label: 'Assessments', icon: 'clipboard' },
  { id: 'preventive', label: 'Preventive Care', icon: 'shield' },
  { id: 'goals', label: 'Goals', icon: 'target' },
  { id: 'incentives', label: 'Incentives', icon: 'award' },
];

/**
 * Program category filter options.
 * @type {Object[]}
 */
const PROGRAM_CATEGORY_FILTERS = [
  { id: 'all', label: 'All Programs' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'mental_health', label: 'Mental Health' },
  { id: 'chronic_care', label: 'Chronic Care' },
  { id: 'lifestyle', label: 'Lifestyle' },
];

/**
 * WellnessPage component.
 * Wellness page displaying wellness programs, health assessments, preventive care
 * reminders, wellness goals, and incentives from dummy data. Uses HB CSS card and
 * grid classes. Includes section navigation tabs and category filtering.
 *
 * @returns {React.ReactElement} The wellness page element
 */
const WellnessPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  const [activeSection, setActiveSection] = useState('overview');
  const [programCategoryFilter, setProgramCategoryFilter] = useState('all');
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  const memberId = user?.memberId || '';

  const allPrograms = useMemo(() => getWellnessPrograms(), []);
  const assessments = useMemo(() => getHealthAssessmentsByMemberId(memberId), [memberId]);
  const reminders = useMemo(() => getPreventiveCareRemindersByMemberId(memberId), [memberId]);
  const goals = useMemo(() => getWellnessGoalsByMemberId(memberId), [memberId]);
  const incentives = useMemo(() => getWellnessIncentivesByMemberId(memberId), [memberId]);
  const summary = useMemo(() => getWellnessSummary(memberId), [memberId]);

  const filteredPrograms = useMemo(() => {
    if (programCategoryFilter === 'all') {
      return allPrograms;
    }
    return allPrograms.filter((program) => program.category === programCategoryFilter);
  }, [allPrograms, programCategoryFilter]);

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Wellness',
      route: '/wellness',
    });
  }, [tagPageViewed]);

  /**
   * Handles section tab change.
   * @param {string} sectionId - The section identifier
   */
  const handleSectionChange = useCallback((sectionId) => {
    setActiveSection(sectionId);
  }, []);

  /**
   * Handles program category filter change.
   * @param {string} categoryId - The category identifier
   */
  const handleProgramCategoryChange = useCallback((categoryId) => {
    setProgramCategoryFilter(categoryId);
  }, []);

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
   * Renders the section navigation tabs.
   * @returns {React.ReactElement} Section navigation tabs
   */
  const renderSectionNav = () => {
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
        aria-label="Wellness sections"
      >
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`wellness-panel-${section.id}`}
              onClick={() => handleSectionChange(section.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
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
                {getIcon(section.icon)}
              </span>
              {section.label}
            </button>
          );
        })}
      </div>
    );
  };

  /**
   * Renders the overview section with summary cards.
   * @returns {React.ReactElement} Overview section
   */
  const renderOverview = () => {
    if (!summary) {
      return null;
    }

    return (
      <div
        id="wellness-panel-overview"
        role="tabpanel"
        aria-label="Overview"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Summary Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#e6f0fa',
              borderRadius: '0.375rem',
              border: '1px solid #cce1f5',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#0054a3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Programs Available
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0054a3',
                lineHeight: 1.2,
              }}
            >
              {summary.totalPrograms}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              borderRadius: '0.375rem',
              border: '1px solid #a7f3d0',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#065f46',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Incentives Earned
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#065f46',
                lineHeight: 1.2,
              }}
            >
              ${summary.totalIncentivesEarned}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#065f46',
                lineHeight: 1.4,
              }}
            >
              {summary.incentivesEarnedCount} rewards
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#eff6ff',
              borderRadius: '0.375rem',
              border: '1px solid #bfdbfe',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#1e40af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Incentives Available
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e40af',
                lineHeight: 1.2,
              }}
            >
              ${summary.totalIncentivesAvailable}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#1e40af',
                lineHeight: 1.4,
              }}
            >
              {summary.incentivesAvailableCount} remaining
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#fffbeb',
              borderRadius: '0.375rem',
              border: '1px solid #fde68a',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#92400e',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Preventive Care
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#92400e',
                lineHeight: 1.2,
              }}
            >
              {summary.reminderStatusCounts.completed}/{summary.totalReminders}
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#92400e',
                lineHeight: 1.4,
              }}
            >
              screenings completed
            </span>
          </div>
        </div>

        {/* Active Goals */}
        {goals.length > 0 && (
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
                  {getIcon('target')}
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
                    Active Goals
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                    }}
                  >
                    Track your wellness progress
                  </p>
                </div>
              </div>
              <Badge variant="brand" size="sm">
                {summary.goalStatusCounts.active} active
              </Badge>
            </div>
            <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {goals
                  .filter((goal) => goal.status === 'active')
                  .slice(0, 4)
                  .map((goal) => {
                    const percentage = goal.targetValue > 0
                      ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                      : 0;

                    const variant = percentage >= 90
                      ? 'success'
                      : percentage >= 60
                        ? 'brand'
                        : percentage >= 30
                          ? 'warning'
                          : 'error';

                    return (
                      <div
                        key={goal.goalId}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.375rem',
                          padding: '0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#111827',
                              lineHeight: 1.3,
                            }}
                          >
                            {goal.title}
                          </span>
                          <Badge variant={getGoalStatusBadgeVariant(goal.status)} size="sm">
                            {goal.currentValue} / {goal.targetValue} {goal.unit}
                          </Badge>
                        </div>
                        <ProgressBar
                          used={goal.currentValue}
                          max={goal.targetValue}
                          variant={variant}
                          size="sm"
                          showAmounts={false}
                          showPercentage={true}
                          showRemaining={false}
                          label={`${goal.title} progress`}
                          animate={true}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Preventive Care */}
        {reminders.filter((r) => r.status === 'due' || r.status === 'upcoming').length > 0 && (
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
                    backgroundColor: '#fffbeb',
                    color: '#f59e0b',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {getIcon('clock')}
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
                    Upcoming Preventive Care
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                    }}
                  >
                    Screenings and exams due soon
                  </p>
                </div>
              </div>
            </div>
            <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {reminders
                  .filter((r) => r.status === 'due' || r.status === 'upcoming')
                  .slice(0, 5)
                  .map((reminder) => (
                    <div
                      key={reminder.reminderId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#111827',
                            lineHeight: 1.3,
                          }}
                        >
                          {reminder.title}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                            marginTop: '0.125rem',
                          }}
                        >
                          {reminder.frequency} • {reminder.cost}
                        </span>
                      </div>
                      <Badge variant={getReminderStatusBadgeVariant(reminder.status)} size="sm" dot>
                        {getReminderStatusLabel(reminder.status)}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the wellness programs section.
   * @returns {React.ReactElement} Programs section
   */
  const renderPrograms = () => {
    return (
      <div
        id="wellness-panel-programs"
        role="tabpanel"
        aria-label="Programs"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Category filter tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            flexWrap: 'wrap',
          }}
          role="tablist"
          aria-label="Filter programs by category"
        >
          {PROGRAM_CATEGORY_FILTERS.map((option) => {
            const isActive = programCategoryFilter === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleProgramCategoryChange(option.id)}
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

        {/* Program cards */}
        {filteredPrograms.length === 0 ? (
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
              No programs found for the selected category.
            </p>
            <button
              type="button"
              className={HB_CLASSES.btnSecondary}
              onClick={() => handleProgramCategoryChange('all')}
              aria-label="Show all programs"
              style={{
                padding: '0.375rem 1rem',
                fontSize: '0.875rem',
              }}
            >
              Show All Programs
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1rem',
            }}
          >
            {filteredPrograms.map((program) => (
              <div
                key={program.programId}
                className={HB_CLASSES.card}
                style={{ overflow: 'hidden' }}
              >
                <div
                  className={HB_CLASSES.cardBody}
                  style={{ padding: '1.25rem' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}
                  >
                    {/* Program header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
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
                          {getIcon(program.icon)}
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
                            {program.title}
                          </h4>
                          <p
                            style={{
                              margin: '0.125rem 0 0 0',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              lineHeight: 1.4,
                            }}
                          >
                            {program.duration} • {program.format === 'self_paced' ? 'Self-Paced' : program.format === 'online' ? 'Online' : program.format === 'hybrid' ? 'Hybrid' : program.format}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getProgramCategoryBadgeVariant(program.category)} size="sm">
                        {getProgramCategoryLabel(program.category)}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {program.description}
                    </p>

                    {/* Benefits */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.375rem',
                      }}
                    >
                      {program.benefits.slice(0, 3).map((benefit, index) => (
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
                          {benefit}
                        </span>
                      ))}
                      {program.benefits.length > 3 && (
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
                          +{program.benefits.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Cost and incentive */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '0.75rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.0625rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: '#065f46',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Cost
                        </span>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            color: '#065f46',
                          }}
                        >
                          {program.cost}
                        </span>
                      </div>
                      {program.incentiveAmount && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.0625rem',
                            textAlign: 'right',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              color: '#0054a3',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}
                          >
                            Incentive
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 600,
                              color: '#0054a3',
                            }}
                          >
                            ${program.incentiveAmount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Enroll button */}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExternalLink(program.enrollmentUrl, program.title, 'wellness')}
                      ariaLabel={`Enroll in ${program.title}`}
                      block={true}
                      iconLeft={getIcon('globe')}
                    >
                      Learn More & Enroll
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the health assessments section.
   * @returns {React.ReactElement} Assessments section
   */
  const renderAssessments = () => {
    return (
      <div
        id="wellness-panel-assessments"
        role="tabpanel"
        aria-label="Assessments"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Alert
          variant="info"
          dismissible={false}
          role="status"
        >
          Complete your health assessments to receive personalized wellness recommendations and earn incentive rewards.
        </Alert>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {assessments.map((assessment) => (
            <div
              key={assessment.assessmentId}
              className={HB_CLASSES.card}
              style={{ overflow: 'hidden' }}
            >
              <div
                className={HB_CLASSES.cardBody}
                style={{ padding: '1.25rem' }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {/* Assessment header */}
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
                          backgroundColor: assessment.status === 'completed' ? '#ecfdf5' : '#e6f0fa',
                          color: assessment.status === 'completed' ? '#10b981' : '#0069cc',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {assessment.status === 'completed' ? getIcon('check-circle') : getIcon('clipboard')}
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
                          {assessment.title}
                        </h4>
                        <p
                          style={{
                            margin: '0.125rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          ~{assessment.estimatedMinutes} minutes
                          {assessment.incentiveAmount ? ` • $${assessment.incentiveAmount} reward` : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getAssessmentStatusBadgeVariant(assessment.status)} size="sm" dot>
                      {getAssessmentStatusLabel(assessment.status)}
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
                    {assessment.description}
                  </p>

                  {/* Results (if completed) */}
                  {assessment.status === 'completed' && assessment.results && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Risk Level:
                        </span>
                        <Badge
                          variant={
                            assessment.results.riskLevel === 'low'
                              ? 'success'
                              : assessment.results.riskLevel === 'moderate'
                                ? 'warning'
                                : 'error'
                          }
                          size="sm"
                        >
                          {assessment.results.riskLevel ? assessment.results.riskLevel.charAt(0).toUpperCase() + assessment.results.riskLevel.slice(1) : 'Unknown'}
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
                        {assessment.results.summary}
                      </p>
                      {assessment.results.recommendations && assessment.results.recommendations.length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.6875rem',
                              fontWeight: 600,
                              color: '#6b7280',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Recommendations
                          </span>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '1.25rem',
                              listStyleType: 'disc',
                            }}
                          >
                            {assessment.results.recommendations.slice(0, 3).map((rec, index) => (
                              <li
                                key={index}
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#374151',
                                  lineHeight: 1.5,
                                  marginBottom: '0.25rem',
                                }}
                              >
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action button */}
                  {assessment.status === 'available' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleExternalLink(assessment.assessmentUrl, assessment.title, 'wellness')}
                      ariaLabel={`Start ${assessment.title}`}
                      iconLeft={getIcon('clipboard')}
                    >
                      Start Assessment
                    </Button>
                  )}

                  {assessment.status === 'completed' && assessment.completedDate && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                      }}
                    >
                      Completed on {assessment.completedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the preventive care reminders section.
   * @returns {React.ReactElement} Preventive care section
   */
  const renderPreventiveCare = () => {
    return (
      <div
        id="wellness-panel-preventive"
        role="tabpanel"
        aria-label="Preventive Care"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <Alert
          variant="info"
          dismissible={false}
          role="status"
        >
          Preventive care services are covered at 100% for in-network providers with no cost sharing under your HealthFirst plan.
        </Alert>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {reminders.map((reminder) => (
            <div
              key={reminder.reminderId}
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
                    gap: '0.5rem',
                  }}
                >
                  {/* Reminder header */}
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
                        gap: '0.5rem',
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
                          backgroundColor: reminder.status === 'completed' ? '#ecfdf5' : reminder.status === 'due' ? '#fffbeb' : '#eff6ff',
                          color: reminder.status === 'completed' ? '#10b981' : reminder.status === 'due' ? '#f59e0b' : '#3b82f6',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {reminder.status === 'completed' ? getIcon('check-circle') : getIcon('shield')}
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
                          {reminder.title}
                        </h4>
                        <p
                          style={{
                            margin: '0.125rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          {reminder.coverageTypeLabel} • {reminder.frequency}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getReminderStatusBadgeVariant(reminder.status)} size="sm" dot>
                      {getReminderStatusLabel(reminder.status)}
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
                    {reminder.description}
                  </p>

                  {/* Details grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.0625rem',
                        padding: '0.5rem 0.75rem',
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
                        }}
                      >
                        Cost
                      </span>
                      <span
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          color: '#065f46',
                        }}
                      >
                        {reminder.cost}
                      </span>
                    </div>

                    {reminder.dueDate && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.0625rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Due By
                        </span>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: '#111827',
                          }}
                        >
                          {reminder.dueDate}
                        </span>
                      </div>
                    )}

                    {reminder.lastCompletedDate && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.0625rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Last Completed
                        </span>
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: '#111827',
                          }}
                        >
                          {reminder.lastCompletedDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {reminder.notes && (
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
                        {reminder.notes}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders the wellness goals section.
   * @returns {React.ReactElement} Goals section
   */
  const renderGoals = () => {
    return (
      <div
        id="wellness-panel-goals"
        role="tabpanel"
        aria-label="Goals"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {goals.length === 0 ? (
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
              {getIcon('target')}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              No wellness goals set yet. Complete a health assessment to receive personalized goal recommendations.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {goals.map((goal) => {
              const percentage = goal.targetValue > 0
                ? Math.min((goal.currentValue / goal.targetValue) * 100, 100)
                : 0;

              const variant = percentage >= 90
                ? 'success'
                : percentage >= 60
                  ? 'brand'
                  : percentage >= 30
                    ? 'warning'
                    : 'error';

              return (
                <div
                  key={goal.goalId}
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
                            {goal.title}
                          </h4>
                          <p
                            style={{
                              margin: '0.125rem 0 0 0',
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              lineHeight: 1.4,
                            }}
                          >
                            {goal.description}
                          </p>
                        </div>
                        <Badge variant={getGoalStatusBadgeVariant(goal.status)} size="sm" dot>
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </Badge>
                      </div>

                      <ProgressBar
                        used={goal.currentValue}
                        max={goal.targetValue}
                        variant={variant}
                        size="md"
                        showAmounts={true}
                        showPercentage={true}
                        showRemaining={true}
                        usedLabel={goal.unit}
                        maxLabel="target"
                        remainingLabel="to go"
                        label={`${goal.title} progress`}
                        animate={true}
                      />

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          Started: {goal.startDate}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          Target: {goal.targetDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the wellness incentives section.
   * @returns {React.ReactElement} Incentives section
   */
  const renderIncentives = () => {
    const earnedIncentives = incentives.filter((i) => i.status === 'earned' || i.status === 'redeemed');
    const availableIncentives = incentives.filter((i) => i.status === 'available');

    return (
      <div
        id="wellness-panel-incentives"
        role="tabpanel"
        aria-label="Incentives"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Incentive summary */}
        {summary && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '1rem',
                backgroundColor: '#ecfdf5',
                borderRadius: '0.375rem',
                border: '1px solid #a7f3d0',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#065f46',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Total Earned
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#065f46',
                }}
              >
                ${summary.totalIncentivesEarned}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                padding: '1rem',
                backgroundColor: '#e6f0fa',
                borderRadius: '0.375rem',
                border: '1px solid #cce1f5',
              }}
            >
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  color: '#0054a3',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Still Available
              </span>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0054a3',
                }}
              >
                ${summary.totalIncentivesAvailable}
              </span>
            </div>
          </div>
        )}

        {/* Available incentives */}
        {availableIncentives.length > 0 && (
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
              Available Rewards
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {availableIncentives.map((incentive) => (
                <div
                  key={incentive.incentiveId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#111827',
                        lineHeight: 1.3,
                      }}
                    >
                      {incentive.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                        marginTop: '0.125rem',
                      }}
                    >
                      {incentive.description}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0069cc',
                      }}
                    >
                      ${incentive.amount}
                    </span>
                    <Badge variant={getIncentiveStatusBadgeVariant(incentive.status)} size="sm">
                      {getIncentiveStatusLabel(incentive.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earned incentives */}
        {earnedIncentives.length > 0 && (
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
              Earned Rewards
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              {earnedIncentives.map((incentive) => (
                <div
                  key={incentive.incentiveId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#ecfdf5',
                    borderRadius: '0.375rem',
                    border: '1px solid #a7f3d0',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#065f46',
                        lineHeight: 1.3,
                      }}
                    >
                      {incentive.title}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#065f46',
                        lineHeight: 1.4,
                        marginTop: '0.125rem',
                        opacity: 0.8,
                      }}
                    >
                      {incentive.description}
                      {incentive.earnedDate ? ` • Earned ${incentive.earnedDate}` : ''}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#065f46',
                      }}
                    >
                      ${incentive.amount}
                    </span>
                    <Badge variant={getIncentiveStatusBadgeVariant(incentive.status)} size="sm" dot>
                      {getIncentiveStatusLabel(incentive.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  /**
   * Renders the active section content.
   * @returns {React.ReactElement} Active section content
   */
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'programs':
        return renderPrograms();
      case 'assessments':
        return renderAssessments();
      case 'preventive':
        return renderPreventiveCare();
      case 'goals':
        return renderGoals();
      case 'incentives':
        return renderIncentives();
      default:
        return renderOverview();
    }
  };

  return (
    <>
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
              Wellness Center
            </h1>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              Explore wellness programs, track your health goals, complete assessments, and earn incentive rewards.
            </p>
          </div>

          {/* Summary badges */}
          {summary && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <Badge variant="brand" size="sm">
                {summary.totalPrograms} programs
              </Badge>
              <Badge variant="success" size="sm">
                ${summary.totalIncentivesEarned} earned
              </Badge>
              {summary.totalIncentivesAvailable > 0 && (
                <Badge variant="info" size="sm">
                  ${summary.totalIncentivesAvailable} available
                </Badge>
              )}
            </div>
          )}
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
                  Your Wellness Journey
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Programs, assessments, preventive care, goals & incentives
                </p>
              </div>
            </div>
          </div>

          <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
            {/* Section Navigation */}
            {renderSectionNav()}

            {/* Active Section Content */}
            {renderActiveSection()}
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
              Wellness programs and incentives are included with your HealthFirst plan at no additional cost.
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              {summary ? `${summary.totalPrograms} programs • ${summary.totalIncentives} incentives` : ''}
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
        id="wellness-page-leaving-site-modal"
      />
    </>
  );
};

export default WellnessPage;