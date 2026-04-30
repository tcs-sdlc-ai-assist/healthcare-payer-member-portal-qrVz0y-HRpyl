import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { HB_CLASSES, ROUTES, SUPPORT } from '../constants/constants.js';

/**
 * NotFoundPage component.
 * 404 Not Found page displayed for unmatched routes. Shows a friendly message
 * with a link back to the dashboard (or login if not authenticated).
 * Uses HB CSS typography, button, and card classes.
 *
 * @returns {React.ReactElement} The 404 not found page element
 */
const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles navigation back to the dashboard or login page.
   */
  const handleGoHome = useCallback(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  /**
   * Handles navigation back in browser history.
   */
  const handleGoBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  }, [navigate, handleGoHome]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: isAuthenticated ? '60vh' : '100vh',
        padding: '2rem 1rem',
        backgroundColor: isAuthenticated ? 'transparent' : '#f9fafb',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '32rem',
        }}
      >
        {/* Branding (only when not authenticated / no layout wrapper) */}
        {!isAuthenticated && (
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '9999px',
                backgroundColor: '#e6f0fa',
                marginBottom: '0.75rem',
              }}
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
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
            <h2
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0069cc',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              HealthFirst
            </h2>
          </div>
        )}

        {/* 404 Card */}
        <div className={HB_CLASSES.card} style={{ overflow: 'hidden' }}>
          <div
            className={HB_CLASSES.cardBody}
            style={{ padding: '2.5rem 1.5rem' }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                textAlign: 'center',
              }}
            >
              {/* 404 Icon */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '9999px',
                  backgroundColor: '#fffbeb',
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              {/* 404 Text */}
              <div>
                <p
                  style={{
                    margin: '0 0 0.25rem 0',
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: '#0069cc',
                    lineHeight: 1,
                    letterSpacing: '-0.025em',
                  }}
                >
                  404
                </p>
                <h1
                  style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#111827',
                    lineHeight: 1.2,
                    letterSpacing: '-0.025em',
                  }}
                >
                  Page Not Found
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    lineHeight: 1.5,
                    maxWidth: '24rem',
                  }}
                >
                  The page you are looking for doesn&apos;t exist or has been moved. Please check the URL or navigate back to the {isAuthenticated ? 'dashboard' : 'home page'}.
                </p>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: '0.5rem',
                }}
              >
                <button
                  type="button"
                  className={HB_CLASSES.btnPrimary}
                  onClick={handleGoHome}
                  aria-label={isAuthenticated ? 'Go to dashboard' : 'Go to login page'}
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
                  {isAuthenticated ? 'Go to Dashboard' : 'Go to Home'}
                </button>
                <button
                  type="button"
                  className={HB_CLASSES.btnSecondary}
                  onClick={handleGoBack}
                  aria-label="Go back to previous page"
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
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>
          </div>

          <div
            className={HB_CLASSES.cardFooter}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                Need help? Call{' '}
                <a
                  href={`tel:${SUPPORT.phone}`}
                  aria-label={`Call Member Services at ${SUPPORT.phone}`}
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
          </div>
        </div>

        {/* Footer branding */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.6875rem',
            color: '#9ca3af',
          }}
        >
          © {new Date().getFullYear()} HealthFirst. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;