import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  getClaims,
  getClaimTypeOptions,
  getClaimStatusOptions,
  getPageSizeOptions,
} from '../../services/claimsService.js';
import { HB_CLASSES, ROUTES, PAGINATION } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import DateRangePicker from '../ui/DateRangePicker.jsx';
import Pagination from '../ui/Pagination.jsx';
import Alert from '../ui/Alert.jsx';

/**
 * Returns the Badge variant string for a given claim status badge class.
 * @param {string} statusBadgeClass - The HB CSS badge class string
 * @returns {string} The Badge component variant
 */
const getBadgeVariant = (statusBadgeClass) => {
  if (!statusBadgeClass || typeof statusBadgeClass !== 'string') {
    return 'neutral';
  }

  if (statusBadgeClass.includes('hb-badge-success')) {
    return 'success';
  }
  if (statusBadgeClass.includes('hb-badge-warning')) {
    return 'warning';
  }
  if (statusBadgeClass.includes('hb-badge-error')) {
    return 'error';
  }
  if (statusBadgeClass.includes('hb-badge-info')) {
    return 'info';
  }
  if (statusBadgeClass.includes('hb-badge-brand')) {
    return 'brand';
  }

  return 'neutral';
};

/**
 * ClaimsList component.
 * Displays claims in a responsive table with columns: claim number, type, patient,
 * provider, billed amount, what you owe, status (with Badge), dates. Includes filter
 * controls (type dropdown, status dropdown, date range picker), sort by date, and
 * Pagination component. Uses HB CSS table, form, and grid classes. Accessible table
 * with proper headers and ARIA.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The claims list element
 */
