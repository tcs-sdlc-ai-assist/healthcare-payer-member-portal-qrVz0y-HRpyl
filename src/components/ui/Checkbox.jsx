import React, { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Checkbox component implementing HB CSS form check classes.
 * Supports checked, unchecked, and indeterminate states with accessible
 * label association, error/success validation states, and disabled support.
 * Fully accessible with ARIA attributes and keyboard interaction.
 *
 * @param {Object} props
 * @param {string} props.id - HTML id attribute for the checkbox input (required for label association)
 * @param {string} [props.label] - Label text displayed next to the checkbox
 * @param {React.ReactNode} [props.labelContent] - Custom label content (overrides label text if provided)
 * @param {boolean} [props.checked=false] - Whether the checkbox is checked (controlled)
 * @param {boolean} [props.defaultChecked] - Default checked state (uncontrolled)
 * @param {boolean} [props.indeterminate=false] - Whether the checkbox is in an indeterminate state
 * @param {Function} [props.onChange] - Callback invoked when the checked state changes, receives the change event
 * @param {Function} [props.onBlur] - Callback invoked when the checkbox loses focus
 * @param {Function} [props.onFocus] - Callback invoked when the checkbox gains focus
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled
 * @param {boolean} [props.required=false] - Whether the checkbox is required
 * @param {boolean} [props.error=false] - Whether the checkbox is in an error state
 * @param {boolean} [props.success=false] - Whether the checkbox is in a success state
 * @param {string} [props.errorMessage] - Error message to display below the checkbox
 * @param {string} [props.successMessage] - Success message to display below the checkbox
 * @param {string} [props.helpText] - Help text to display below the checkbox
 * @param {string} [props.name] - HTML name attribute
 * @param {string} [props.value] - HTML value attribute
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.ariaLabel] - Accessible label for the checkbox (used when no visible label)
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the checkbox
 * @param {string} [props.ariaLabelledBy] - ID of the element that labels the checkbox
 * @param {number} [props.tabIndex] - Tab index for the checkbox
 * @returns {React.ReactElement} The checkbox element
 */
const Checkbox = ({
  id,
  label,
  labelContent,
  checked,
  defaultChecked,
  indeterminate,
  onChange,
  onBlur,
  onFocus,
  disabled,
  required,
  error,
  success,
  errorMessage,
  successMessage,
  helpText,
  name,
  value,
  className,
  ariaLabel,
  ariaDescribedBy,
  ariaLabelledBy,
  tabIndex,
}) => {
  const inputRef = useRef(null);

  /**
   * Sets the indeterminate property on the input element.
   * The indeterminate state can only be set via JavaScript, not HTML attributes.
   */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);

  /**
   * Handles change events on the checkbox input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChange = useCallback((e) => {
    if (onChange && typeof onChange === 'function') {
      onChange(e);
    }
  }, [onChange]);

  /**
   * Handles blur events on the checkbox input.
   * @param {React.FocusEvent<HTMLInputElement>} e - The blur event
   */
  const handleBlur = useCallback((e) => {
    if (onBlur && typeof onBlur === 'function') {
      onBlur(e);
    }
  }, [onBlur]);

  /**
   * Handles focus events on the checkbox input.
   * @param {React.FocusEvent<HTMLInputElement>} e - The focus event
   */
  const handleFocus = useCallback((e) => {
    if (onFocus && typeof onFocus === 'function') {
      onFocus(e);
    }
  }, [onFocus]);

  const isControlled = checked !== undefined;

  const descriptionId = errorMessage
    ? `${id}-error`
    : successMessage
      ? `${id}-success`
      : helpText
        ? `${id}-help`
        : undefined;

  const effectiveAriaDescribedBy = ariaDescribedBy || descriptionId;

  const containerClassName = [
    HB_CLASSES.formCheck,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const inputStyle = {};

  if (error) {
    inputStyle.accentColor = '#ef4444';
    inputStyle.outlineColor = '#ef4444';
  } else if (success) {
    inputStyle.accentColor = '#10b981';
    inputStyle.outlineColor = '#10b981';
  }

  const labelStyle = {};

  if (disabled) {
    labelStyle.color = '#9ca3af';
    labelStyle.cursor = 'not-allowed';
  }

  const inputProps = {
    id,
    type: 'checkbox',
    className: HB_CLASSES.formCheckInput,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    disabled,
    required,
    name,
    value,
    ref: inputRef,
    tabIndex,
    'aria-label': (!label && !labelContent) ? ariaLabel : undefined,
    'aria-invalid': error || undefined,
    'aria-required': required || undefined,
    'aria-describedby': effectiveAriaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    'aria-checked': indeterminate ? 'mixed' : undefined,
    style: Object.keys(inputStyle).length > 0 ? inputStyle : undefined,
  };

  if (isControlled) {
    inputProps.checked = checked;
  } else if (defaultChecked !== undefined) {
    inputProps.defaultChecked = defaultChecked;
  }

  const hasLabel = label || labelContent;

  return (
    <div className={containerClassName}>
      <input {...inputProps} />
      {hasLabel && (
        <label
          htmlFor={id}
          className={HB_CLASSES.formCheckLabel}
          style={Object.keys(labelStyle).length > 0 ? labelStyle : undefined}
        >
          {labelContent || label}
          {required && (
            <span style={{ color: '#ef4444', marginLeft: '0.125rem' }} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {errorMessage && (
        <span
          id={`${id}-error`}
          className={HB_CLASSES.formErrorText}
          role="alert"
          style={{ display: 'block', marginLeft: '1.625rem' }}
        >
          {errorMessage}
        </span>
      )}

      {!errorMessage && successMessage && (
        <span
          id={`${id}-success`}
          className={HB_CLASSES.formSuccessText}
          style={{ display: 'block', marginLeft: '1.625rem' }}
        >
          {successMessage}
        </span>
      )}

      {!errorMessage && !successMessage && helpText && (
        <span
          id={`${id}-help`}
          className={HB_CLASSES.formHelp}
          style={{ display: 'block', marginLeft: '1.625rem' }}
        >
          {helpText}
        </span>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelContent: PropTypes.node,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  helpText: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  tabIndex: PropTypes.number,
};

Checkbox.defaultProps = {
  label: undefined,
  labelContent: undefined,
  checked: undefined,
  defaultChecked: undefined,
  indeterminate: false,
  onChange: undefined,
  onBlur: undefined,
  onFocus: undefined,
  disabled: false,
  required: false,
  error: false,
  success: false,
  errorMessage: undefined,
  successMessage: undefined,
  helpText: undefined,
  name: undefined,
  value: undefined,
  className: '',
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
  ariaLabelledBy: undefined,
  tabIndex: undefined,
};

export default Checkbox;