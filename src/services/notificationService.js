/**
 * Notification business logic service for the Healthcare Member Portal.
 * Provides getNotifications (with filtering, pagination, sorting), markAllRead,
 * markNotificationRead, and notification summary functions.
 * Consumes notificationsData fixture and persists read state via storage utility.
 *
 * @module notificationService
 */

import {
  notificationsData,
  getNotificationsByMemberId,
  getUnreadNotificationsByMemberId,
  getNotificationById,
  getNotificationsByType,
  filterNotifications,
  getNotificationsSummary,
  getRecentNotifications,
} from '../data/notificationsData.js';
import { logEvent, AUDIT_ACTIONS } from '../services/auditLogger.js';
import { getItem, setItem } from '../utils/storage.js';
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_ALERT_CLASS,
  PAGINATION,
} from '../constants/constants.js';
import { formatDate, formatRelativeDate } from '../utils/formatters.js';

/**
 * Storage key for persisted notification read states.
 * @type {string}
 */
const READ_STATE_STORAGE_KEY = 'hcp_notification_read_state';

/**
 * Retrieves the persisted read state map from storage.
 * @returns {Object.<string, boolean>} Map of notificationId to read state
 */
const getPersistedReadState = () => {
  return getItem(READ_STATE_STORAGE_KEY, {});
};

/**
 * Persists the read state map to storage.
 * @param {Object.<string, boolean>} readState - Map of notificationId to read state
 * @returns {boolean} True if persisted successfully
 */
const persistReadState = (readState) => {
  return setItem(READ_STATE_STORAGE_KEY, readState);
};

/**
 * Resolves the effective read state for a notification by merging
 * the fixture data with any persisted overrides from storage.
 * @param {Object} notification - The notification object
 * @returns {boolean} The effective isRead state
 */
const resolveReadState = (notification) => {
  if (!notification) {
    return false;
  }

  const persistedState = getPersistedReadState();

  if (Object.prototype.hasOwnProperty.call(persistedState, notification.notificationId)) {
    return persistedState[notification.notificationId];
  }

  return notification.isRead;
};

/**
 * Enriches a notification object with computed display properties.
 *
 * @param {Object} notification - The raw notification data object
 * @returns {Object} Enriched notification object with additional display properties
 */
const enrichNotification = (notification) => {
  if (!notification) {
    return null;
  }

  const effectiveIsRead = resolveReadState(notification);

  return {
    ...notification,
    isRead: effectiveIsRead,
    typeLabel: NOTIFICATION_TYPE_LABELS[notification.type] || notification.type,
    alertClass: NOTIFICATION_ALERT_CLASS[notification.type] || 'hb-alert-info',
    formattedCreatedAt: formatDate(notification.createdAt, { format: 'MM/DD/YYYY hh:mm A' }),
    formattedDate: formatDate(notification.createdAt),
    relativeDate: formatRelativeDate(notification.createdAt),
    hasAction: notification.actionUrl !== null,
    hasRelatedEntity: notification.relatedId !== null,
  };
};

/**
 * Retrieves a paginated, filtered, and sorted list of notifications for a member.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.memberId - The member identifier (required)
 * @param {string} [params.type] - Notification type filter (INFO, SUCCESS, WARNING, ERROR, CLAIM_UPDATE, etc.)
 * @param {boolean} [params.isRead] - Read status filter (true for read, false for unread)
 * @param {string} [params.dateFrom] - Start date (ISO 8601) for created date range
 * @param {string} [params.dateTo] - End date (ISO 8601) for created date range
 * @param {string} [params.search] - Search term for title or message (case-insensitive partial match)
 * @param {string} [params.sortBy] - Sort field ('createdAt', 'type', 'title')
 * @param {string} [params.sortOrder] - Sort order ('asc' or 'desc')
 * @param {number} [params.page=1] - Page number (1-based)
 * @param {number} [params.pageSize=10] - Number of items per page
 * @returns {Object} Object with notifications array, pagination info, summary, and error
 */
