import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { NAV_ITEMS, HB_CLASSES, ROUTES } from '../../constants/constants.js';

/**
 * Icon component that renders SVG icons for navigation items.
 * @param {Object} props
 * @param {string} props.name - Icon identifier name
 * @param {number} [props.size=20] - Icon size in pixels
 * @returns {React.ReactElement} SVG icon element
 */
const NavIcon = ({ name, size }) => {
  const iconProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (name) {
    case 'home':
      return (
        <svg {...iconProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'file-text':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'search':
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'folder':
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg {...iconProps}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...iconProps}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'users':
      return (
        <svg {...iconProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'activity':
      return (
        <svg {...iconProps}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case 'pill':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
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

NavIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};

NavIcon.defaultProps = {
  size: 20,
};

/**
 * SidebarNav component.
 * Left sidebar navigation implementing HB CSS page-sidebar classes.
 * Renders navigation menu items with icons, highlights the active route,
 * and supports responsive behavior (hidden on mobile with hamburger toggle,
 * visible on desktop). Fully accessible with ARIA navigation role and
 * keyboard support.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen=false] - Whether the sidebar is open on mobile
 * @param {Function} [props.onClose] - Callback invoked when the sidebar should close (mobile overlay click or nav item click)
 * @param {Function} [props.onToggle] - Callback invoked to toggle sidebar open/close
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The sidebar navigation element
 */
const SidebarNav = ({ isOpen, onClose, onToggle, className, id }) => {
  const { user, checkAnyRole } = useAuth();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const firstNavItemRef = useRef(null);

  /**
   * Filters navigation items based on the current user's roles.
   * @returns {Object[]} Array of navigation items the user can access
   */
  const getFilteredNavItems = useCallback(() => {
    if (!user) {
      return [];
    }

    return NAV_ITEMS.filter((item) => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return checkAnyRole(item.roles);
    });
  }, [user, checkAnyRole]);

  const filteredNavItems = getFilteredNavItems();

  /**
   * Determines if a navigation item is currently active based on the route.
   * @param {string} path - The navigation item path
   * @returns {boolean} True if the path matches the current location
   */
  const isActiveRoute = useCallback((path) => {
    if (path === ROUTES.DASHBOARD && location.pathname === ROUTES.DASHBOARD) {
      return true;
    }

    if (path !== ROUTES.DASHBOARD && location.pathname.startsWith(path)) {
      return true;
    }

    return false;
  }, [location.pathname]);

  /**
   * Handles navigation item click.
   * Closes the sidebar on mobile after navigation.
   */
  const handleNavItemClick = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  /**
   * Handles overlay click to close the sidebar on mobile.
   * @param {React.MouseEvent} e - The click event
   */
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }
  }, [onClose]);

  /**
   * Handles keyboard events for the sidebar.
   * Closes on Escape key press.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  /**
   * Focus the first nav item when sidebar opens on mobile.
   */
  useEffect(() => {
    if (isOpen && firstNavItemRef.current) {
      const timer = setTimeout(() => {
        if (firstNavItemRef.current) {
          firstNavItemRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /**
   * Prevents body scroll when mobile sidebar is open.
   */
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const sidebarClassName = [
    HB_CLASSES.sidebar,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Returns the style for a navigation link based on active state.
   * @param {boolean} isActive - Whether the link is active
   * @returns {Object} Inline style object
   */
  const getNavLinkStyle = (isActive) => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.625rem 1rem',
      fontSize: '0.875rem',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#0069cc' : '#374151',
      backgroundColor: isActive ? '#e6f0fa' : 'transparent',
      borderRadius: '0.375rem',
      textDecoration: 'none',
      transition: 'all 0.15s ease-in-out',
      cursor: 'pointer',
      border: 'none',
      width: '100%',
      lineHeight: 1.5,
      userSelect: 'none',
      borderLeft: isActive ? '3px solid #0069cc' : '3px solid transparent',
    };
  };

  /**
   * Renders the navigation list.
   * @returns {React.ReactElement} The navigation list element
   */
  const renderNavList = () => {
    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.125rem',
        }}
        role="list"
      >
        {filteredNavItems.map((item, index) => {
          const active = isActiveRoute(item.path);

          return (
            <li key={item.path} role="listitem">
              <NavLink
                to={item.path}
                ref={index === 0 ? firstNavItemRef : undefined}
                onClick={handleNavItemClick}
                style={getNavLinkStyle(active)}
                aria-current={active ? 'page' : undefined}
                aria-label={item.label}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#0069cc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
                onFocus={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#0069cc';
                  }
                }}
                onBlur={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
              >
                <NavIcon name={item.icon} size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    );
  };

  /**
   * Renders the sidebar content (logo + nav).
   * @returns {React.ReactElement} The sidebar content
   */
  const renderSidebarContent = () => {
    return (
      <div
        ref={sidebarRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          overflowY: 'auto',
        }}
        className="hb-scrollbar-thin"
      >
        {/* Sidebar header / branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1rem 0.75rem 1rem',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0069cc',
                lineHeight: 1.2,
              }}
            >
              HealthFirst
            </span>
          </div>

          {/* Close button (mobile only) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2rem',
              height: '2rem',
              padding: 0,
              background: 'none',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
            }}
            className="desktop:hb-hidden"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#111827';
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
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          role="navigation"
          style={{
            flex: 1,
            padding: '0.75rem 0.5rem',
            overflowY: 'auto',
          }}
        >
          {renderNavList()}
        </nav>

        {/* Sidebar footer */}
        <div
          style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 0',
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
                  color: '#0069cc',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
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
                    fontSize: '0.6875rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.memberId || ''}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay + sidebar */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'flex',
          }}
          className="desktop:hb-hidden"
          role="presentation"
        >
          {/* Overlay backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              animation: 'hb-fade-in 0.15s ease-out',
            }}
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Mobile sidebar panel */}
          <div
            id={id ? `${id}-mobile` : 'sidebar-nav-mobile'}
            style={{
              position: 'relative',
              width: '16.5rem',
              maxWidth: '80vw',
              height: '100%',
              zIndex: 41,
              animation: 'hb-slide-in-left 0.2s ease-out',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Desktop sidebar (always visible) */}
      <aside
        id={id || 'sidebar-nav'}
        className={sidebarClassName}
        style={{
          display: 'none',
          flexShrink: 0,
          height: '100%',
          position: 'sticky',
          top: 0,
          alignSelf: 'flex-start',
        }}
      >
        <style>{`
          @media (min-width: 1024px) {
            #${id || 'sidebar-nav'} {
              display: block !important;
            }
          }
          @keyframes hb-slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
        {renderSidebarContent()}
      </aside>

      {/* Hamburger toggle button (mobile only) */}
      {!isOpen && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls={id || 'sidebar-nav'}
          className="desktop:hb-hidden"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '1.5rem',
            zIndex: 30,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '3rem',
            height: '3rem',
            padding: 0,
            backgroundColor: '#0069cc',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
            transition: 'background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0054a3';
            e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0069cc';
            e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
          }}
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
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}
    </>
  );
};

SidebarNav.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onToggle: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
};

SidebarNav.defaultProps = {
  isOpen: false,
  onClose: undefined,
  onToggle: undefined,
  className: '',
  id: undefined,
};

export default SidebarNav;