import { NOTIFICATION_TYPE, NOTIFICATION_TYPE_LABELS } from '../constants/constants.js';

/**
 * Mock notifications data fixture.
 * Used for development and testing of notification center features including listing, filtering, and mark-as-read.
 *
 * @typedef {Object} Notification
 * @property {string} notificationId - Unique notification identifier
 * @property {string} memberId - Associated member identifier
 * @property {string} type - Notification type (INFO, SUCCESS, WARNING, ERROR, CLAIM_UPDATE, PAYMENT_DUE, DOCUMENT_READY, MESSAGE, SYSTEM)
 * @property {string} typeLabel - Human-readable notification type label
 * @property {string} title - Notification title
 * @property {string} message - Notification message body
 * @property {boolean} isRead - Whether the notification has been read
 * @property {string|null} actionUrl - URL to navigate to when notification is clicked, or null
 * @property {string|null} relatedId - Related entity ID (claim, document, etc.) or null
 * @property {string} createdAt - Notification creation timestamp (ISO 8601)
 * @property {string} updatedAt - Notification last update timestamp (ISO 8601)
 */

export const notificationsData = [
  {
    notificationId: 'NTF-2024-00001',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.CLAIM_UPDATE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.CLAIM_UPDATE],
    title: 'Claim CLM123456 Approved',
    message: 'Your medical claim CLM123456 for services on 03/01/2024 has been approved. Your responsibility is $200.00.',
    isRead: true,
    actionUrl: '/claims/CLM-2024-00001',
    relatedId: 'CLM-2024-00001',
    createdAt: '2024-03-12T14:30:00Z',
    updatedAt: '2024-03-12T15:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00002',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.CLAIM_UPDATE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.CLAIM_UPDATE],
    title: 'Claim CLM123461 Denied',
    message: 'Your medical claim CLM123461 for services on 04/22/2024 has been denied. Reason: Prior authorization was not obtained. You may file an appeal within 180 days.',
    isRead: true,
    actionUrl: '/claims/CLM-2024-00006',
    relatedId: 'CLM-2024-00006',
    createdAt: '2024-05-05T10:15:00Z',
    updatedAt: '2024-05-05T11:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00003',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.CLAIM_UPDATE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.CLAIM_UPDATE],
    title: 'Claim CLM123460 In Review',
    message: 'Your medical claim CLM123460 for services on 05/15/2024 is currently under review. Additional documentation may be requested.',
    isRead: false,
    actionUrl: '/claims/CLM-2024-00005',
    relatedId: 'CLM-2024-00005',
    createdAt: '2024-05-22T08:00:00Z',
    updatedAt: '2024-05-22T08:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00004',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.CLAIM_UPDATE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.CLAIM_UPDATE],
    title: 'Additional Information Needed - CLM123467',
    message: 'We need additional information from your provider to process claim CLM123467. Please allow 10-15 business days for processing.',
    isRead: false,
    actionUrl: '/claims/CLM-2024-00012',
    relatedId: 'CLM-2024-00012',
    createdAt: '2024-05-30T09:00:00Z',
    updatedAt: '2024-05-30T09:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00005',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.DOCUMENT_READY,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.DOCUMENT_READY],
    title: 'EOB Available - Claim CLM123456',
    message: 'Your Explanation of Benefits for claim CLM123456 is now available for download in the Document Center.',
    isRead: true,
    actionUrl: '/documents',
    relatedId: 'DOC-EOB-00001',
    createdAt: '2024-03-13T10:00:00Z',
    updatedAt: '2024-03-13T10:30:00Z',
  },
  {
    notificationId: 'NTF-2024-00006',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.DOCUMENT_READY,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.DOCUMENT_READY],
    title: '1095-B Tax Form Available',
    message: 'Your IRS Form 1095-B for tax year 2023 is now available for download in the Document Center.',
    isRead: true,
    actionUrl: '/documents',
    relatedId: 'DOC-TAX-00001',
    createdAt: '2024-01-31T07:00:00Z',
    updatedAt: '2024-01-31T08:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00007',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.DOCUMENT_READY,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.DOCUMENT_READY],
    title: 'EOB Available - Claim CLM123461',
    message: 'Your Explanation of Benefits for denied claim CLM123461 is now available. Review the document for appeal instructions.',
    isRead: false,
    actionUrl: '/documents',
    relatedId: 'DOC-EOB-00006',
    createdAt: '2024-05-06T10:15:00Z',
    updatedAt: '2024-05-06T10:15:00Z',
  },
  {
    notificationId: 'NTF-2024-00008',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.PAYMENT_DUE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.PAYMENT_DUE],
    title: 'Payment Due - Premium',
    message: 'Your monthly premium payment of $485.00 is due on 07/01/2024. Please make your payment to avoid a lapse in coverage.',
    isRead: false,
    actionUrl: '/payments',
    relatedId: null,
    createdAt: '2024-06-15T08:00:00Z',
    updatedAt: '2024-06-15T08:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00009',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.PAYMENT_DUE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.PAYMENT_DUE],
    title: 'Outstanding Balance - $200.00',
    message: 'You have an outstanding balance of $200.00 for claim CLM123456. Please visit the Payments section to make a payment.',
    isRead: true,
    actionUrl: '/payments',
    relatedId: 'CLM-2024-00001',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-16T10:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00010',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.MESSAGE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.MESSAGE],
    title: 'New Message from Member Services',
    message: 'You have a new message from Member Services regarding your recent inquiry. Please check your Messages inbox.',
    isRead: false,
    actionUrl: '/messages',
    relatedId: null,
    createdAt: '2024-06-01T14:30:00Z',
    updatedAt: '2024-06-01T14:30:00Z',
  },
  {
    notificationId: 'NTF-2024-00011',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.MESSAGE,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.MESSAGE],
    title: 'Appeal Update - CLM123468',
    message: 'You have a new message regarding your appeal for claim CLM123468. Please check your Messages inbox for details.',
    isRead: false,
    actionUrl: '/messages',
    relatedId: 'CLM-2024-00013',
    createdAt: '2024-04-15T11:00:00Z',
    updatedAt: '2024-04-15T11:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00012',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.INFO,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.INFO],
    title: 'Welcome to HealthFirst Member Portal',
    message: 'Welcome, Jane! Your HealthFirst PPO 5000 plan is active. Explore your benefits, view claims, and manage your coverage all in one place.',
    isRead: true,
    actionUrl: '/dashboard',
    relatedId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00013',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.INFO,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.INFO],
    title: 'Annual Benefits Update',
    message: 'Your annual benefits update notice is now available. Review changes to your health plan benefits for the upcoming plan year.',
    isRead: true,
    actionUrl: '/documents',
    relatedId: 'DOC-CORR-00004',
    createdAt: '2024-04-15T08:00:00Z',
    updatedAt: '2024-04-15T09:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00014',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.SUCCESS,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.SUCCESS],
    title: 'ID Card Request Confirmed',
    message: 'Your request for a new medical ID card has been received. You can expect to receive your new card within 7-10 business days.',
    isRead: true,
    actionUrl: '/coverage',
    relatedId: 'IDC-2024-00001',
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2024-02-10T13:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00015',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.SUCCESS,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.SUCCESS],
    title: 'Preventive Care Claim Processed',
    message: 'Your preventive care visit on 02/01/2024 has been processed at 100% coverage. No member cost share applies.',
    isRead: true,
    actionUrl: '/claims/CLM-2024-00010',
    relatedId: 'CLM-2024-00010',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-02-10T11:30:00Z',
  },
  {
    notificationId: 'NTF-2024-00016',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.WARNING,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.WARNING],
    title: 'Prior Authorization Required',
    message: 'A prior authorization is required for your upcoming MRI procedure. Please contact your provider or call the pre-authorization line at 1-800-555-0130.',
    isRead: false,
    actionUrl: null,
    relatedId: null,
    createdAt: '2024-05-08T10:00:00Z',
    updatedAt: '2024-05-08T10:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00017',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.WARNING,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.WARNING],
    title: 'Appeal Deadline Approaching',
    message: 'The deadline to appeal denied claim CLM123461 is approaching. You have until 11/01/2024 to submit your appeal.',
    isRead: false,
    actionUrl: '/claims/CLM-2024-00006',
    relatedId: 'CLM-2024-00006',
    createdAt: '2024-06-10T08:00:00Z',
    updatedAt: '2024-06-10T08:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00018',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.SYSTEM,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.SYSTEM],
    title: 'Scheduled Maintenance',
    message: 'The member portal will undergo scheduled maintenance on 06/20/2024 from 2:00 AM to 6:00 AM ET. Some features may be temporarily unavailable.',
    isRead: false,
    actionUrl: null,
    relatedId: null,
    createdAt: '2024-06-17T12:00:00Z',
    updatedAt: '2024-06-17T12:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00019',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.SYSTEM,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.SYSTEM],
    title: 'Privacy Policy Updated',
    message: 'Our privacy policy has been updated effective 04/01/2024. Please review the updated HIPAA Privacy Notice in the Document Center.',
    isRead: true,
    actionUrl: '/documents',
    relatedId: 'DOC-OTHER-00001',
    createdAt: '2024-04-01T08:00:00Z',
    updatedAt: '2024-04-02T10:00:00Z',
  },
  {
    notificationId: 'NTF-2024-00020',
    memberId: 'HCP-2024-00042',
    type: NOTIFICATION_TYPE.ERROR,
    typeLabel: NOTIFICATION_TYPE_LABELS[NOTIFICATION_TYPE.ERROR],
    title: 'Payment Failed',
    message: 'Your recent payment attempt could not be processed. Please update your payment method and try again, or contact Member Services at 1-800-555-0199.',
    isRead: false,
    actionUrl: '/payments',
    relatedId: null,
    createdAt: '2024-06-05T16:00:00Z',
    updatedAt: '2024-06-05T16:00:00Z',
  },
];

