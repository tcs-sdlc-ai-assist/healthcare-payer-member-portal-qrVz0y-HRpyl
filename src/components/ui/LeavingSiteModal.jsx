import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useGlassbox } from '../../context/GlassboxContext.jsx';
import { logExternalLinkClick } from '../../services/auditLogger.js';

/**
 * LeavingSiteModal component.
 * Displays a warning modal when a user clicks an external link, informing them
 * that they are leaving the Healthcare Member Portal. Provides the destination URL,
 * a disclaimer message, and options to continue or cancel.
 * Logs external link clicks via Glassbox tagging and audit logger.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is currently open/visible
 * @param {Function} props.onClose - Callback invoked when the modal should close (Cancel or close button)
 * @param {string} props.url - The external destination URL
 * @param {string} [props.title] - Optional title for the external link (used in logging metadata)
 * @param {string} [props.category] - Optional category for the external link (used in logging metadata)
 * @param {string} [props.id] - HTML id attribute for the modal
 * @returns {React.ReactElement} The leaving site modal element
 */
const LeavingSiteModal = ({
  isOpen,
  onClose,
  url,
  title,
  category,
  id,
}) => {
  const { user } = useAuth();
  const { tagExternalLinkClicked } = useGlassbox();

  /**
   * Handles the continue action.
   * Logs the external link click via audit logger and Glassbox,
   * opens the URL in a new tab, and closes the modal.
   */
  const handleContinue = useCallback(() => {
    if (!url) {
      onClose();
      return;
    }

    if (user && user.memberId) {
      logExternalLinkClick(user.memberId, url, {
        title: title || '',
        category: category || '',
      });
    }

    tagExternalLinkClicked({
      url,
      title: title || null,
      category: category || null,
    });

    window.open(url, '_blank', 'noopener,noreferrer');

    onClose();
  }, [url, title, category, user, tagExternalLinkClicked, onClose]);

  /**
   * Handles the cancel action.
   * Simply closes the modal without navigating.
   */
  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Truncates a URL for display if it exceeds a maximum length.
   * @param {string} displayUrl - The URL to truncate
   * @param {number} [maxLength=80] - Maximum display length
   * @returns {string} The truncated URL
   */
  const getTruncatedUrl = (displayUrl, maxLength = 80) => {
    if (!displayUrl || typeof displayUrl !== 'string') {
      return '';
    }

    if (displayUrl.length <= maxLength) {
      return displayUrl;
    }

    return displayUrl.slice(0, maxLength) + '…';
  };

  const modalBody = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {/* Warning icon */}
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
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>

      {/* Warning message */}
      <p
        style={{
          textAlign: 'center',
          color: '#374151',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          margin: 0,
        }}
      >
        You are about to leave the Healthcare Member Portal. The website you are navigating to is not owned or operated by HealthFirst. We are not responsible for the content, privacy practices, or security of external websites.
      </p>

      {/* Destination URL */}
      {url && (
        <div
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            wordBreak: 'break-all',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem',
            }}
          >
            Destination
          </span>
          <span
            style={{
              fontSize: '0.8125rem',
              color: '#0069cc',
              lineHeight: 1.4,
            }}
            title={url}
          >
            {getTruncatedUrl(url)}
          </span>
        </div>
      )}

      {/* Additional disclaimer */}
      <p
        style={{
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.75rem',
          lineHeight: '1.5',
          margin: 0,
        }}
      >
        By clicking &ldquo;Continue,&rdquo; you acknowledge that you are leaving our secure portal.
      </p>
    </div>
  );

  const modalFooter = (
    <>
      <Button
        variant="secondary"
        onClick={handleCancel}
        ariaLabel="Cancel and stay on the portal"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        onClick={handleContinue}
        ariaLabel="Continue to external website"
      >
        Continue
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="You Are Leaving Our Site"
      size="sm"
      body={modalBody}
      footer={modalFooter}
      showCloseButton={true}
      closeOnOverlayClick={true}
      closeOnEscape={true}
      id={id}
      role="alertdialog"
      centered={true}
    />
  );
};

LeavingSiteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  title: PropTypes.string,
  category: PropTypes.string,
  id: PropTypes.string,
};

LeavingSiteModal.defaultProps = {
  title: undefined,
  category: undefined,
  id: undefined,
};

export default LeavingSiteModal;