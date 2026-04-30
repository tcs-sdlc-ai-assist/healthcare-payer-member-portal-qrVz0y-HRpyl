import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import {
  getDocuments,
  downloadDocument,
  getDocumentCategoryOptions,
  getDocumentStatusOptions,
  getPageSizeOptions,
} from '../../services/documentService.js';
import { HB_CLASSES, ROUTES, PAGINATION } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import DateRangePicker from '../ui/DateRangePicker.jsx';
import Pagination from '../ui/Pagination.jsx';
import Alert from '../ui/Alert.jsx';
import Button from '../ui/Button.jsx';

/**
 * Returns the Badge variant for a document status.
 * @param {string} status - The document status string
 * @returns {string} The Badge variant
 */
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'available':
      return 'success';
    case 'archived':
      return 'neutral';
    case 'pending':
      return 'warning';
    default:
      return 'neutral';
  }
};

/**
 * Returns a category icon SVG element.
 * @param {string} category - The document category
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

  switch (category) {
    case 'EOB':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'ID_CARD':
      return (
        <svg {...iconProps}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'PLAN_DOCUMENTS':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'CORRESPONDENCE':
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'TAX_FORMS':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      );
    case 'PRIOR_AUTH':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'APPEALS':
      return (
        <svg {...iconProps}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
  }
};

/**
 * DocumentList component.
 * Document center list component displaying categorized documents (EOB, plan documents,
 * letters, tax forms) in a filterable, sortable table. Includes category filter dropdown,
 * date sort, search within documents, and download button that triggers audit logging.
 * Uses Pagination component. HB CSS table and form classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The document list element
 */
