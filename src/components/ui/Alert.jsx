import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Alert component implementing HB CSS alert classes.
 * Supports info, success, warning, and error variants with
 * optional icon, dismissible functionality, and accessible close button.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Alert content/message
 * @param {string} [props.variant='info'] - Alert variant ('info', 'success', 'warning', 'error')
 * @param {string} [props.title] - Optional bold title text displayed before the message
 * @param {React.ReactNode} [props.icon] - Custom icon element to render before the content
 * @param {boolean} [props.showDefaultIcon=true] - Whether to show the default icon for the variant when no custom icon is provided
 * @param {boolean} [props.dismissible=false] - Whether the alert can be dismissed/closed
 * @param {Function} [props.onDismiss] - Callback invoked when the alert is dismissed
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.role='alert'] - ARIA role for the alert ('alert', 'status')
 * @param {string} [props.ariaLive] - ARIA live region attribute ('assertive', 'polite', 'off')
 * @param {string} [props.ariaLabel] - Accessible label for the alert
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement|null} The alert element or null if dismissed
 */
const Alert = ({
  children,
  variant,
  title,
  icon,
  showDefaultIcon,
  dismissible,
  onDismiss,
  className,
  role,
  ariaLive,
  ariaLabel,
  id,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  /**
   * Returns the HB CSS class for the given variant.
   * @param {string} v - The variant string
   * @returns {string} The HB CSS class string
   */
  const getVariantClass = (v) => {
    switch (v) {
      case 'info':
        return HB_CLASSES.alertInfo;
      case 'success':
        return HB_CLASSES.alertSuccess;
      case 'warning':
        return HB_CLASSES.alertWarning;
      case 'error':
        return HB_CLASSES.alertError;
      default:
        return HB_CLASSES.alertInfo;
    }
  };

  /**
   * Returns the default SVG icon for the given variant.
   * @param {string} v - The variant string
   * @returns {React.ReactElement} The SVG icon element
   */
  const getDefaultIcon = (v) => {
    const iconProps = {
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      style: { flexShrink: 0, marginTop: '1px' },
    };

    switch (v) {
      case 'info':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
      case 'success':
        return (
          <svg {...iconProps}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'warning':
        return (
          <svg {...iconProps}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'error':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  /**
   * Handles the dismiss/close action.
   */
  const handleDismiss = useCallback(() => {
    setIsDismissed(true);

    if (onDismiss && typeof onDismiss === 'function') {
      onDismiss();
    }
  }, [onDismiss]);

  if (isDismissed) {
    return null;
  }

  const variantClass = getVariantClass(variant);

  const combinedClassName = [
    variantClass,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const renderIcon = icon || (showDefaultIcon ? getDefaultIcon(variant) : null);

  return (
    <div
      id={id}
      className={combinedClassName}
      role={role}
      aria-live={ariaLive}
      aria-label={ariaLabel}
      style={{ position: 'relative' }}
    >
      {renderIcon && (
        <span
          style={{ display: 'inline-flex', alignItems: 'flex-start', flexShrink: 0 }}
          aria-hidden="true"
        >
          {renderIcon}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <strong
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontWeight: 600,
            }}
          >
            {title}
          </strong>
        )}
        {children}
      </div>
      {dismissible && (
        <button
          type="button"
          className={HB_CLASSES.alertDismiss}
          onClick={handleDismiss}
          aria-label="Dismiss alert"
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
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  title: PropTypes.string,
  icon: PropTypes.node,
  showDefaultIcon: PropTypes.bool,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
  role: PropTypes.oneOf(['alert', 'status']),
  ariaLive: PropTypes.oneOf(['assertive', 'polite', 'off']),
  ariaLabel: PropTypes.string,
  id: PropTypes.string,
};

Alert.defaultProps = {
  variant: 'info',
  title: undefined,
  icon: null,
  showDefaultIcon: true,
  dismissible: false,
  onDismiss: undefined,
  className: '',
  role: 'alert',
  ariaLive: undefined,
  ariaLabel: undefined,
  id: undefined,
};

export default Alert;