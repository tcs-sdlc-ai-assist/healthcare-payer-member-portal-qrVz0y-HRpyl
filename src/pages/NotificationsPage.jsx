import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import NotificationList from '../components/notifications/NotificationList.jsx';
import SupportLinks from '../components/notifications/SupportLinks.jsx';
import { ROUTES } from '../constants/constants.js';

/**
 * NotificationsPage component.
 * Notifications page composing NotificationList and SupportLinks components.
 * Uses HB CSS page-content layout and grid classes. Tags page view via
 * Glassbox on mount.
 *
 * @returns {React.ReactElement} The notifications page element
 */
const NotificationsPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Notifications',
      route: ROUTES.DASHBOARD,
    });
  }, [tagPageViewed]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Notification List */}
      <NotificationList id="notifications-page-list" />

      {/* Support Links Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          Need Help?
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#6b7280',
            lineHeight: 1.5,
          }}
        >
          Contact Member Services for assistance with your notifications, claims, or account.
        </p>
        <SupportLinks
          id="notifications-page-support-links"
          layout="horizontal"
          size="md"
          showLabels={true}
          showDescriptions={false}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;