import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import GlassboxProvider from '../../context/GlassboxContext.jsx';
import NotificationProvider from '../../context/NotificationContext.jsx';
import WidgetCustomizationProvider from '../../context/WidgetCustomizationContext.jsx';
import HeaderBar from './HeaderBar.jsx';
import SidebarNav from './SidebarNav.jsx';
import SessionTimeoutWarning from '../auth/SessionTimeoutWarning.jsx';
import ErrorBoundary from '../ui/ErrorBoundary.jsx';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * DashboardLayout component.
 * Main application layout wrapper that composes HeaderBar, SidebarNav, and page
 * content area using HB CSS page layout structure. Manages responsive sidebar
 * toggle state. Wraps content in ErrorBoundary, GlassboxContext, NotificationContext,
 * and WidgetCustomizationContext. Implements smooth scroll behavior on route changes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content to render in the main content area
 * @param {string} [props.className] - Additional CSS class names to append to the content area
 * @param {string} [props.id] - HTML id attribute for the layout container
 * @returns {React.ReactElement} The dashboard layout element
 */
const DashboardLayout = ({ children, className, id }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Closes the sidebar (mobile).
   */
  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  /**
   * Toggles the sidebar open/close (mobile).
   */
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  /**
   * Close sidebar on route change.
   */
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  /**
   * Scroll to top on route change for smooth navigation.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const contentClassName = [
    HB_CLASSES.content,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <GlassboxProvider>
      <NotificationProvider>
        <WidgetCustomizationProvider>
          <div
            id={id || 'dashboard-layout'}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: '#f9fafb',
            }}
          >
            {/* Header */}
            <HeaderBar />

            {/* Session Timeout Warning Modal */}
            <SessionTimeoutWarning />

            {/* Main layout area with sidebar and content */}
            <div
              className={HB_CLASSES.layout}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                minHeight: 0,
              }}
            >
              {/* Sidebar Navigation */}
              <SidebarNav
                isOpen={isSidebarOpen}
                onClose={handleSidebarClose}
                onToggle={handleSidebarToggle}
                id="dashboard-sidebar"
              />

              {/* Page Content Area */}
              <main
                className={contentClassName}
                role="main"
                aria-label="Main content"
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <div className={HB_CLASSES.section}>
                  <div className={HB_CLASSES.wrapper}>
                    <ErrorBoundary
                      title="Something went wrong"
                      message="An unexpected error occurred while loading this page. Please try again or refresh the page. If the problem persists, contact Member Services for assistance."
                      showRetry={true}
                    >
                      {children}
                    </ErrorBoundary>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </WidgetCustomizationProvider>
      </NotificationProvider>
    </GlassboxProvider>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

DashboardLayout.defaultProps = {
  className: '',
  id: undefined,
};

export default DashboardLayout;