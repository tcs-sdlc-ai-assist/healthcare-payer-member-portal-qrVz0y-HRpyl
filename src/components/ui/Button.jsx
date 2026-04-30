import React from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Button component implementing HB CSS button classes.
 * Supports primary, secondary, tertiary, and danger variants with
 * small, medium, and large size options. Fully accessible with ARIA attributes.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content/label
 * @param {string} [props.variant='primary'] - Button variant ('primary', 'secondary', 'tertiary', 'danger')
 * @param {string} [props.size='md'] - Button size ('sm', 'md', 'lg')
 * @param {string} [props.type='button'] - HTML button type ('button', 'submit', 'reset')
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state
 * @param {boolean} [props.block=false] - Whether the button should be full width
 * @param {React.ReactNode} [props.iconLeft] - Icon element to render before the label
 * @param {React.ReactNode} [props.iconRight] - Icon element to render after the label
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.ariaLabel] - Accessible label for the button
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the button
 * @param {string} [props.ariaControls] - ID of the element controlled by the button
 * @param {boolean} [props.ariaExpanded] - Whether the controlled element is expanded
 * @param {boolean} [props.ariaPressed] - Whether the button is pressed (toggle button)
 * @param {Function} [props.onClick] - Click event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {Function} [props.onKeyDown] - Keydown event handler
 * @param {React.Ref} [props.buttonRef] - Ref to attach to the button element
 * @param {string} [props.id] - HTML id attribute
 * @param {number} [props.tabIndex] - Tab index for the button
 * @returns {React.ReactElement} The button element
 */
const Button = ({
  children,
  variant,
  size,
  type,
  disabled,
  loading,
  block,
  iconLeft,
  iconRight,
  className,
  ariaLabel,
  ariaDescribedBy,
  ariaControls,
  ariaExpanded,
  ariaPressed,
  onClick,
  onFocus,
  onBlur,
  onKeyDown,
  buttonRef,
  id,
  tabIndex,
}) => {
  /**
   * Returns the base HB CSS class for the given variant.
   * @param {string} v - The variant string
   * @returns {string} The HB CSS class string
   */
  const getVariantClass = (v) => {
    switch (v) {
      case 'primary':
        return HB_CLASSES.btnPrimary;
      case 'secondary':
        return HB_CLASSES.btnSecondary;
      case 'tertiary':
        return HB_CLASSES.btnTertiary;
      case 'danger':
        return HB_CLASSES.btnDanger;
      default:
        return HB_CLASSES.btnPrimary;
    }
  };

  /**
   * Returns the HB CSS size class for the given size.
   * @param {string} s - The size string
   * @returns {string} The HB CSS size class string or empty string for default
   */
  const getSizeClass = (s) => {
    switch (s) {
      case 'sm':
        return HB_CLASSES.btnSm;
      case 'lg':
        return HB_CLASSES.btnLg;
      case 'md':
      default:
        return '';
    }
  };

  const variantClass = getVariantClass(variant);
  const sizeClass = getSizeClass(size);
  const blockClass = block ? HB_CLASSES.btnBlock : '';

  const combinedClassName = [
    variantClass,
    sizeClass,
    blockClass,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const isDisabled = disabled || loading;

  /**
   * Handles click events, preventing action when disabled or loading.
   * @param {React.MouseEvent<HTMLButtonElement>} e - The click event
   */
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }

    if (onClick && typeof onClick === 'function') {
      onClick(e);
    }
  };

  return (
    <button
      id={id}
      type={type}
      className={combinedClassName}
      disabled={isDisabled}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={buttonRef}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-pressed={ariaPressed}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              width: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
              height: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '9999px',
              animation: 'spin 0.8s linear infinite',
              display: 'inline-block',
              flexShrink: 0,
              opacity: 0.7,
            }}
            aria-hidden="true"
          />
          {children}
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </span>
      ) : (
        <>
          {iconLeft && (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
              aria-hidden="true"
            >
              {iconLeft}
            </span>
          )}
          {children}
          {iconRight && (
            <span
              style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
              aria-hidden="true"
            >
              {iconRight}
            </span>
          )}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaControls: PropTypes.string,
  ariaExpanded: PropTypes.bool,
  ariaPressed: PropTypes.bool,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  buttonRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  id: PropTypes.string,
  tabIndex: PropTypes.number,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  iconLeft: null,
  iconRight: null,
  className: '',
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
  ariaControls: undefined,
  ariaExpanded: undefined,
  ariaPressed: undefined,
  onClick: undefined,
  onFocus: undefined,
  onBlur: undefined,
  onKeyDown: undefined,
  buttonRef: undefined,
  id: undefined,
  tabIndex: undefined,
};

export default Button;