export const getNotifications = (params = {}) => {
  if (!params.memberId) {
    return {
      notifications: [],
      pagination: {
        page: 1,
        pageSize: PAGINATION.defaultPageSize,
        totalPages: 0,
        totalItems: 0,
      },
      summary: null,
      error: 'memberId is required.',
    };
  }

  const filters = {
    memberId: params.memberId,
  };

  if (params.type) {
    filters.type = params.type;
  }

  if (typeof params.isRead === 'boolean') {
    filters.isRead = params.isRead;
  }

  if (params.dateFrom) {
    filters.dateFrom = params.dateFrom;
  }

  if (params.dateTo) {
    filters.dateTo = params.dateTo;
  }

  if (params.search) {
    filters.search = params.search;
  }

  if (params.sortBy) {
    filters.sortBy = params.sortBy;
  }

  if (params.sortOrder) {
    filters.sortOrder = params.sortOrder;
  }

  const page = params.page && params.page > 0 ? params.page : 1;
  const pageSize = params.pageSize && params.pageSize > 0 ? params.pageSize : PAGINATION.defaultPageSize;

  filters.page = page;
  filters.pageSize = pageSize;

  const result = filterNotifications(filters);

  const enrichedNotifications = result.notifications.map((notification) => enrichNotification(notification));

  // Reapply isRead filter after resolving persisted state if needed
  let finalNotifications = enrichedNotifications;
  if (typeof params.isRead === 'boolean') {
    finalNotifications = enrichedNotifications.filter(
      (notification) => notification.isRead === params.isRead
    );
  }

  const summary = getNotificationsSummaryForMember(params.memberId);

  return {
    notifications: finalNotifications,
    pagination: result.pagination,
    summary,
    error: null,
  };
};

/**
 * Retrieves detailed information for a single notification.
 *
 * @param {string} notificationId - The notification identifier
 * @returns {Object|null} Enriched notification object or null if not found
 */
export const getNotificationDetails = (notificationId) => {
  if (!notificationId) {
    return null;
  }

  const notification = getNotificationById(notificationId);

  if (!notification) {
    return null;
  }

  return enrichNotification(notification);
};

/**
 * Marks a single notification as read and persists the state.
 * Logs an audit event for the action.
 *
 * @param {string} notificationId - The notification identifier
 * @param {Object} [options] - Options
 * @param {string} [options.memberId] - Member ID for audit logging
 * @returns {Object} Result object with success status and updated notification
 */
export const markNotificationRead = (notificationId, options = {}) => {
  if (!notificationId) {
    return {
      success: false,
      error: 'notificationId is required.',
      notification: null,
    };
  }

  const notification = getNotificationById(notificationId);

  if (!notification) {
    return {
      success: false,
      error: 'Notification not found.',
      notification: null,
    };
  }

  const persistedState = getPersistedReadState();
  persistedState[notificationId] = true;
  persistReadState(persistedState);

  if (options.memberId) {
    logEvent({
      memberId: options.memberId,
      action: AUDIT_ACTIONS.NOTIFICATION_READ,
      targetId: notificationId,
      metadata: {
        notificationId,
        type: notification.type,
        title: notification.title,
      },
    });
  }

  return {
    success: true,
    error: null,
    notification: enrichNotification(notification),
  };
};

/**
 * Marks all notifications as read for a given member and persists the state.
 * Logs an audit event for the action.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object} Result object with success status and updated count
 */
export const markAllRead = (memberId) => {
  if (!memberId) {
    return {
      success: false,
      error: 'memberId is required.',
      updatedCount: 0,
    };
  }

  const memberNotifications = getNotificationsByMemberId(memberId);

  if (!memberNotifications || memberNotifications.length === 0) {
    return {
      success: true,
      error: null,
      updatedCount: 0,
    };
  }

  const persistedState = getPersistedReadState();
  let updatedCount = 0;

  memberNotifications.forEach((notification) => {
    const currentlyRead = resolveReadState(notification);
    if (!currentlyRead) {
      persistedState[notification.notificationId] = true;
      updatedCount += 1;
    }
  });

  persistReadState(persistedState);

  logEvent({
    memberId,
    action: AUDIT_ACTIONS.NOTIFICATIONS_MARK_ALL_READ,
    targetId: null,
    metadata: {
      updatedCount,
      totalNotifications: memberNotifications.length,
    },
  });

  return {
    success: true,
    error: null,
    updatedCount,
  };
};

/**
 * Returns a summary of notifications for a given member.
 * Accounts for persisted read state overrides.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object|null} Notifications summary object or null if memberId is not provided
 */
