import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { HB_CLASSES, NOTIFICATION_TYPE, PAGINATION } from '../../constants/constants.js';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import Dropdown from '../ui/Dropdown.jsx';
import DateRangePicker from '../ui/DateRangePicker.jsx';
import Pagination from '../ui/Pagination.jsx';
import Alert from '../ui/Alert.jsx';

/**
 * Returns the Badge variant for a notification type.
 * @param {string} type - The notification type string
 * @returns {string} The Badge variant
 */
const getNotificationBadgeVariant = (type) => {
  switch (type) {
    case NOTIFICATION_TYPE.SUCCESS:
      return 'success';
    case NOTIFICATION_TYPE.WARNING:
      return 'warning';
    case NOTIFICATION_TYPE.ERROR:
      return 'error';
    case NOTIFICATION_TYPE.INFO:
      return 'info';
    case NOTIFICATION_TYPE.CLAIM_UPDATE:
      return 'info';
    case NOTIFICATION_TYPE.PAYMENT_DUE:
      return 'warning';
    case NOTIFICATION_TYPE.DOCUMENT_READY:
      return 'brand';
    case NOTIFICATION_TYPE.MESSAGE:
      return 'brand';
    case NOTIFICATION_TYPE.SYSTEM:
      return 'neutral';
    default:
      return 'neutral';
  }
};

/**
 * Returns an SVG icon element for the given notification type.
 * @param {string} type - The notification type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getNotificationIcon = (type) => {
  const iconProps = {
    width: '18',
    height: '18',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (type) {
    case NOTIFICATION_TYPE.CLAIM_UPDATE:
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case NOTIFICATION_TYPE.PAYMENT_DUE:
      return (
        <svg {...iconProps}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case NOTIFICATION_TYPE.DOCUMENT_READY:
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case NOTIFICATION_TYPE.MESSAGE:
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case NOTIFICATION_TYPE.SUCCESS:
      return (
        <svg {...iconProps}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );
    case NOTIFICATION_TYPE.WARNING:
      return (
        <svg {...iconProps}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case NOTIFICATION_TYPE.ERROR:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );
    case NOTIFICATION_TYPE.SYSTEM:
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case NOTIFICATION_TYPE.INFO:
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
 * Returns the icon container color for a notification type.
 * @param {string} type - The notification type
 * @param {boolean} isRead - Whether the notification is read
 * @returns {Object} Style object for the icon container
 */
const getIconContainerStyle = (type, isRead) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.5rem',
    flexShrink: 0,
  };

  if (isRead) {
    return {
      ...baseStyle,
      backgroundColor: '#f3f4f6',
      color: '#9ca3af',
    };
  }

  switch (type) {
    case NOTIFICATION_TYPE.SUCCESS:
      return { ...baseStyle, backgroundColor: '#ecfdf5', color: '#10b981' };
    case NOTIFICATION_TYPE.WARNING:
    case NOTIFICATION_TYPE.PAYMENT_DUE:
      return { ...baseStyle, backgroundColor: '#fffbeb', color: '#f59e0b' };
    case NOTIFICATION_TYPE.ERROR:
      return { ...baseStyle, backgroundColor: '#fef2f2', color: '#ef4444' };
    case NOTIFICATION_TYPE.INFO:
    case NOTIFICATION_TYPE.CLAIM_UPDATE:
      return { ...baseStyle, backgroundColor: '#eff6ff', color: '#3b82f6' };
    case NOTIFICATION_TYPE.DOCUMENT_READY:
    case NOTIFICATION_TYPE.MESSAGE:
      return { ...baseStyle, backgroundColor: '#e6f0fa', color: '#0069cc' };
    case NOTIFICATION_TYPE.SYSTEM:
      return { ...baseStyle, backgroundColor: '#f3f4f6', color: '#6b7280' };
    default:
      return { ...baseStyle, backgroundColor: '#e6f0fa', color: '#0069cc' };
  }
};

/**
 * NotificationList component.
 * Notifications list component displaying all notifications with unread/read visual
 * states (bold/normal text, colored indicator). Provides 'Mark All as Read' button
 * at top. Each notification shows type icon, message, and relative timestamp.
 * Uses HB CSS list and button classes. Accessible with ARIA live region for updates.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The notification list element
 */
