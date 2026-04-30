import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { HB_CLASSES, ROUTES, SUPPORT } from '../../constants/constants.js';
import SearchBar from '../ui/SearchBar.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import LeavingSiteModal from '../ui/LeavingSiteModal.jsx';

/**
 * HeaderBar component.
 * Global header bar containing HealthCare Payer logo, global SearchBar,
 * support action buttons (Email/Chat/Call), notification bell icon with
 * unread count badge, and user profile dropdown menu. User menu includes
 * member name, Settings link, Admin Panel link (visible only for admin role),
 * and Logout button. Uses HB CSS classes for layout and responsive behavior.
 * Fixed position with scroll-padding-top support.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The header bar element
 */
const HeaderBar = ({ className, id }) => {
  const { user, isAuthenticated, logout, checkIsAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLeavingSiteOpen, setIsLeavingSiteOpen] = useState(false);
  const [leavingSiteUrl, setLeavingSiteUrl] = useState('');
  const [leavingSiteTitle, setLeavingSiteTitle] = useState('');
  const [leavingSiteCategory, setLeavingSiteCategory] = useState('');

  const userMenuRef = useRef(null);
  const userMenuButtonRef = useRef(null);

  const isAdmin = checkIsAdmin();

  /**
   * Closes the user menu when clicking outside.
   */
  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  /**
   * Closes the user menu on Escape key.
   */
  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        if (userMenuButtonRef.current) {
          userMenuButtonRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

  /**
   * Close user menu on route change.
   */
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  /**
   * Toggles the user profile dropdown menu.
   */
  const handleToggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((prev) => !prev);
  }, []);

  /**
   * Handles logout action.
   */
  const handleLogout = useCallback(() => {
    setIsUserMenuOpen(false);
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logout, navigate]);

  /**
   * Navigates to a route and closes the user menu.
   * @param {string} route - The route to navigate to
   */
  const handleNavigate = useCallback((route) => {
    setIsUserMenuOpen(false);
    navigate(route);
  }, [navigate]);

  /**
   * Handles notification bell click.
   */
  const handleNotificationsClick = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  /**
   * Handles external link click by opening the leaving site modal.
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
   * Handles logo click to navigate to dashboard.
   */
  const handleLogoClick = useCallback(() => {
    navigate(ROUTES.DASHBOARD);
  }, [navigate]);

  /**
   * Returns user initials for avatar.
   * @returns {string} Two-character initials
   */
  const getUserInitials = () => {
    if (!user) {
      return '';
    }
    const first = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const last = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  };

  if (!isAuthenticated) {
    return null;
  }

  const headerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <>
      <header
        id={id || 'header-bar'}
        className={headerClassName || undefined}
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          width: '100%',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          className="fluid-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            height: '3.5rem',
          }}
        >
          {/* Logo / Branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexShrink: 0,
              cursor: 'pointer',
            }}
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            aria-label="Go to dashboard"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                borderRadius: '9999px',
                backgroundColor: '#e6f0fa',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0069cc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#0069cc',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              }}
              className="tablet:hb-block"
            >
              HealthFirst
            </span>
          </div>

          {/* Search Bar (hidden on small screens) */}
          <div
            style={{
              flex: 1,
              maxWidth: '28rem',
              minWidth: 0,
              display: 'none',
            }}
            className="tablet:hb-block"
          >
            <SearchBar
              id="header-search"
              placeholder="Search the portal..."
              size="sm"
            />
          </div>

          {/* Right side actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
            }}
          >
            {/* Support Actions */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.125rem',
              }}
              className="desktop:hb-flex"
            >
              {/* Email Support */}
              <a
                href={`mailto:${SUPPORT.email}`}
                aria-label={`Email support at ${SUPPORT.email}`}
                title="Email Support"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.25rem',
                  height: '2.25rem',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#0069cc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>

              {/* Chat Support */}
              <button
                type="button"
                aria-label="Open live chat support"
                title="Live Chat"
                onClick={() => handleExternalLink(SUPPORT.chatUrl, 'Member Services Chat', 'support')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.25rem',
                  height: '2.25rem',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#0069cc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>

              {/* Phone Support */}
              <a
                href={`tel:${SUPPORT.phone}`}
                aria-label={`Call support at ${SUPPORT.phone}`}
                title={`Call ${SUPPORT.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.25rem',
                  height: '2.25rem',
                  padding: 0,
                  background: 'none',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#0069cc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>

              {/* Divider */}
              <div
                style={{
                  width: '1px',
                  height: '1.5rem',
                  backgroundColor: '#e5e7eb',
                  margin: '0 0.25rem',
                }}
                aria-hidden="true"
              />
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={handleNotificationsClick}
              aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
              title="Notifications"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.25rem',
                height: '2.25rem',
                padding: 0,
                background: 'none',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                color: '#6b7280',
                transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
                e.currentTarget.style.color = '#0069cc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#6b7280';
              }}
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
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0.125rem',
                    right: '0.125rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1rem',
                    height: '1rem',
                    padding: '0 0.25rem',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    color: '#ffffff',
                    backgroundColor: '#ef4444',
                    borderRadius: '9999px',
                    border: '2px solid #ffffff',
                    boxSizing: 'content-box',
                  }}
                  aria-hidden="true"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div
              ref={userMenuRef}
              style={{
                position: 'relative',
              }}
            >
              <button
                ref={userMenuButtonRef}
                type="button"
                onClick={handleToggleUserMenu}
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-controls="header-user-menu"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  background: 'none',
                  border: '1px solid transparent',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease-in-out, border-color 0.15s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  if (!isUserMenuOpen) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Avatar
                  initials={getUserInitials()}
                  size="sm"
                  variant="brand"
                  ariaLabel={user ? `${user.displayName || user.firstName || 'User'} avatar` : 'User avatar'}
                />
                <span
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#374151',
                    maxWidth: '8rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'none',
                  }}
                  className="tablet:hb-block"
                >
                  {user ? (user.firstName || 'Member') : 'Member'}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    flexShrink: 0,
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease-in-out',
                    display: 'none',
                  }}
                  className="tablet:hb-block"
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  id="header-user-menu"
                  role="menu"
                  aria-label="User menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 50,
                    marginTop: '0.375rem',
                    minWidth: '14rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    animation: 'hb-fade-in 0.1s ease-out',
                  }}
                >
                  {/* User info header */}
                  {user && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#111827',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Member'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginTop: '0.125rem',
                        }}
                      >
                        {user.memberId || ''}
                      </div>
                    </div>
                  )}

                  {/* Menu items */}
                  <div
                    style={{
                      padding: '0.25rem 0',
                    }}
                  >
                    {/* Dashboard */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleNavigate(ROUTES.DASHBOARD)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.1s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                      <span>Dashboard</span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleNavigate(ROUTES.SETTINGS)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#374151',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.1s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: 0 }}
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                      <span>Settings</span>
                    </button>

                    {/* Admin Panel (admin only) */}
                    {isAdmin && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleNavigate(ROUTES.ADMIN)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          width: '100%',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          color: '#374151',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.1s ease-in-out',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          style={{ flexShrink: 0 }}
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>Admin Panel</span>
                      </button>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      borderTop: '1px solid #e5e7eb',
                    }}
                    aria-hidden="true"
                  />

                  {/* Logout */}
                  <div
                    style={{
                      padding: '0.25rem 0',
                    }}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.1s ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: 0 }}
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Leaving Site Modal */}
      <LeavingSiteModal
        isOpen={isLeavingSiteOpen}
        onClose={handleCloseLeavingSite}
        url={leavingSiteUrl}
        title={leavingSiteTitle}
        category={leavingSiteCategory}
        id="header-leaving-site-modal"
      />
    </>
  );
};

HeaderBar.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

HeaderBar.defaultProps = {
  className: '',
  id: undefined,
};

export default HeaderBar;