export const getNotificationsSummaryForMember = (memberId) => {
  if (!memberId) {
    return null;
  }

  const memberNotifications = getNotificationsByMemberId(memberId);

  const typeCounts = {};
  Object.values(NOTIFICATION_TYPE).forEach((type) => {
    typeCounts[type] = 0;
  });

  let unreadCount = 0;
  let readCount = 0;

  memberNotifications.forEach((notification) => {
    const effectiveIsRead = resolveReadState(notification);

    if (effectiveIsRead) {
      readCount += 1;
    } else {
      unreadCount += 1;
    }

    if (typeCounts[notification.type] !== undefined) {
      typeCounts[notification.type] += 1;
    }
  });

  return {
    totalNotifications: memberNotifications.length,
    unreadCount,
    readCount,
    typeCounts,
  };
};

/**
 * Returns the most recent notifications for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {number} [count=5] - Number of recent notifications to return
 * @returns {Object[]} Array of enriched recent notification objects
 */
export const getRecentNotificationsForMember = (memberId, count = 5) => {
  if (!memberId) {
    return [];
  }

  const recent = getRecentNotifications(memberId, count);

  return recent.map((notification) => enrichNotification(notification));
};

/**
 * Returns all unread notifications for a given member.
 * Accounts for persisted read state overrides.
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of enriched unread notification objects
 */
export const getUnreadNotifications = (memberId) => {
  if (!memberId) {
    return [];
  }

  const memberNotifications = getNotificationsByMemberId(memberId);

  const unread = memberNotifications.filter((notification) => {
    return !resolveReadState(notification);
  });

  const sorted = [...unread].sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
    return 0;
  });

  return sorted.map((notification) => enrichNotification(notification));
};

/**
 * Returns notifications filtered by type for a given member.
 *
 * @param {string} memberId - The member identifier
 * @param {string} type - The notification type to filter by
 * @returns {Object[]} Array of enriched notification objects matching the type
 */
export const getNotificationsByTypeForMember = (memberId, type) => {
  if (!memberId || !type) {
    return [];
  }

  const notifications = getNotificationsByType(memberId, type);

  return notifications.map((notification) => enrichNotification(notification));
};

/**
 * Returns the unread notification count for a given member.
 * Accounts for persisted read state overrides.
 *
 * @param {string} memberId - The member identifier
 * @returns {number} The number of unread notifications
 */
export const getUnreadCount = (memberId) => {
  if (!memberId) {
    return 0;
  }

  const summary = getNotificationsSummaryForMember(memberId);

  if (!summary) {
    return 0;
  }

  return summary.unreadCount;
};

/**
 * Returns all available notification type options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for notification types
 */
export const getNotificationTypeOptions = () => {
  return Object.entries(NOTIFICATION_TYPE).map(([key, value]) => ({
    value,
    label: NOTIFICATION_TYPE_LABELS[value] || key,
  }));
};

/**
 * Returns all available read status options for filter dropdowns.
 *
 * @returns {Object[]} Array of { value, label } objects for read statuses
 */
export const getReadStatusOptions = () => {
  return [
    { value: true, label: 'Read' },
    { value: false, label: 'Unread' },
  ];
};

/**
 * Returns available page size options for pagination.
 *
 * @returns {number[]} Array of page size options
 */
export const getPageSizeOptions = () => {
  return [...PAGINATION.pageSizeOptions];
};

/**
 * Returns notifications that require member attention (unread warnings, errors, payment due).
 *
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of enriched notifications requiring attention
 */
export const getNotificationsRequiringAttention = (memberId) => {
  if (!memberId) {
    return [];
  }

  const attentionTypes = [
    NOTIFICATION_TYPE.WARNING,
    NOTIFICATION_TYPE.ERROR,
    NOTIFICATION_TYPE.PAYMENT_DUE,
    NOTIFICATION_TYPE.CLAIM_UPDATE,
  ];

  const memberNotifications = getNotificationsByMemberId(memberId);

  const attentionNotifications = memberNotifications.filter((notification) => {
    const effectiveIsRead = resolveReadState(notification);
    return !effectiveIsRead && attentionTypes.includes(notification.type);
  });

  const sorted = [...attentionNotifications].sort((a, b) => {
    if (a.createdAt < b.createdAt) return 1;
    if (a.createdAt > b.createdAt) return -1;
    return 0;
  });

  return sorted.map((notification) => enrichNotification(notification));
};

/**
 * Clears persisted notification read state from storage.
 * Intended for development/testing use only.
 *
 * @returns {boolean} True if cleared successfully
 */
export const clearPersistedReadState = () => {
  return setItem(READ_STATE_STORAGE_KEY, {});
};