const NotificationList = ({ className, id }) => {
  const {
    notifications,
    unreadCount,
    summary,
    pagination,
    isLoading,
    error,
    filters,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    setFilters,
    setPage,
    setPageSize,
    notificationTypeOptions,
    readStatusOptions,
    pageSizeOptions,
  } = useNotifications();

  const navigate = useNavigate();

  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markAllError, setMarkAllError] = useState(null);
  const [markAllSuccess, setMarkAllSuccess] = useState(false);

  const typeFilterOptions = useMemo(() => {
    return [{ value: '', label: 'All Types' }, ...notificationTypeOptions];
  }, [notificationTypeOptions]);

  const readFilterOptions = useMemo(() => {
    return [
      { value: '', label: 'All' },
      { value: 'false', label: 'Unread' },
      { value: 'true', label: 'Read' },
    ];
  }, []);

  /**
   * Handles type filter change.
   * @param {string} value - The new type filter value
   */
  const handleTypeChange = useCallback((value) => {
    setFilters({ type: value });
  }, [setFilters]);

  /**
   * Handles read status filter change.
   * @param {string} value - The new read status filter value
   */
  const handleReadStatusChange = useCallback((value) => {
    let isReadValue = null;
    if (value === 'true') {
      isReadValue = true;
    } else if (value === 'false') {
      isReadValue = false;
    }
    setFilters({ isRead: isReadValue });
  }, [setFilters]);

  /**
   * Handles date range change.
   * @param {Object} dateRange - The new date range { startDate, endDate }
   */
  const handleDateRangeChange = useCallback((dateRange) => {
    setFilters({
      dateFrom: dateRange.startDate || '',
      dateTo: dateRange.endDate || '',
    });
  }, [setFilters]);

  /**
   * Handles sort order toggle.
   */
  const handleSortToggle = useCallback(() => {
    setFilters({
      sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
    });
  }, [filters.sortOrder, setFilters]);

  /**
   * Handles page change.
   * @param {number} newPage - The new page number
   */
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, [setPage]);

  /**
   * Handles page size change.
   * @param {number} newPageSize - The new page size
   */
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
  }, [setPageSize]);

  /**
   * Handles marking all notifications as read.
   */
  const handleMarkAllAsRead = useCallback(() => {
    setIsMarkingAll(true);
    setMarkAllError(null);
    setMarkAllSuccess(false);

    try {
      const result = markAllAsRead();

      if (!result.success) {
        setMarkAllError(result.error || 'Unable to mark all notifications as read.');
      } else {
        setMarkAllSuccess(true);
        setTimeout(() => {
          setMarkAllSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('[NotificationList] Error marking all as read:', err);
      setMarkAllError('An unexpected error occurred. Please try again.');
    } finally {
      setIsMarkingAll(false);
    }
  }, [markAllAsRead]);

  /**
   * Handles clicking on a notification.
   * Marks it as read and navigates to the action URL if available.
   * @param {Object} notification - The notification object
   */
  const handleNotificationClick = useCallback((notification) => {
    if (!notification) {
      return;
    }

    if (!notification.isRead) {
      markAsRead(notification.notificationId);
    }

    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  }, [markAsRead, navigate]);

  /**
   * Handles clearing all filters.
   */
  const handleClearFilters = useCallback(() => {
    setFilters({
      type: '',
      isRead: null,
      search: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, [setFilters]);

  const hasActiveFilters = filters.type || filters.isRead !== null || filters.dateFrom || filters.dateTo;

  const currentReadFilterValue = useMemo(() => {
    if (filters.isRead === true) {
      return 'true';
    }
    if (filters.isRead === false) {
      return 'false';
    }
    return '';
  }, [filters.isRead]);

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
        aria-label="Loading notifications"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem',
              borderBottom: index < 4 ? '1px solid #f3f4f6' : 'none',
            }}
          >
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div
                style={{
                  width: '70%',
                  height: '0.875rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '90%',
                  height: '0.75rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  width: '30%',
                  height: '0.625rem',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '0.25rem',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
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
        title="Error Loading Notifications"
        dismissible={false}
      >
        <span>{error}</span>
        <button
          type="button"
          onClick={fetchNotifications}
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
          aria-label="Retry loading notifications"
        >
          Retry
        </button>
      </Alert>
    );
  };

  /**
   * Renders the empty state when no notifications are found.
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
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
            No notifications found
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
              ? 'No notifications match your current filters. Try adjusting your search criteria.'
              : 'You don\'t have any notifications yet.'}
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
   * Renders the notifications list.
   * @returns {React.ReactElement} Notifications list
   */
  const renderNotifications = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        role="list"
        aria-label="Notifications"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        {notifications.map((notification, index) => {
          const isLast = index === notifications.length - 1;
          const isUnread = !notification.isRead;

          return (
            <div
              key={notification.notificationId}
              role="listitem"
              style={{
                borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
              }}
            >
              <button
                type="button"
                onClick={() => handleNotificationClick(notification)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNotificationClick(notification);
                  }
                }}
                aria-label={`${isUnread ? 'Unread: ' : ''}${notification.title}. ${notification.typeLabel}. ${notification.relativeDate || notification.formattedDate}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.875rem 1rem',
                  backgroundColor: isUnread ? '#f9fafb' : 'transparent',
                  border: 'none',
                  cursor: notification.actionUrl ? 'pointer' : 'default',
                  textAlign: 'left',
                  transition: 'background-color 0.1s ease-in-out',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isUnread ? '#e6f0fa' : '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isUnread ? '#f9fafb' : 'transparent';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = isUnread ? '#e6f0fa' : '#f9fafb';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = isUnread ? '#f9fafb' : 'transparent';
                }}
              >
                {/* Unread indicator dot */}
                {isUnread && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0.25rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0.375rem',
                      height: '0.375rem',
                      borderRadius: '9999px',
                      backgroundColor: '#0069cc',
                    }}
                    aria-hidden="true"
                  />
                )}

                {/* Type icon */}
                <div
                  style={getIconContainerStyle(notification.type, notification.isRead)}
                  aria-hidden="true"
                >
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: isUnread ? 600 : 400,
                        color: isUnread ? '#111827' : '#374151',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {notification.title}
                    </span>
                    <Badge
                      variant={getNotificationBadgeVariant(notification.type)}
                      size="sm"
                    >
                      {notification.typeLabel}
                    </Badge>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.375rem 0',
                      fontSize: '0.8125rem',
                      fontWeight: isUnread ? 500 : 400,
                      color: isUnread ? '#374151' : '#6b7280',
                      lineHeight: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {notification.message}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#9ca3af',
                        lineHeight: 1.4,
                      }}
                    >
                      {notification.relativeDate || notification.formattedDate}
                    </span>

                    {notification.hasAction && (
                      <>
                        <span
                          style={{
                            color: '#d1d5db',
                            fontSize: '0.6875rem',
                            userSelect: 'none',
                          }}
                          aria-hidden="true"
                        >
                          |
                        </span>
                        <span
                          style={{
                            fontSize: '0.6875rem',
                            color: '#0069cc',
                            fontWeight: 500,
                            lineHeight: 1.4,
                          }}
                        >
                          View Details
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '0.125rem' }}
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
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
              id="notifications-filter-type"
              label="Type"
              options={typeFilterOptions}
              value={filters.type}
              onChange={handleTypeChange}
              placeholder="All Types"
              size="sm"
              native={true}
              block={true}
            />
          </div>

          {/* Read Status Filter */}
          <div style={{ flex: '1 1 8rem', minWidth: '8rem' }}>
            <Dropdown
              id="notifications-filter-read"
              label="Status"
              options={readFilterOptions}
              value={currentReadFilterValue}
              onChange={handleReadStatusChange}
              placeholder="All"
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
          id="notifications-filter-date"
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
            setFilters({ dateFrom: '', dateTo: '' });
          }}
        />
      </div>
    );
  };

  return (
    <div
      id={id || 'notification-list'}
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
            Notifications
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Stay up to date with your claims, documents, payments, and account activity.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
          }}
        >
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
                {summary.totalNotifications} total
              </Badge>
              {unreadCount > 0 && (
                <Badge variant="warning" size="sm">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          )}

          {/* Mark All as Read Button */}
          {!isLoading && !error && unreadCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleMarkAllAsRead}
              loading={isMarkingAll}
              disabled={isMarkingAll}
              ariaLabel="Mark all notifications as read"
              iconLeft={
                !isMarkingAll ? (
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
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                ) : undefined
              }
            >
              {isMarkingAll ? 'Marking...' : 'Mark All as Read'}
            </Button>
          )}
        </div>
      </div>

      {/* Mark All Success/Error */}
      {markAllSuccess && (
        <Alert
          variant="success"
          dismissible={true}
          onDismiss={() => setMarkAllSuccess(false)}
        >
          All notifications have been marked as read.
        </Alert>
      )}

      {markAllError && (
        <Alert
          variant="error"
          dismissible={true}
          onDismiss={() => setMarkAllError(null)}
        >
          {markAllError}
        </Alert>
      )}

      {/* Notifications Card */}
      <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
        {/* Card Header */}
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
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
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
                All Notifications
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Claims, documents, payments, and system updates
              </p>
            </div>
          </div>

          {/* Sort toggle */}
          <button
            type="button"
            className={HB_CLASSES.btnTertiary}
            onClick={handleSortToggle}
            aria-label={`Sort by date ${filters.sortOrder === 'desc' ? 'ascending' : 'descending'}`}
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
              style={{
                flexShrink: 0,
                transform: filters.sortOrder === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease-in-out',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            {filters.sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Filter Controls */}
        {renderFilters()}

        {/* Notification List Body */}
        <div
          className={HB_CLASSES.cardBody}
          style={{ padding: 0 }}
        >
          {isLoading && renderLoading()}
          {!isLoading && error && (
            <div style={{ padding: '1rem' }}>
              {renderError()}
            </div>
          )}
          {!isLoading && !error && notifications.length === 0 && renderEmpty()}
          {!isLoading && !error && notifications.length > 0 && renderNotifications()}
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
              ariaLabel="Notifications pagination"
              id="notifications-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};

NotificationList.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

NotificationList.defaultProps = {
  className: '',
  id: undefined,
};

export default NotificationList;