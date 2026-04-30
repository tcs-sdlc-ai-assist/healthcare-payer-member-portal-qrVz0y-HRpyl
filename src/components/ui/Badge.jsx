import React from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Badge component implementing HB CSS badge classes.
 * Supports brand, success, warning, error, info, and neutral variants
 * for displaying status indicators, notification counts, and plan statuses.
 * Fully accessible with ARIA attributes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content/label
 * @param {string} [props.variant='neutral'] - Badge variant ('brand', 'success', 'warning', 'error', 'info', 'neutral')
 * @param {string} [props.size='md'] - Badge size ('sm', 'md', 'lg')
 * @param {boolean} [props.pill=true] - Whether the badge has fully rounded (pill) shape
 * @param {boolean} [props.dot=false] - Whether to show a small dot indicator before the label
 * @param {React.ReactNode} [props.icon] - Icon element to render before the label
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.ariaLabel] - Accessible label for the badge
 * @param {string} [props.role] - ARIA role for the badge ('status', 'alert', or undefined for default)
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.title] - HTML title attribute for tooltip
 * @returns {React.ReactElement} The badge element
 */
const Badge = ({
  children,
  variant,
  size,
  pill,
  dot,
  icon,
  className,
  ariaLabel,
  role,
  id,
  title,
}) => {
  /**
   * Returns the HB CSS class for the given variant.
   * @param {string} v - The variant string
   * @returns {string} The HB CSS class string
   */
  const getVariantClass = (v) => {
    switch (v) {
      case 'brand':
        return HB_CLASSES.badgeBrand;
      case 'success':
        return HB_CLASSES.badgeSuccess;
      case 'warning':
        return HB_CLASSES.badgeWarning;
      case 'error':
        return HB_CLASSES.badgeError;
      case 'info':
        return HB_CLASSES.badgeInfo;
      case 'neutral':
        return HB_CLASSES.badgeNeutral;
      default:
        return HB_CLASSES.badgeNeutral;
    }
  };

  /**
   * Returns the dot color for the given variant.
   * @param {string} v - The variant string
   * @returns {string} The CSS background color value for the dot
   */
  const getDotColor = (v) => {
    switch (v) {
      case 'brand':
        return '#0054a3';
      case 'success':
        return '#065f46';
      case 'warning':
        return '#92400e';
      case 'error':
        return '#991b1b';
      case 'info':
        return '#1e40af';
      case 'neutral':
        return '#374151';
      default:
        return '#374151';
    }
  };

  /**
   * Returns inline style overrides for the given size.
   * @param {string} s - The size string
   * @returns {Object} The inline style object
   */
  const getSizeStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          fontSize: '0.625rem',
          padding: '0.0625rem 0.4375rem',
          lineHeight: 1.4,
        };
      case 'lg':
        return {
          fontSize: '0.875rem',
          padding: '0.25rem 0.75rem',
          lineHeight: 1.5,
        };
      case 'md':
      default:
        return {};
    }
  };

  const variantClass = getVariantClass(variant);
  const sizeStyle = getSizeStyle(size);

  const combinedClassName = [
    variantClass,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const inlineStyle = {
    ...sizeStyle,
    ...(pill === false ? { borderRadius: '0.25rem' } : {}),
  };

  const hasInlineStyle = Object.keys(inlineStyle).length > 0;

  return (
    <span
      id={id}
      className={combinedClassName}
      role={role}
      aria-label={ariaLabel}
      title={title}
      style={hasInlineStyle ? inlineStyle : undefined}
    >
      {dot && (
        <span
          style={{
            display: 'inline-block',
            width: size === 'sm' ? '0.375rem' : size === 'lg' ? '0.5rem' : '0.4375rem',
            height: size === 'sm' ? '0.375rem' : size === 'lg' ? '0.5rem' : '0.4375rem',
            borderRadius: '9999px',
            backgroundColor: getDotColor(variant),
            flexShrink: 0,
            marginRight: '0.25rem',
          }}
          aria-hidden="true"
        />
      )}
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0,
            marginRight: '0.25rem',
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['brand', 'success', 'warning', 'error', 'info', 'neutral']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  pill: PropTypes.bool,
  dot: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.oneOf(['status', 'alert']),
  id: PropTypes.string,
  title: PropTypes.string,
};

Badge.defaultProps = {
  variant: 'neutral',
  size: 'md',
  pill: true,
  dot: false,
  icon: null,
  className: '',
  ariaLabel: undefined,
  role: undefined,
  id: undefined,
  title: undefined,
};

export default Badge;