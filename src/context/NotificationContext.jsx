import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext.jsx';
import {
  getNotifications,
  getNotificationDetails,
  markNotificationRead,
  markAllRead,
  getNotificationsSummaryForMember,
  getRecentNotificationsForMember,
  getUnreadNotifications,
  getUnreadCount,
  getNotificationTypeOptions,
  getReadStatusOptions,
  getPageSizeOptions,
  getNotificationsRequiringAttention,
} from '../services/notificationService.js';
import { PAGINATION } from '../constants/constants.js';

/**
 * @typedef {Object} NotificationContextValue
 * @property {Object[]} notifications - Current list of notifications (paginated)
 * @property {number} unreadCount - Number of unread notifications
 * @property {Object|null} summary - Notification summary with counts by type
 * @property {Object} pagination - Pagination state (page, pageSize, totalPages, totalItems)
 * @property {boolean} isLoading - Whether notifications are being loaded
 * @property {string|null} error - Current error message or null
 * @property {Object} filters - Current filter state (type, isRead, search, sortBy, sortOrder)
 * @property {Function} fetchNotifications - Fetches notifications with current filters and pagination
 * @property {Function} markAsRead - Marks a single notification as read by ID
 * @property {Function} markAllAsRead - Marks all notifications as read
 * @property {Function} setFilters - Updates filter state and refetches
 * @property {Function} setPage - Updates current page and refetches
 * @property {Function} setPageSize - Updates page size and refetches
 * @property {Function} refreshNotifications - Refreshes notifications and summary
 * @property {Function} getNotification - Returns a single notification by ID
 * @property {Object[]} recentNotifications - Most recent notifications (up to 5)
 * @property {Object[]} attentionNotifications - Notifications requiring member attention
 * @property {Object[]} notificationTypeOptions - Available notification type filter options
 * @property {Object[]} readStatusOptions - Available read status filter options
 * @property {number[]} pageSizeOptions - Available page size options
 */

const NotificationContext = createContext(null);

/**
 * Custom hook to consume the NotificationContext.
 * Must be used within a NotificationProvider.
 *
 * @returns {NotificationContextValue} The notification context value
 * @throws {Error} If used outside of a NotificationProvider
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider.');
  }
  return context;
};

/**
 * Default filter state for notifications.
 * @type {Object}
 */
const DEFAULT_FILTERS = {
  type: '',
  isRead: null,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  dateFrom: '',
  dateTo: '',
};

/**
 * Notification context provider component.
 * Wraps the application to provide notification state, filtering, pagination,
 * mark-as-read functionality, and summary data.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactElement} The provider component
 */