/**
 * Returns all notifications for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of notification objects for the member
 */
export const getNotificationsByMemberId = (memberId) => {
  return notificationsData.filter((notification) => notification.memberId === memberId);
};

/**
 * Returns all unread notifications for a given member ID.
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of unread notification objects for the member
 */
export const getUnreadNotificationsByMemberId = (memberId) => {
  return notificationsData.filter(
    (notification) => notification.memberId === memberId && !notification.isRead
  );
};

/**
 * Returns a single notification by its notification ID.
 * @param {string} notificationId - The notification identifier
 * @returns {Object|undefined} The notification object or undefined if not found
 */
export const getNotificationById = (notificationId) => {
  return notificationsData.find((notification) => notification.notificationId === notificationId);
};

/**
 * Returns notifications filtered by type for a given member.
 * @param {string} memberId - The member identifier
 * @param {string} type - The notification type to filter by (INFO, SUCCESS, WARNING, ERROR, CLAIM_UPDATE, PAYMENT_DUE, DOCUMENT_READY, MESSAGE, SYSTEM)
 * @returns {Object[]} Array of notification objects matching the type
 */
export const getNotificationsByType = (memberId, type) => {
  return notificationsData.filter(
    (notification) => notification.memberId === memberId && notification.type === type
  );
};

