import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGlassbox } from '../context/GlassboxContext.jsx';
import { HB_CLASSES, ROUTES, SUPPORT } from '../constants/constants.js';
import Alert from '../components/ui/Alert.jsx';
import Badge from '../components/ui/Badge.jsx';

/**
 * AdminPanelPage component.
 * Admin Panel placeholder page displaying 'Available in a future release' message.
 * Visible only to users with Admin role (enforced by ProtectedRoute). Uses HB CSS
 * alert and typography classes. Shows admin user summary and support contact info.
 *
 * @returns {React.ReactElement} The admin panel page element
 */
const AdminPanelPage = () => {
  const { user } = useAuth();
  const { tagPageViewed } = useGlassbox();

  /**
   * Tag page view on mount.
   */
  useEffect(() => {
    tagPageViewed({
      pageName: 'Admin Panel',
      route: ROUTES.ADMIN,
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
            Admin Panel
          </h1>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              lineHeight: 1.5,
            }}
          >
            Manage users, view system reports, and configure portal settings.
          </p>
        </div>

        <Badge variant="info" size="sm">
          Coming Soon
        </Badge>
      </div>

      {/* Coming Soon Alert */}
      <Alert
        variant="info"
        title="Available in a Future Release"
        dismissible={false}
        role="status"
      >
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          The Admin Panel with user management, system reports, audit logs, and portal configuration will be available in a future release of the HealthFirst Member Portal. In the meantime, please contact the system administrator for any administrative changes.
        </p>
      </Alert>

      {/* Placeholder Content Card */}
      <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
                Administration Tools
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                User management, reports, and system configuration
              </p>
            </div>
          </div>
        </div>

        <div className={HB_CLASSES.cardBody} style={{ padding: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '2rem 1rem',
              textAlign: 'center',
            }}
          >
            {/* Placeholder icon */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '4rem',
                height: '4rem',
                borderRadius: '9999px',
                backgroundColor: '#f3f4f6',
                color: '#9ca3af',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <div>
              <p
                style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#374151',
                  lineHeight: 1.3,
                }}
              >
                Admin Panel Coming Soon
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: 1.5,
                  maxWidth: '28rem',
                }}
              >
                The following administrative features will be available in a future release:
              </p>
            </div>

            {/* Planned features list */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem',
                width: '100%',
                maxWidth: '40rem',
              }}
            >
              {[
                {
                  title: 'User Management',
                  description: 'View, search, and manage member accounts and roles.',
                  icon: (
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
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                },
                {
                  title: 'System Reports',
                  description: 'View claims processing, enrollment, and utilization reports.',
                  icon: (
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
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                },
                {
                  title: 'Audit Logs',
                  description: 'Review user activity, document downloads, and system events.',
                  icon: (
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
                      style={{ flexShrink: 0 }}
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  ),
                },
                {
                  title: 'Portal Configuration',
                  description: 'Configure portal settings, feature flags, and content management.',
                  icon: (
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
                      style={{ flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb',
                    textAlign: 'left',
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
                    {feature.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#111827',
                        lineHeight: 1.3,
                        marginBottom: '0.125rem',
                      }}
                    >
                      {feature.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        lineHeight: 1.4,
                      }}
                    >
                      {feature.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={HB_CLASSES.cardFooter}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span
              style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              Need administrative assistance? Contact support at{' '}
              <a
                href={`tel:${SUPPORT.phone}`}
                aria-label={`Call support at ${SUPPORT.phone}`}
                style={{
                  color: '#0069cc',
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.15s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0054a3';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0069cc';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                {SUPPORT.phone}
              </a>
            </span>
          </div>
          <span
            style={{
              fontSize: '0.6875rem',
              color: '#9ca3af',
              lineHeight: 1.4,
            }}
          >
            or email{' '}
            <a
              href={`mailto:${SUPPORT.email}`}
              aria-label={`Email support at ${SUPPORT.email}`}
              style={{
                color: '#0069cc',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.15s ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0054a3';
                e.currentTarget.style.textDecoration = 'underline';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#0069cc';
                e.currentTarget.style.textDecoration = 'none';
              }}
            >
              {SUPPORT.email}
            </a>
          </span>
        </div>
      </div>

      {/* Current Admin Info Card */}
      {user && (
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div
            className={HB_CLASSES.cardHeader}
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
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
                Your Admin Account
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: 1.4,
                }}
              >
                Current administrator information on file
              </p>
            </div>
          </div>

          <div className={HB_CLASSES.cardBody} style={{ padding: '1rem 1.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Name
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#111827',
                    lineHeight: 1.3,
                  }}
                >
                  {user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '—'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Member ID
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#111827',
                    lineHeight: 1.3,
                    fontFamily: 'monospace',
                  }}
                >
                  {user.memberId || '—'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Role
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                  }}
                >
                  <Badge variant="brand" size="sm">
                    {user.role || '—'}
                  </Badge>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    lineHeight: 1.4,
                  }}
                >
                  Email
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#111827',
                    lineHeight: 1.3,
                  }}
                >
                  {user.email || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanelPage;