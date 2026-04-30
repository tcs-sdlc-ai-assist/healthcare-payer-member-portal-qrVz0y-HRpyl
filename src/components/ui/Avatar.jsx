import React from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Avatar component implementing HB CSS avatar classes.
 * Supports xs, sm, md, lg, and xl size variants with image or initials display.
 * Optionally renders a status badge indicator. Fully accessible with ARIA attributes.
 *
 * @param {Object} props
 * @param {string} [props.src] - Image source URL for the avatar
 * @param {string} [props.alt=''] - Alt text for the avatar image
 * @param {string} [props.initials] - Initials to display when no image is provided (e.g., "JD")
 * @param {string} [props.size='md'] - Avatar size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} [props.variant='default'] - Avatar color variant ('default', 'brand', 'neutral')
 * @param {string} [props.badgeStatus] - Optional status badge ('online', 'offline', 'away', 'busy')
 * @param {string} [props.badgePosition='bottom-right'] - Badge position ('top-right', 'bottom-right')
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.ariaLabel] - Accessible label for the avatar
 * @param {string} [props.role] - ARIA role for the avatar ('img' or undefined for default)
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.title] - HTML title attribute for tooltip
 * @param {Function} [props.onClick] - Click event handler (makes avatar interactive)
 * @param {number} [props.tabIndex] - Tab index for the avatar
 * @returns {React.ReactElement} The avatar element
 */
const Avatar = ({
  src,
  alt,
  initials,
  size,
  variant,
  badgeStatus,
  badgePosition,
  className,
  ariaLabel,
  role,
  id,
  title,
  onClick,
  tabIndex,
}) => {
  /**
   * Returns the HB CSS class for the given size.
   * @param {string} s - The size string
   * @returns {string} The HB CSS class string
   */
  const getSizeClass = (s) => {
    switch (s) {
      case 'xs':
        return HB_CLASSES.avatarXs;
      case 'sm':
        return HB_CLASSES.avatarSm;
      case 'md':
        return HB_CLASSES.avatarMd;
      case 'lg':
        return HB_CLASSES.avatarLg;
      case 'xl':
        return HB_CLASSES.avatarXl;
      default:
        return HB_CLASSES.avatarMd;
    }
  };

  /**
   * Returns inline style overrides for the given variant.
   * @param {string} v - The variant string
   * @returns {Object} The inline style object
   */
  const getVariantStyle = (v) => {
    switch (v) {
      case 'brand':
        return {
          backgroundColor: '#e6f0fa',
          color: '#0069cc',
        };
      case 'neutral':
        return {
          backgroundColor: '#f3f4f6',
          color: '#374151',
        };
      case 'default':
      default:
        return {};
    }
  };

  /**
   * Returns the badge color for the given status.
   * @param {string} status - The badge status string
   * @returns {string} The CSS background color value
   */
  const getBadgeColor = (status) => {
    switch (status) {
      case 'online':
        return '#10b981';
      case 'offline':
        return '#9ca3af';
      case 'away':
        return '#f59e0b';
      case 'busy':
        return '#ef4444';
      default:
        return '#9ca3af';
    }
  };

  /**
   * Returns the badge size in pixels based on the avatar size.
   * @param {string} s - The avatar size string
   * @returns {string} The CSS dimension value
   */
  const getBadgeSize = (s) => {
    switch (s) {
      case 'xs':
        return '0.375rem';
      case 'sm':
        return '0.5rem';
      case 'md':
        return '0.5625rem';
      case 'lg':
        return '0.6875rem';
      case 'xl':
        return '0.875rem';
      default:
        return '0.5625rem';
    }
  };

  /**
   * Returns the badge position style based on position and avatar size.
   * @param {string} position - The badge position string
   * @returns {Object} The inline style object for badge positioning
   */
  const getBadgePositionStyle = (position) => {
    switch (position) {
      case 'top-right':
        return {
          top: '0',
          right: '0',
        };
      case 'bottom-right':
      default:
        return {
          bottom: '0',
          right: '0',
        };
    }
  };

  /**
   * Returns the font size for initials based on avatar size.
   * The HB CSS classes already handle this, but we provide a fallback.
   * @param {string} s - The avatar size string
   * @returns {string|undefined} The CSS font-size value or undefined to use class default
   */
  const getInitialsFontSize = (s) => {
    switch (s) {
      case 'xs':
        return '0.625rem';
      case 'sm':
        return '0.75rem';
      case 'md':
        return '1rem';
      case 'lg':
        return '1.25rem';
      case 'xl':
        return '1.75rem';
      default:
        return undefined;
    }
  };

  /**
   * Returns the default SVG icon for when no image or initials are provided.
   * @returns {React.ReactElement} The SVG icon element
   */
  const getDefaultIcon = () => {
    const iconSize = size === 'xs' ? '10' : size === 'sm' ? '14' : size === 'lg' ? '22' : size === 'xl' ? '30' : '16';

    return (
      <svg
        width={iconSize}
        height={iconSize}
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
    );
  };

  const sizeClass = getSizeClass(size);
  const variantStyle = getVariantStyle(variant);

  const combinedClassName = [
    sizeClass,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const isInteractive = typeof onClick === 'function';

  const containerStyle = {
    ...variantStyle,
    position: 'relative',
    ...(isInteractive ? { cursor: 'pointer' } : {}),
  };

  const hasImage = src && typeof src === 'string' && src.trim().length > 0;
  const hasInitials = initials && typeof initials === 'string' && initials.trim().length > 0;

  const effectiveAriaLabel = ariaLabel || (hasImage ? alt : hasInitials ? `Avatar for ${initials}` : 'User avatar');

  const handleClick = (e) => {
    if (isInteractive) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  const Tag = isInteractive ? 'button' : 'span';

  const interactiveProps = isInteractive
    ? {
        type: 'button',
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        tabIndex: tabIndex !== undefined ? tabIndex : 0,
      }
    : {
        tabIndex: tabIndex,
      };

  return (
    <Tag
      id={id}
      className={combinedClassName}
      style={containerStyle}
      role={role}
      aria-label={effectiveAriaLabel}
      title={title}
      {...interactiveProps}
    >
      {hasImage ? (
        <img
          src={src}
          alt={alt || ''}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '9999px',
          }}
        />
      ) : hasInitials ? (
        <span
          style={{
            fontSize: getInitialsFontSize(size),
            lineHeight: 1,
            userSelect: 'none',
          }}
          aria-hidden="true"
        >
          {initials.trim().toUpperCase().slice(0, 2)}
        </span>
      ) : (
        getDefaultIcon()
      )}

      {badgeStatus && (
        <span
          style={{
            position: 'absolute',
            ...getBadgePositionStyle(badgePosition),
            width: getBadgeSize(size),
            height: getBadgeSize(size),
            borderRadius: '9999px',
            backgroundColor: getBadgeColor(badgeStatus),
            border: '2px solid #ffffff',
            display: 'block',
            boxSizing: 'content-box',
          }}
          aria-hidden="true"
          title={badgeStatus}
        />
      )}
    </Tag>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  initials: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['default', 'brand', 'neutral']),
  badgeStatus: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
  badgePosition: PropTypes.oneOf(['top-right', 'bottom-right']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.oneOf(['img']),
  id: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
  tabIndex: PropTypes.number,
};

Avatar.defaultProps = {
  src: undefined,
  alt: '',
  initials: undefined,
  size: 'md',
  variant: 'default',
  badgeStatus: undefined,
  badgePosition: 'bottom-right',
  className: '',
  ariaLabel: undefined,
  role: undefined,
  id: undefined,
  title: undefined,
  onClick: undefined,
  tabIndex: undefined,
};

export default Avatar;