/**
 * Filters notifications by multiple criteria.
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.memberId] - Member ID to filter by
 * @param {string} [filters.type] - Notification type to filter by
 * @param {boolean} [filters.isRead] - Read status to filter by (true for read, false for unread)
 * @param {string} [filters.dateFrom] - Start date (ISO 8601) for created date range
 * @param {string} [filters.dateTo] - End date (ISO 8601) for created date range
 * @param {string} [filters.search] - Search term for title or message (case-insensitive partial match)
 * @param {string} [filters.sortBy] - Sort field ('createdAt', 'type', 'title')
 * @param {string} [filters.sortOrder] - Sort order ('asc' or 'desc')
 * @param {number} [filters.page] - Page number (1-based)
 * @param {number} [filters.pageSize] - Number of items per page
 * @returns {Object} Object with notifications array, pagination info, and total count
 */
export const filterNotifications = (filters = {}) => {
  let results = [...notificationsData];

  if (filters.memberId) {
    results = results.filter((notification) => notification.memberId === filters.memberId);
  }

  if (filters.type) {
    results = results.filter((notification) => notification.type === filters.type);
  }

  if (typeof filters.isRead === 'boolean') {
    results = results.filter((notification) => notification.isRead === filters.isRead);
  }

  if (filters.dateFrom) {
    results = results.filter((notification) => notification.createdAt >= filters.dateFrom);
  }

  if (filters.dateTo) {
    results = results.filter((notification) => notification.createdAt <= filters.dateTo);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    results = results.filter(
      (notification) =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
    );
  }

  const sortBy = filters.sortBy || 'createdAt';
  const sortOrder = filters.sortOrder || 'desc';

  results.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (valA > valB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const totalItems = results.length;
  const pageSize = filters.pageSize || 10;
  const page = filters.page || 1;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const paginatedResults = results.slice(startIndex, startIndex + pageSize);

  return {
    notifications: paginatedResults,
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems,
    },
  };
};

/**
 * Returns a summary of notifications for a given member.
 * @param {string} memberId - The member identifier
 * @returns {Object} Summary object with totalNotifications, unreadCount, readCount, and typeCounts
 */
export const getNotificationsSummary = (memberId) => {
  const memberNotifications = getNotificationsByMemberId(memberId);

  const typeCounts = {};
  Object.values(NOTIFICATION_TYPE).forEach((type) => {
    typeCounts[type] = 0;
  });

  let unreadCount = 0;
  let readCount = 0;

  memberNotifications.forEach((notification) => {
    if (notification.isRead) {
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
 * @param {string} memberId - The member identifier
 * @param {number} [count=5] - Number of recent notifications to return
 * @returns {Object[]} Array of the most recent notification objects
 */
export const getRecentNotifications = (memberId, count = 5) => {
  return getNotificationsByMemberId(memberId)
    .sort((a, b) => {
      if (a.createdAt < b.createdAt) return 1;
      if (a.createdAt > b.createdAt) return -1;
      return 0;
    })
    .slice(0, count);
};

/**
 * Marks all notifications as read for a given member (returns a new array, does not mutate original).
 * @param {string} memberId - The member identifier
 * @returns {Object[]} Array of notification objects with isRead set to true
 */
export const markAllNotificationsAsRead = (memberId) => {
  return notificationsData.map((notification) => {
    if (notification.memberId === memberId && !notification.isRead) {
      return {
        ...notification,
        isRead: true,
        updatedAt: new Date().toISOString(),
      };
    }
    return notification;
  });
};

/**
 * Marks a single notification as read (returns the updated notification, does not mutate original).
 * @param {string} notificationId - The notification identifier
 * @returns {Object|undefined} The updated notification object or undefined if not found
 */
export const markNotificationAsRead = (notificationId) => {
  const notification = getNotificationById(notificationId);
  if (!notification) {
    return undefined;
  }
  return {
    ...notification,
    isRead: true,
    updatedAt: new Date().toISOString(),
  };
};