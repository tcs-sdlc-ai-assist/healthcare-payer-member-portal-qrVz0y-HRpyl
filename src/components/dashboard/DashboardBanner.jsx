import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { HB_CLASSES } from '../../constants/constants.js';
import { formatDate } from '../../utils/formatters.js';

/**
 * Returns a time-of-day greeting string based on the current hour.
 * @returns {string} Greeting string ('Good Morning', 'Good Afternoon', or 'Good Evening')
 */
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 18) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
};

/**
 * DashboardBanner component.
 * Dashboard hero banner displaying the approved HealthCare Payer banner image
 * (696x600) with a personalized greeting message including the member's first
 * name and the current date. Uses HB CSS image and typography classes.
 * Responsive sizing across all breakpoints.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.bannerImageUrl] - Custom banner image URL (defaults to built-in banner)
 * @returns {React.ReactElement} The dashboard banner element
 */
const DashboardBanner = ({ className, id, bannerImageUrl }) => {
  const { user } = useAuth();

  const greeting = useMemo(() => getGreeting(), []);

  const currentDate = useMemo(() => {
    return formatDate(new Date(), { format: 'MMMM DD, YYYY' });
  }, []);

  const firstName = user ? (user.firstName || 'Member') : 'Member';

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      id={id || 'dashboard-banner'}
      className={containerClassName}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      {/* Banner content wrapper */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          minHeight: '10rem',
        }}
      >
        {/* Background gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0069cc 0%, #003f7a 60%, #001529 100%)',
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Banner image (decorative) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '50%',
            overflow: 'hidden',
            zIndex: 1,
            opacity: 0.15,
          }}
          aria-hidden="true"
        >
          <img
            src={bannerImageUrl || '/banner-696x600.png'}
            alt=""
            role="presentation"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

        {/* Decorative pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            background: 'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '0.75rem',
            padding: '1.5rem',
            minHeight: '10rem',
          }}
        >
          {/* Date */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.4,
              }}
            >
              {currentDate}
            </span>
          </div>

          {/* Greeting */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
              }}
            >
              {greeting}, {firstName}
            </h1>
            <p
              style={{
                margin: 0,
                fontSize: '0.9375rem',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.5,
                maxWidth: '32rem',
              }}
            >
              Welcome to your HealthFirst Member Portal. View your benefits, track claims, and manage your health plan all in one place.
            </p>
          </div>

          {/* Quick stats row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '0.25rem',
              flexWrap: 'wrap',
            }}
          >
            {/* Plan badge */}
            {user && user.plan && user.plan.planName && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.plan.planName}
                </span>
              </div>
            )}

            {/* Member ID badge */}
            {user && user.memberId && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: 1.4,
                    whiteSpace: 'nowrap',
                    fontFamily: 'monospace',
                  }}
                >
                  {'••••' + user.memberId.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 640px) {
          #${id || 'dashboard-banner'} > div:first-child {
            min-height: 12rem;
          }
          #${id || 'dashboard-banner'} > div:first-child > div:last-child {
            padding: 2rem 2.5rem;
          }
          #${id || 'dashboard-banner'} > div:first-child > div:last-child h1 {
            font-size: 2rem;
          }
        }
        @media (min-width: 1024px) {
          #${id || 'dashboard-banner'} > div:first-child {
            min-height: 13rem;
          }
          #${id || 'dashboard-banner'} > div:first-child > div:last-child {
            padding: 2.5rem 3rem;
          }
          #${id || 'dashboard-banner'} > div:first-child > div:last-child h1 {
            font-size: 2.25rem;
          }
          #${id || 'dashboard-banner'} > div:first-child > div:nth-child(2) {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

DashboardBanner.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  bannerImageUrl: PropTypes.string,
};

DashboardBanner.defaultProps = {
  className: '',
  id: undefined,
  bannerImageUrl: undefined,
};

export default DashboardBanner;