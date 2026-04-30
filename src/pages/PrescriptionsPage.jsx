import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import {
  getPrescriptionsByMemberId,
  getActivePrescriptionsByMemberId,
  getMaintenancePrescriptions,
  getMailOrderEligiblePrescriptions,
  getPrescriptionsDueForRefill,
  filterPrescriptions,
  getPharmacies,
  getPharmacyById,
  getFormularyTiers,
  getPrescriptionsSummary,
} from '../data/prescriptionsData.js';
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
    case 'pill':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'check-circle':
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
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
    case 'map-pin':
      return (
        <svg {...iconProps}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...iconProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...iconProps}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      );
    case 'dollar-sign':
      return (
        <svg {...iconProps}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case 'user':
      return (
        <svg {...iconProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'package':
      return (
        <svg {...iconProps}>
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
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
    case 'list':
      return (
        <svg {...iconProps}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
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
 * Returns the Badge variant for a prescription status.
 * @param {string} status - The prescription status
 * @returns {string} The Badge variant
 */
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'expired':
      return 'warning';
    case 'discontinued':
      return 'error';
    case 'on_hold':
      return 'info';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for a prescription status.
 * @param {string} status - The prescription status
 * @returns {string} The human-readable label
 */
const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'discontinued':
      return 'Discontinued';
    case 'on_hold':
      return 'On Hold';
    default:
      return 'Unknown';
  }
};

/**
 * Returns the Badge variant for a formulary tier.
 * @param {number} tierNumber - The tier number
 * @returns {string} The Badge variant
 */
const getTierBadgeVariant = (tierNumber) => {
  switch (tierNumber) {
    case 1:
      return 'success';
    case 2:
      return 'brand';
    case 3:
      return 'warning';
    case 4:
      return 'error';
    default:
      return 'neutral';
  }
};

/**
 * Returns the Badge variant for a pharmacy type.
 * @param {string} type - The pharmacy type
 * @returns {string} The Badge variant
 */
const getPharmacyTypeBadgeVariant = (type) => {
  switch (type) {
    case 'retail':
      return 'brand';
    case 'mail_order':
      return 'info';
    case 'specialty':
      return 'warning';
    default:
      return 'neutral';
  }
};

/**
 * Returns a human-readable label for a pharmacy type.
 * @param {string} type - The pharmacy type
 * @returns {string} The human-readable label
 */
const getPharmacyTypeLabel = (type) => {
  switch (type) {
    case 'retail':
      return 'Retail';
    case 'mail_order':
      return 'Mail Order';
    case 'specialty':
      return 'Specialty';
    default:
      return 'Pharmacy';
  }
};

/**
 * Section tab configuration for the Prescriptions page.
 * @type {Object[]}
 */
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: 'pill' },
  { id: 'prescriptions', label: 'My Prescriptions', icon: 'list' },
  { id: 'pharmacies', label: 'Pharmacies', icon: 'map-pin' },
  { id: 'formulary', label: 'Formulary Tiers', icon: 'dollar-sign' },
];

/**
 * Prescription status filter options.
 * @type {Object[]}
 */
const STATUS_FILTER_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'expired', label: 'Expired' },
  { id: 'discontinued', label: 'Discontinued' },
];

/**
 * PrescriptionsPage component.
 * Prescriptions page displaying current prescriptions, pharmacy information,
 * and formulary tier details from dummy data. Uses HB CSS table and card classes.
 *
 * @returns {React.ReactElement} The prescriptions page element
 */
const PrescriptionsPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  const [activeSection, setActiveSection] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  const memberId = user?.memberId || '';

  const allPrescriptions = useMemo(() => getPrescriptionsByMemberId(memberId), [memberId]);
  const activePrescriptions = useMemo(() => getActivePrescriptionsByMemberId(memberId), [memberId]);
  const maintenancePrescriptions = useMemo(() => getMaintenancePrescriptions(memberId), [memberId]);
  const mailOrderEligible = useMemo(() => getMailOrderEligiblePrescriptions(memberId), [memberId]);
  const refillsDue = useMemo(() => getPrescriptionsDueForRefill(memberId, 14), [memberId]);
  const pharmacies = useMemo(() => getPharmacies(), []);
  const formularyTiers = useMemo(() => getFormularyTiers(), []);
  const summary = useMemo(() => getPrescriptionsSummary(memberId), [memberId]);

  const filteredPrescriptions = useMemo(() => {
    const filters = { memberId };

    if (statusFilter !== 'all') {
      filters.status = statusFilter;
    }

    if (searchQuery.trim().length > 0) {
      filters.search = searchQuery.trim();
    }

    filters.sortBy = 'lastFilledDate';
    filters.sortOrder = 'desc';

    return filterPrescriptions(filters);
  }, [memberId, statusFilter, searchQuery]);

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Prescriptions',
      route: '/prescriptions',
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
   * Handles status filter change.
   * @param {string} status - The status filter value
   */
  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
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
        aria-label="Prescriptions sections"
      >
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`prescriptions-panel-${section.id}`}
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
        id="prescriptions-panel-overview"
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
              Active Prescriptions
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#065f46',
                lineHeight: 1.2,
              }}
            >
              {summary.statusCounts.active}
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
                lineHeight: 1.4,
              }}
            >
              Maintenance Meds
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0054a3',
                lineHeight: 1.2,
              }}
            >
              {summary.maintenanceCount}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: refillsDue.length > 0 ? '#fffbeb' : '#f9fafb',
              borderRadius: '0.375rem',
              border: refillsDue.length > 0 ? '1px solid #fde68a' : '1px solid #e5e7eb',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: refillsDue.length > 0 ? '#92400e' : '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Refills Due Soon
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: refillsDue.length > 0 ? '#92400e' : '#374151',
                lineHeight: 1.2,
              }}
            >
              {summary.refillsDueCount}
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
              Mail Order Eligible
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1e40af',
                lineHeight: 1.2,
              }}
            >
              {summary.mailOrderEligibleCount}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Total Paid (You)
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#374151',
                lineHeight: 1.2,
              }}
            >
              ${summary.totalMemberPaid.toFixed(2)}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}
            >
              Plan Paid
            </span>
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#374151',
                lineHeight: 1.2,
              }}
            >
              ${summary.totalPlanPaid.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Refills Due Soon */}
        {refillsDue.length > 0 && (
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
                    Refills Due Soon
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                    }}
                  >
                    Prescriptions eligible for refill within the next 14 days
                  </p>
                </div>
              </div>
              <Badge variant="warning" size="sm">
                {refillsDue.length} due
              </Badge>
            </div>
            <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {refillsDue.map((rx) => {
                  const pharmacy = getPharmacyById(rx.pharmacyId);

                  return (
                    <div
                      key={rx.prescriptionId}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#fffbeb',
                        borderRadius: '0.375rem',
                        border: '1px solid #fde68a',
                        flexWrap: 'wrap',
                      }}
                    >
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
                          {rx.medicationName} {rx.strength}
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
                          {rx.directions} • {rx.refillsRemaining} refills remaining
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.6875rem',
                            color: '#92400e',
                            lineHeight: 1.4,
                            marginTop: '0.125rem',
                          }}
                        >
                          Next refill: {rx.nextRefillDate} • {pharmacy ? pharmacy.name : ''}
                        </span>
                      </div>
                      <Badge variant="warning" size="sm" dot>
                        {rx.copayAmount}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Medications */}
        {maintenancePrescriptions.length > 0 && (
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
                  {getIcon('pill')}
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
                    Maintenance Medications
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.75rem',
                      color: '#6b7280',
                      lineHeight: 1.4,
                    }}
                  >
                    Ongoing medications for chronic conditions
                  </p>
                </div>
              </div>
              <Badge variant="brand" size="sm">
                {maintenancePrescriptions.length}
              </Badge>
            </div>
            <div className={HB_CLASSES.cardBody} style={{ padding: '0.75rem 1rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {maintenancePrescriptions.slice(0, 5).map((rx) => (
                  <div
                    key={rx.prescriptionId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: '#f9fafb',
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
                        {rx.medicationName} {rx.strength}
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
                        {rx.dosageForm} • {rx.drugClass}
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
                      <Badge variant={getTierBadgeVariant(rx.tierNumber)} size="sm">
                        {rx.tierName}
                      </Badge>
                      {rx.mailOrderEligible && (
                        <Badge variant="info" size="sm">
                          Mail Order
                        </Badge>
                      )}
                    </div>
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
   * Renders the prescriptions list section.
   * @returns {React.ReactElement} Prescriptions list section
   */
  const renderPrescriptions = () => {
    return (
      <div
        id="prescriptions-panel-prescriptions"
        role="tabpanel"
        aria-label="My Prescriptions"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Filters */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          {/* Status filter tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexWrap: 'wrap',
            }}
            role="tablist"
            aria-label="Filter prescriptions by status"
          >
            {STATUS_FILTER_OPTIONS.map((option) => {
              const isActive = statusFilter === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleStatusFilterChange(option.id)}
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

          {/* Search */}
          <div
            style={{
              position: 'relative',
              flex: '1 1 14rem',
              minWidth: '14rem',
              maxWidth: '24rem',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '0.625rem',
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
              placeholder="Search medications..."
              autoComplete="off"
              aria-label="Search prescriptions by medication name"
              style={{
                paddingLeft: '2.25rem',
                paddingRight: searchQuery.length > 0 ? '2.25rem' : '0.75rem',
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
        </div>

        {/* Prescriptions list */}
        {filteredPrescriptions.length === 0 ? (
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
              {getIcon('pill')}
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
                No prescriptions found
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
                {statusFilter !== 'all' || searchQuery.trim().length > 0
                  ? 'No prescriptions match your current filters. Try adjusting your search criteria.'
                  : 'You don\'t have any prescriptions on file.'}
              </p>
            </div>
            {(statusFilter !== 'all' || searchQuery.trim().length > 0) && (
              <button
                type="button"
                className={HB_CLASSES.btnSecondary}
                onClick={() => {
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                aria-label="Clear all filters"
                style={{
                  padding: '0.375rem 1rem',
                  fontSize: '0.875rem',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {filteredPrescriptions.map((rx) => {
              const pharmacy = getPharmacyById(rx.pharmacyId);

              return (
                <div
                  key={rx.prescriptionId}
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
                      {/* Prescription header */}
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
                              backgroundColor: rx.status === 'active' ? '#ecfdf5' : '#f3f4f6',
                              color: rx.status === 'active' ? '#10b981' : '#6b7280',
                              flexShrink: 0,
                            }}
                            aria-hidden="true"
                          >
                            {rx.status === 'active' ? getIcon('check-circle') : rx.status === 'discontinued' ? getIcon('x-circle') : getIcon('pill')}
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
                              {rx.medicationName} {rx.strength}
                            </h4>
                            <p
                              style={{
                                margin: '0.125rem 0 0 0',
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                lineHeight: 1.4,
                              }}
                            >
                              {rx.brandName !== 'N/A' ? `${rx.brandName} • ` : ''}{rx.dosageForm} • {rx.drugClass}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            flexShrink: 0,
                          }}
                        >
                          <Badge variant={getStatusBadgeVariant(rx.status)} size="sm" dot>
                            {getStatusLabel(rx.status)}
                          </Badge>
                          <Badge variant={getTierBadgeVariant(rx.tierNumber)} size="sm">
                            {rx.tierName}
                          </Badge>
                        </div>
                      </div>

                      {/* Directions */}
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.8125rem',
                          color: '#374151',
                          lineHeight: 1.5,
                          backgroundColor: '#f9fafb',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <strong style={{ color: '#111827' }}>Directions:</strong> {rx.directions}
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
                            Quantity / Supply
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: '#111827',
                            }}
                          >
                            {rx.quantity} ({rx.daysSupply}-day)
                          </span>
                        </div>

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
                            Refills
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: rx.refillsRemaining === 0 ? '#ef4444' : '#111827',
                            }}
                          >
                            {rx.refillsRemaining} of {rx.refillsTotal} remaining
                          </span>
                        </div>

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
                            Your Copay
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 700,
                              color: '#065f46',
                            }}
                          >
                            {rx.copayAmount}
                          </span>
                        </div>

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
                            Last Filled
                          </span>
                          <span
                            style={{
                              fontSize: '0.8125rem',
                              fontWeight: 500,
                              color: '#111827',
                            }}
                          >
                            {rx.lastFilledDate}
                          </span>
                        </div>
                      </div>

                      {/* Prescriber and pharmacy */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          borderTop: '1px solid #e5e7eb',
                          paddingTop: '0.75rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '1.25rem',
                              height: '1.25rem',
                              color: '#6b7280',
                              flexShrink: 0,
                            }}
                            aria-hidden="true"
                          >
                            {getIcon('user')}
                          </span>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              lineHeight: 1.4,
                            }}
                          >
                            {rx.prescriber.name} ({rx.prescriber.specialty})
                          </span>
                        </div>
                        {pharmacy && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.375rem',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '1.25rem',
                                height: '1.25rem',
                                color: '#6b7280',
                                flexShrink: 0,
                              }}
                              aria-hidden="true"
                            >
                              {getIcon('map-pin')}
                            </span>
                            <span
                              style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                lineHeight: 1.4,
                              }}
                            >
                              {pharmacy.name}
                            </span>
                          </div>
                        )}
                        {rx.isGeneric && (
                          <Badge variant="success" size="sm">
                            Generic
                          </Badge>
                        )}
                        {rx.isMaintenance && (
                          <Badge variant="brand" size="sm">
                            Maintenance
                          </Badge>
                        )}
                        {rx.mailOrderEligible && (
                          <Badge variant="info" size="sm">
                            Mail Order Eligible
                          </Badge>
                        )}
                      </div>

                      {/* Notes */}
                      {rx.notes && (
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
                            {rx.notes}
                          </span>
                        </div>
                      )}
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
   * Renders the pharmacies section.
   * @returns {React.ReactElement} Pharmacies section
   */
  const renderPharmacies = () => {
    return (
      <div
        id="prescriptions-panel-pharmacies"
        role="tabpanel"
        aria-label="Pharmacies"
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
          Present your pharmacy ID card at any participating pharmacy. For mail-order prescriptions, call member services or visit the member portal.
        </Alert>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {pharmacies.map((pharmacy) => (
            <div
              key={pharmacy.pharmacyId}
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
                  {/* Pharmacy header */}
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
                          backgroundColor: pharmacy.isPreferred ? '#ecfdf5' : '#f3f4f6',
                          color: pharmacy.isPreferred ? '#10b981' : '#6b7280',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      >
                        {getIcon('map-pin')}
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
                          {pharmacy.name}
                        </h4>
                        <p
                          style={{
                            margin: '0.125rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          {pharmacy.address}, {pharmacy.city}, {pharmacy.state} {pharmacy.zipCode}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        flexShrink: 0,
                      }}
                    >
                      <Badge variant={getPharmacyTypeBadgeVariant(pharmacy.type)} size="sm">
                        {getPharmacyTypeLabel(pharmacy.type)}
                      </Badge>
                      {pharmacy.isPreferred && (
                        <Badge variant="success" size="sm" dot>
                          Preferred
                        </Badge>
                      )}
                      {pharmacy.is24Hour && (
                        <Badge variant="info" size="sm">
                          24/7
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Contact and hours */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        padding: '0.625rem 0.75rem',
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
                        Phone
                      </span>
                      <a
                        href={`tel:${pharmacy.phone}`}
                        aria-label={`Call ${pharmacy.name} at ${pharmacy.phone}`}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          color: '#0069cc',
                          textDecoration: 'none',
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
                        {pharmacy.phone}
                      </a>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        padding: '0.625rem 0.75rem',
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
                        Hours
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#374151',
                          lineHeight: 1.4,
                        }}
                      >
                        {pharmacy.hours}
                      </span>
                    </div>
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
   * Renders the formulary tiers section.
   * @returns {React.ReactElement} Formulary tiers section
   */
  const renderFormulary = () => {
    return (
      <div
        id="prescriptions-panel-formulary"
        role="tabpanel"
        aria-label="Formulary Tiers"
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
          Your prescription copay depends on the formulary tier of your medication. Generic medications (Tier 1) are exempt from the pharmacy deductible and offer the lowest cost.
        </Alert>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {formularyTiers.map((tier) => (
            <div
              key={tier.tierNumber}
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
                  {/* Tier header */}
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
                          fontWeight: 700,
                          fontSize: '1rem',
                        }}
                        aria-hidden="true"
                      >
                        {tier.tierNumber}
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
                          {tier.tierName}
                        </h4>
                        <p
                          style={{
                            margin: '0.125rem 0 0 0',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                          }}
                        >
                          {tier.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getTierBadgeVariant(tier.tierNumber)} size="sm">
                      Tier {tier.tierNumber}
                    </Badge>
                  </div>

                  {/* Cost details grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
                        {tier.retailCopay30Day}
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
                        Retail (90-day)
                      </span>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#1e40af',
                          lineHeight: 1.2,
                        }}
                      >
                        {tier.retailCopay90Day}
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
                        Mail Order (90-day)
                      </span>
                      <span
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: '#0054a3',
                          lineHeight: 1.2,
                        }}
                      >
                        {tier.mailOrderCopay90Day}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                        padding: '0.75rem',
                        backgroundColor: tier.deductibleApplies ? '#fffbeb' : '#ecfdf5',
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
                  </div>

                  {/* Notes */}
                  {tier.notes && (
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
                        {tier.notes}
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
   * Renders the active section content.
   * @returns {React.ReactElement} Active section content
   */
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'prescriptions':
        return renderPrescriptions();
      case 'pharmacies':
        return renderPharmacies();
      case 'formulary':
        return renderFormulary();
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
              Prescriptions
            </h1>
            <p
              style={{
                margin: '0.25rem 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
              }}
            >
              View your current prescriptions, pharmacy information, refill status, and formulary tier details.
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
                {summary.statusCounts.active} active
              </Badge>
              {summary.refillsDueCount > 0 && (
                <Badge variant="warning" size="sm">
                  {summary.refillsDueCount} refills due
                </Badge>
              )}
              <Badge variant="success" size="sm">
                {summary.genericCount} generic
              </Badge>
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
                {getIcon('pill')}
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
                  Pharmacy & Prescriptions
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    lineHeight: 1.4,
                  }}
                >
                  Medications, pharmacies, refills & formulary information
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
              Contact your provider for prescription renewals. For pharmacy questions, call Member Services at 1-800-555-0199.
            </span>
            <span
              style={{
                fontSize: '0.6875rem',
                color: '#9ca3af',
                lineHeight: 1.4,
              }}
            >
              {summary ? `${summary.totalPrescriptions} total prescriptions • ${summary.totalPharmacies} pharmacies` : ''}
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
        id="prescriptions-page-leaving-site-modal"
      />
    </>
  );
};

export default PrescriptionsPage;