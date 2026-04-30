import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * SessionTimeoutWarning component.
 * Displays a modal dialog warning the user that their session is about to expire.
 * Shows a countdown timer and provides options to extend the session or log out.
 * Triggered by the AuthContext when the session enters the warning window.
 *
 * @param {Object} props
 * @param {boolean} [props.isOpen] - Override for controlling modal visibility externally
 * @returns {React.ReactElement|null} The session timeout warning modal or null if not shown
 */
const SessionTimeoutWarning = ({ isOpen: isOpenProp }) => {
  const {
    isSessionWarning,
    sessionTimeRemaining,
    extendUserSession,
    logout,
    isAuthenticated,
  } = useAuth();

  const [isExtending, setIsExtending] = useState(false);
  const [extendError, setExtendError] = useState(null);
  const continueButtonRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const showModal = isOpenProp !== undefined ? isOpenProp : (isSessionWarning && isAuthenticated);

  /**
   * Focuses the continue button when the modal opens.
   * Stores the previously focused element for restoration on close.
   */
  useEffect(() => {
    if (showModal) {
      previousActiveElementRef.current = document.activeElement;

      const timer = setTimeout(() => {
        if (continueButtonRef.current) {
          continueButtonRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [showModal]);

  /**
   * Traps focus within the modal when it is open.
   */
  useEffect(() => {
    if (!showModal) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleContinueSession();
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

  /**
   * Handles the continue session action.
   * Extends the user session and dismisses the modal.
   */
  const handleContinueSession = useCallback(async () => {
    setIsExtending(true);
    setExtendError(null);

    try {
      const result = extendUserSession();

      if (!result.success) {
        setExtendError(result.error || 'Unable to extend session. Please try again.');
      }
    } catch (err) {
      console.error('[SessionTimeoutWarning] Error extending session:', err);
      setExtendError('An unexpected error occurred. Please try again.');
    } finally {
      setIsExtending(false);
    }
  }, [extendUserSession]);

  /**
   * Handles the log out action.
   */
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  if (!showModal) {
    return null;
  }

  return (
    <div
      className={HB_CLASSES.modalOverlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
      aria-describedby="session-timeout-description"
    >
      <div
        className={`${HB_CLASSES.modal} ${HB_CLASSES.modalSm}`}
        ref={modalRef}
      >
        <div className={HB_CLASSES.modalHeader}>
          <h2 id="session-timeout-title" className="hb-text-lg hb-font-bold" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            Session Expiring Soon
          </h2>
        </div>

        <div className={HB_CLASSES.modalBody}>
          <div className="hb-flex hb-flex-col hb-items-center hb-gap-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '9999px',
                backgroundColor: '#fffbeb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <p
              id="session-timeout-description"
              style={{
                textAlign: 'center',
                color: '#374151',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                margin: 0,
              }}
            >
              Your session is about to expire due to inactivity. You will be automatically logged out when the timer reaches zero.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Time Remaining
              </span>
              <span
                role="timer"
                aria-live="assertive"
                aria-atomic="true"
                aria-label={`Session expires in ${sessionTimeRemaining}`}
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#92400e',
                  fontFamily: 'monospace',
                  lineHeight: 1.2,
                }}
              >
                {sessionTimeRemaining}
              </span>
            </div>

            {extendError && (
              <div
                className={HB_CLASSES.alertWarning}
                role="alert"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.8125rem',
                  margin: 0,
                }}
              >
                {extendError}
              </div>
            )}
          </div>
        </div>

        <div className={HB_CLASSES.modalFooter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <button
            type="button"
            className={HB_CLASSES.btnSecondary}
            onClick={handleLogout}
            aria-label="Log out now"
          >
            Log Out
          </button>
          <button
            type="button"
            className={HB_CLASSES.btnPrimary}
            onClick={handleContinueSession}
            disabled={isExtending}
            aria-label="Continue session and stay logged in"
            ref={continueButtonRef}
          >
            {isExtending ? 'Extending...' : 'Continue Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

SessionTimeoutWarning.propTypes = {
  isOpen: PropTypes.bool,
};

SessionTimeoutWarning.defaultProps = {
  isOpen: undefined,
};

export default SessionTimeoutWarning;