const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [summary, setSummary] = useState(null);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [attentionNotifications, setAttentionNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGINATION.defaultPageSize,
    totalPages: 0,
    totalItems: 0,
  });
  const [filters, setFiltersState] = useState({ ...DEFAULT_FILTERS });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Returns the current member ID from the authenticated user.
   * @returns {string|null} The member ID or null
   */
  const getMemberId = useCallback(() => {
    if (!user || !user.memberId) {
      return null;
    }
    return user.memberId;
  }, [user]);

  /**
   * Fetches the notification summary and unread count for the current member.
   */
  const fetchSummary = useCallback(() => {
    const memberId = getMemberId();
    if (!memberId) {
      setSummary(null);
      setUnreadCount(0);
      return;
    }

    try {
      const summaryData = getNotificationsSummaryForMember(memberId);
      setSummary(summaryData);
      setUnreadCount(summaryData ? summaryData.unreadCount : 0);
    } catch (err) {
      console.error('[NotificationContext] Error fetching notification summary:', err);
    }
  }, [getMemberId]);

  /**
   * Fetches recent notifications for the current member.
   */
  const fetchRecentNotifications = useCallback(() => {
    const memberId = getMemberId();
    if (!memberId) {
      setRecentNotifications([]);
      return;
    }

    try {
      const recent = getRecentNotificationsForMember(memberId, 5);
      setRecentNotifications(recent);
    } catch (err) {
      console.error('[NotificationContext] Error fetching recent notifications:', err);
    }
  }, [getMemberId]);

  /**
   * Fetches notifications requiring member attention.
   */
  const fetchAttentionNotifications = useCallback(() => {
    const memberId = getMemberId();
    if (!memberId) {
      setAttentionNotifications([]);
      return;
    }

    try {
      const attention = getNotificationsRequiringAttention(memberId);
      setAttentionNotifications(attention);
    } catch (err) {
      console.error('[NotificationContext] Error fetching attention notifications:', err);
    }
  }, [getMemberId]);

  /**
   * Fetches notifications with the current filters and pagination state.
   */
  const fetchNotifications = useCallback(() => {
    const memberId = getMemberId();
    if (!memberId) {
      setNotifications([]);
      setPagination({
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      });
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        memberId,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };

      if (filters.type) {
        params.type = filters.type;
      }

      if (filters.isRead !== null && filters.isRead !== undefined && filters.isRead !== '') {
        params.isRead = filters.isRead;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.sortOrder) {
        params.sortOrder = filters.sortOrder;
      }

      if (filters.dateFrom) {
        params.dateFrom = filters.dateFrom;
      }

      if (filters.dateTo) {
        params.dateTo = filters.dateTo;
      }

      const result = getNotifications(params);

      if (result.error) {
        setError(result.error);
        setNotifications([]);
        setPagination({
          page: 1,
          pageSize: pagination.pageSize,
          totalPages: 0,
          totalItems: 0,
        });
      } else {
        setNotifications(result.notifications);
        setPagination(result.pagination);
        if (result.summary) {
          setSummary(result.summary);
          setUnreadCount(result.summary.unreadCount);
        }
      }
    } catch (err) {
      console.error('[NotificationContext] Error fetching notifications:', err);
      setError('Unable to load notifications. Please try again.');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, [getMemberId, pagination.page, pagination.pageSize, filters]);

  /**
   * Marks a single notification as read by its notification ID.
   *
   * @param {string} notificationId - The notification identifier
   * @returns {Object} Result with success status and updated notification
   */
  const markAsRead = useCallback((notificationId) => {
    if (!notificationId) {
      return {
        success: false,
        error: 'notificationId is required.',
        notification: null,
      };
    }

    const memberId = getMemberId();

    try {
      const result = markNotificationRead(notificationId, { memberId });

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );

        fetchSummary();
        fetchRecentNotifications();
        fetchAttentionNotifications();
      }

      return result;
    } catch (err) {
      console.error('[NotificationContext] Error marking notification as read:', err);
      return {
        success: false,
        error: 'Unable to mark notification as read.',
        notification: null,
      };
    }
  }, [getMemberId, fetchSummary, fetchRecentNotifications, fetchAttentionNotifications]);

  /**
   * Marks all notifications as read for the current member.
   *
   * @returns {Object} Result with success status and updated count
   */
  const markAllAsRead = useCallback(() => {
    const memberId = getMemberId();
    if (!memberId) {
      return {
        success: false,
        error: 'No authenticated user.',
        updatedCount: 0,
      };
    }

    try {
      const result = markAllRead(memberId);

      if (result.success) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );

        setUnreadCount(0);
        fetchSummary();
        fetchRecentNotifications();
        fetchAttentionNotifications();
      }

      return result;
    } catch (err) {
      console.error('[NotificationContext] Error marking all notifications as read:', err);
      return {
        success: false,
        error: 'Unable to mark all notifications as read.',
        updatedCount: 0,
      };
    }
  }, [getMemberId, fetchSummary, fetchRecentNotifications, fetchAttentionNotifications]);

  /**
   * Updates the filter state and resets to page 1.
   *
   * @param {Object} newFilters - Partial filter object to merge with current filters
   */
  const setFilters = useCallback((newFilters) => {
    if (!newFilters || typeof newFilters !== 'object') {
      return;
    }

    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));

    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, []);

  /**
   * Updates the current page number.
   *
   * @param {number} page - The page number (1-based)
   */
  const setPage = useCallback((page) => {
    if (typeof page !== 'number' || page < 1) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  /**
   * Updates the page size and resets to page 1.
   *
   * @param {number} pageSize - The number of items per page
   */
  const setPageSize = useCallback((pageSize) => {
    if (typeof pageSize !== 'number' || pageSize < 1) {
      return;
    }

    setPagination((prev) => ({
      ...prev,
      pageSize,
      page: 1,
    }));
  }, []);

  /**
   * Refreshes all notification data (list, summary, recent, attention).
   */
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
    fetchSummary();
    fetchRecentNotifications();
    fetchAttentionNotifications();
  }, [fetchNotifications, fetchSummary, fetchRecentNotifications, fetchAttentionNotifications]);

  /**
   * Returns a single notification by its notification ID.
   *
   * @param {string} notificationId - The notification identifier
   * @returns {Object|null} Enriched notification object or null if not found
   */
  const getNotification = useCallback((notificationId) => {
    if (!notificationId) {
      return null;
    }

    try {
      return getNotificationDetails(notificationId);
    } catch (err) {
      console.error('[NotificationContext] Error getting notification details:', err);
      return null;
    }
  }, []);

  /**
   * Initialize notifications when user authenticates.
   */
  useEffect(() => {
    if (isAuthenticated && user && user.memberId) {
      fetchNotifications();
      fetchSummary();
      fetchRecentNotifications();
      fetchAttentionNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setSummary(null);
      setRecentNotifications([]);
      setAttentionNotifications([]);
      setPagination({
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      });
      setFiltersState({ ...DEFAULT_FILTERS });
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  /**
   * Refetch notifications when filters or pagination change.
   */
  useEffect(() => {
    if (isAuthenticated && user && user.memberId) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page, pagination.pageSize]);

  /**
   * Memoized notification type options.
   */
  const notificationTypeOptions = useMemo(() => {
    return getNotificationTypeOptions();
  }, []);

  /**
   * Memoized read status options.
   */
  const readStatusOptions = useMemo(() => {
    return getReadStatusOptions();
  }, []);

  /**
   * Memoized page size options.
   */
  const pageSizeOptions = useMemo(() => {
    return getPageSizeOptions();
  }, []);

  const contextValue = useMemo(() => ({
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
    refreshNotifications,
    getNotification,
    recentNotifications,
    attentionNotifications,
    notificationTypeOptions,
    readStatusOptions,
    pageSizeOptions,
  }), [
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
    refreshNotifications,
    getNotification,
    recentNotifications,
    attentionNotifications,
    notificationTypeOptions,
    readStatusOptions,
    pageSizeOptions,
  ]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { NotificationContext };
export default NotificationProvider;