const ClaimsList = ({ className, id }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGINATION.defaultPageSize,
    totalPages: 0,
    totalItems: 0,
  });
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'serviceDate',
    sortOrder: 'desc',
  });

  const claimTypeOptions = useMemo(() => {
    return [{ value: '', label: 'All Types' }, ...getClaimTypeOptions()];
  }, []);

  const claimStatusOptions = useMemo(() => {
    return [{ value: '', label: 'All Statuses' }, ...getClaimStatusOptions()];
  }, []);

  const pageSizeOptions = useMemo(() => {
    return getPageSizeOptions();
  }, []);

  /**
   * Fetches claims with the current filters and pagination state.
   */
  const fetchClaims = useCallback(() => {
    if (!user || !user.memberId) {
      setClaims([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        memberId: user.memberId,
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.type) {
        params.type = filters.type;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }

      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }

      const result = getClaims(params);

      if (result.error) {
        setError(result.error);
        setClaims([]);
        setPagination((prev) => ({
          ...prev,
          totalPages: 0,
          totalItems: 0,
        }));
      } else {
        setClaims(result.claims || []);
        setPagination(result.pagination || {
          page: 1,
          pageSize: PAGINATION.defaultPageSize,
          totalPages: 0,
          totalItems: 0,
        });
        setSummary(result.summary || null);
      }
    } catch (err) {
      console.error('[ClaimsList] Error fetching claims:', err);
      setError('Unable to load claims. Please try again.');
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, pagination.page, pagination.pageSize, filters]);

  /**
   * Fetch claims on mount and when dependencies change.
   */
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  /**
   * Handles type filter change.
   * @param {string} value - The new type filter value
   */
  const handleTypeChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, type: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Handles status filter change.
   * @param {string} value - The new status filter value
   */
  const handleStatusChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, status: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Handles date range change.
   * @param {Object} dateRange - The new date range { startDate, endDate }
   */
  const handleDateRangeChange = useCallback((dateRange) => {
    setFilters((prev) => ({
      ...prev,
      dateFrom: dateRange.startDate || '',
      dateTo: dateRange.endDate || '',
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Handles sort order toggle.
   */
  const handleSortToggle = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'desc' ? 'asc' : 'desc',
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  /**
   * Handles page change.
   * @param {number} newPage - The new page number
   */
  const handlePageChange = useCallback((newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  }, []);

  /**
   * Handles page size change.
   * @param {number} newPageSize - The new page size
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPagination((prev) => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  /**
   * Handles navigation to a specific claim detail page.
   * @param {string} claimId - The claim identifier
   */
  const handleClaimClick = useCallback((claimId) => {
    if (!claimId) {
      return;
    }
    navigate(`/claims/${claimId}`);
  }, [navigate]);

  /**
   * Handles clearing all filters.
   */
  const handleClearFilters = useCallback(() => {
    setFilters({
      type: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'serviceDate',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const hasActiveFilters = filters.type || filters.status || filters.dateFrom || filters.dateTo;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

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
          padding: '1rem 0',
        }}
        role="status"
        aria-label="Loading claims"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0',
              borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.25rem',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
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
        title="Error Loading Claims"
        dismissible={false}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={fetchClaims}
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
          aria-label="Retry loading claims"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no claims are found.
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
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
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
            No claims found
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
            {hasActiveFilters
              ? 'No claims match your current filters. Try adjusting your search criteria.'
              : 'You don\'t have any claims on file yet.'}
          </p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            className={HB_CLASSES.btnSecondary}
            onClick={handleClearFilters}
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
    );
  };

  /**
   * Renders the claims table.
   * @returns {React.ReactElement} Claims table
   */
  const renderClaimsTable = () => {
    return (
      <div
        style={{
          overflowX: 'auto',
        }}
        className="hb-scrollbar-thin"
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.875rem',
          }}
          role="table"
          aria-label="Claims list"
        >
          <thead>
            <tr
              style={{
                borderBottom: '2px solid #e5e7eb',
              }}
            >
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Claim #
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Type
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Provider
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                <button
                  type="button"
                  onClick={handleSortToggle}
                  aria-label={`Sort by service date ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Service Date
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
                    style={{
                      flexShrink: 0,
                      transform: filters.sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.15s ease-in-out',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                  display: 'none',
                }}
                scope="col"
                className="tablet:hb-block"
              >
                Billed
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                You Owe
              </th>
              <th
                style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
                scope="col"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, index) => {
              const isLast = index === claims.length - 1;

              return (
                <tr
                  key={claim.claimId}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease-in-out',
                  }}
                  onClick={() => handleClaimClick(claim.claimId)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleClaimClick(claim.claimId);
                    }
                  }}
                  tabIndex={0}
                  role="row"
                  aria-label={`Claim ${claim.claimNumber}, ${claim.typeLabel}, ${claim.statusLabel}, ${claim.formattedMemberOwes}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Claim Number */}
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.125rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#0069cc',
                          lineHeight: 1.3,
                        }}
                      >
                        {claim.claimNumber || claim.claimId}
                      </span>
                      {claim.patient && (
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            color: '#9ca3af',
                            lineHeight: 1.3,
                          }}
                        >
                          {claim.patient}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.typeLabel || '—'}
                    </span>
                  </td>

                  {/* Provider (hidden on mobile) */}
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '14rem',
                        display: 'inline-block',
                      }}
                      title={claim.provider || ''}
                    >
                      {claim.provider || '—'}
                    </span>
                  </td>

                  {/* Service Date */}
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#6b7280',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.formattedServiceDate || '—'}
                    </span>
                  </td>

                  {/* Billed Amount (hidden on mobile) */}
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                      display: 'none',
                    }}
                    className="tablet:hb-block"
                  >
                    <span
                      style={{
                        fontSize: '0.8125rem',
                        color: '#374151',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.formattedBilledAmount || '$0.00'}
                    </span>
                  </td>

                  {/* You Owe */}
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: claim.memberOwes > 0 ? '#111827' : '#10b981',
                        lineHeight: 1.3,
                      }}
                    >
                      {claim.formattedMemberOwes || '$0.00'}
                    </span>
                  </td>

                  {/* Status */}
                  <td
                    style={{
                      padding: '0.75rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Badge
                      variant={getBadgeVariant(claim.statusBadgeClass)}
                      size="sm"
                      dot
                    >
                      {claim.statusLabel || 'Unknown'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Renders the filter controls.
   * @returns {React.ReactElement} Filter controls
   */
  const renderFilters = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          {/* Type Filter */}
          <div style={{ flex: '1 1 10rem', minWidth: '10rem' }}>
            <Dropdown
              id="claims-filter-type"
              label="Claim Type"
              options={claimTypeOptions}
              value={filters.type}
              onChange={handleTypeChange}
              placeholder="All Types"
              size="sm"
              native={true}
              block={true}
            />
          </div>

          {/* Status Filter */}
          <div style={{ flex: '1 1 10rem', minWidth: '10rem' }}>
            <Dropdown
              id="claims-filter-status"
              label="Status"
              options={claimStatusOptions}
              value={filters.status}
              onChange={handleStatusChange}
              placeholder="All Statuses"
              size="sm"
              native={true}
              block={true}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                className={HB_CLASSES.btnTertiary}
                onClick={handleClearFilters}
                aria-label="Clear all filters"
                style={{
                  padding: '0.375rem 0.625rem',
                  fontSize: '0.8125rem',
                  whiteSpace: 'nowrap',
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Date Range */}
        <DateRangePicker
          id="claims-filter-date"
          legend="Service Date Range"
          startLabel="From"
          endLabel="To"
          startValue={filters.dateFrom}
          endValue={filters.dateTo}
          onChange={handleDateRangeChange}
          orientation="horizontal"
          size="sm"
          showClearButton={true}
          onClear={() => {
            setFilters((prev) => ({ ...prev, dateFrom: '', dateTo: '' }));
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        />
      </div>
    );
  };

  return (
    <div
      id={id || 'claims-list'}
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
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
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
            Claims
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            View and track your medical, dental, vision, and pharmacy claims.
          </p>
        </div>

        {/* Summary badges */}
        {!isLoading && !error && summary && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <Badge variant="brand" size="sm">
              {summary.totalClaims} total
            </Badge>
            {summary.totalOwed > 0 && (
              <Badge variant="warning" size="sm">
                {`$${summary.totalOwed.toFixed(2)} owed`}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Claims Card */}
      <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
        {/* Filter Controls */}
        {renderFilters()}

        {/* Table Body */}
        <div
          className={HB_CLASSES.cardBody}
          style={{ padding: '0.75rem 1rem' }}
        >
          {isLoading && renderLoading()}
          {!isLoading && error && renderError()}
          {!isLoading && !error && claims.length === 0 && renderEmpty()}
          {!isLoading && !error && claims.length > 0 && renderClaimsTable()}
        </div>

        {/* Pagination Footer */}
        {!isLoading && !error && pagination.totalItems > 0 && (
          <div
            className={HB_CLASSES.cardFooter}
            style={{
              padding: '0.75rem 1.5rem',
            }}
          >
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={pageSizeOptions}
              showPageSizeSelector={true}
              showItemCount={true}
              maxVisiblePages={5}
              ariaLabel="Claims pagination"
              id="claims-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};

ClaimsList.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

ClaimsList.defaultProps = {
  className: '',
  id: undefined,
};

export default ClaimsList;