const DocumentList = ({ className, id }) => {
  const { user } = useAuth();
  const { tagDocumentDownloaded } = useGlassbox();

  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGINATION.defaultPageSize,
    totalPages: 0,
    totalItems: 0,
  });
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'dateCreated',
    sortOrder: 'desc',
  });

  const documentCategoryOptions = useMemo(() => {
    return [{ value: '', label: 'All Categories' }, ...getDocumentCategoryOptions()];
  }, []);

  const documentStatusOptions = useMemo(() => {
    return [{ value: '', label: 'All Statuses' }, ...getDocumentStatusOptions()];
  }, []);

  const pageSizeOptions = useMemo(() => {
    return getPageSizeOptions();
  }, []);

  /**
   * Fetches documents with the current filters and pagination state.
   */
  const fetchDocuments = useCallback(() => {
    if (!user || !user.memberId) {
      setDocuments([]);
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

      if (filters.category) {
        params.category = filters.category;
      }

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }

      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }

      const result = getDocuments(params);

      if (result.error) {
        setError(result.error);
        setDocuments([]);
        setPagination((prev) => ({
          ...prev,
          totalPages: 0,
          totalItems: 0,
        }));
      } else {
        setDocuments(result.documents || []);
        setPagination(result.pagination || {
          page: 1,
          pageSize: PAGINATION.defaultPageSize,
          totalPages: 0,
          totalItems: 0,
        });
        setSummary(result.summary || null);
      }
    } catch (err) {
      console.error('[DocumentList] Error fetching documents:', err);
      setError('Unable to load documents. Please try again.');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, pagination.page, pagination.pageSize, filters]);

  /**
   * Fetch documents on mount and when dependencies change.
   */
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  /**
   * Handles category filter change.
   * @param {string} value - The new category filter value
   */
  const handleCategoryChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, category: value }));
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
   * Handles search input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, search: value }));
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
   * Handles document download.
   * @param {Object} doc - The document object to download
   */
  const handleDownload = useCallback((doc) => {
    if (!doc || !doc.documentId) {
      return;
    }

    setDownloadingId(doc.documentId);
    setDownloadError(null);

    try {
      const result = downloadDocument(doc.documentId, {
        memberId: user?.memberId,
      });

      if (!result.success) {
        setDownloadError(result.error || 'Unable to download document. Please try again.');
      } else {
        tagDocumentDownloaded({
          documentId: doc.documentId,
          category: doc.category,
          title: doc.title,
        });
      }
    } catch (err) {
      console.error('[DocumentList] Error downloading document:', err);
      setDownloadError('An unexpected error occurred while downloading the document.');
    } finally {
      setDownloadingId(null);
    }
  }, [user, tagDocumentDownloaded]);

  /**
   * Handles clearing all filters.
   */
  const handleClearFilters = useCallback(() => {
    setFilters({
      category: '',
      status: '',
      search: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'dateCreated',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const hasActiveFilters = filters.category || filters.status || filters.search || filters.dateFrom || filters.dateTo;

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
        aria-label="Loading documents"
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
        title="Error Loading Documents"
        dismissible={false}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={fetchDocuments}
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
          aria-label="Retry loading documents"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no documents are found.
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
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
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
            No documents found
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
              ? 'No documents match your current filters. Try adjusting your search criteria.'
              : 'You don\'t have any documents on file yet.'}
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
   * Renders the documents table.
   * @returns {React.ReactElement} Documents table
   */
  const renderDocumentsTable = () => {
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
          aria-label="Documents list"
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
                Document
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
                Category
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
                  aria-label={`Sort by date ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
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
                  Date
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
                Size
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => {
              const isLast = index === documents.length - 1;
              const isDownloading = downloadingId === doc.documentId;

              return (
                <tr
                  key={doc.documentId}
                  style={{
                    borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
                    transition: 'background-color 0.1s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Document Title & Description */}
                  <td
                    style={{
                      padding: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.625rem',
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
                          backgroundColor: '#e6f0fa',
                          color: '#0069cc',
                          flexShrink: 0,
                          marginTop: '0.0625rem',
                        }}
                        aria-hidden="true"
                      >
                        {getCategoryIcon(doc.category)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#111827',
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '20rem',
                          }}
                          title={doc.title}
                        >
                          {doc.title || '—'}
                        </span>
                        <span
                          style={{
                            display: 'block',
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            lineHeight: 1.4,
                            marginTop: '0.125rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '20rem',
                          }}
                          title={doc.description}
                        >
                          {doc.description || ''}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category (hidden on mobile) */}
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
                      }}
                    >
                      {doc.categoryLabel || '—'}
                    </span>
                  </td>

                  {/* Date */}
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
                      {doc.formattedDateCreated || '—'}
                    </span>
                  </td>

                  {/* File Size (hidden on mobile) */}
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
                        color: '#6b7280',
                        lineHeight: 1.3,
                      }}
                    >
                      {doc.formattedFileSize || '—'}
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
                      variant={getStatusBadgeVariant(doc.status)}
                      size="sm"
                      dot
                    >
                      {doc.statusLabel || 'Unknown'}
                    </Badge>
                  </td>

                  {/* Download Action */}
                  <td
                    style={{
                      padding: '0.75rem',
                      textAlign: 'right',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Button
                      variant="tertiary"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      loading={isDownloading}
                      disabled={isDownloading || !doc.isAvailable}
                      ariaLabel={`Download ${doc.title || 'document'}`}
                      iconLeft={
                        !isDownloading ? (
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
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                        ) : undefined
                      }
                    >
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
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
          {/* Category Filter */}
          <div style={{ flex: '1 1 10rem', minWidth: '10rem' }}>
            <Dropdown
              id="documents-filter-category"
              label="Category"
              options={documentCategoryOptions}
              value={filters.category}
              onChange={handleCategoryChange}
              placeholder="All Categories"
              size="sm"
              native={true}
              block={true}
            />
          </div>

          {/* Status Filter */}
          <div style={{ flex: '1 1 10rem', minWidth: '10rem' }}>
            <Dropdown
              id="documents-filter-status"
              label="Status"
              options={documentStatusOptions}
              value={filters.status}
              onChange={handleStatusChange}
              placeholder="All Statuses"
              size="sm"
              native={true}
              block={true}
            />
          </div>

          {/* Search */}
          <div style={{ flex: '1 1 14rem', minWidth: '14rem' }}>
            <div className={HB_CLASSES.formGroup} style={{ marginBottom: 0 }}>
              <label
                htmlFor="documents-filter-search"
                className={HB_CLASSES.formLabel}
              >
                Search
              </label>
              <div style={{ position: 'relative' }}>
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
                  id="documents-filter-search"
                  type="text"
                  className={HB_CLASSES.formInput}
                  value={filters.search}
                  onChange={handleSearchChange}
                  placeholder="Search documents..."
                  autoComplete="off"
                  aria-label="Search documents by title or description"
                  style={{
                    paddingLeft: '2.25rem',
                    padding: '0.375rem 0.75rem 0.375rem 2.25rem',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>
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
          id="documents-filter-date"
          legend="Date Range"
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
      id={id || 'document-list'}
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
            Documents
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Access your EOBs, plan documents, tax forms, correspondence, and more.
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
              {summary.totalDocuments} total
            </Badge>
            {summary.availableDocuments > 0 && (
              <Badge variant="success" size="sm">
                {summary.availableDocuments} available
              </Badge>
            )}
            {summary.archivedDocuments > 0 && (
              <Badge variant="neutral" size="sm">
                {summary.archivedDocuments} archived
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Download Error */}
      {downloadError && (
        <Alert
          variant="error"
          dismissible={true}
          onDismiss={() => setDownloadError(null)}
        >
          {downloadError}
        </Alert>
      )}

      {/* Documents Card */}
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
          {!isLoading && !error && documents.length === 0 && renderEmpty()}
          {!isLoading && !error && documents.length > 0 && renderDocumentsTable()}
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
              ariaLabel="Documents pagination"
              id="documents-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};

DocumentList.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

DocumentList.defaultProps = {
  className: '',
  id: undefined,
};

export default DocumentList;