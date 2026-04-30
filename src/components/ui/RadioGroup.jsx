import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable RadioGroup component implementing HB CSS form check classes.
 * Renders a group of radio buttons within an accessible fieldset/legend pattern.
 * Supports controlled and uncontrolled modes, validation states, disabled options,
 * horizontal/vertical layout, and full keyboard navigation.
 *
 * @param {Object} props
 * @param {string} props.name - HTML name attribute for the radio group (required, shared by all radio inputs)
 * @param {string} [props.legend] - Legend text displayed above the radio group
 * @param {React.ReactNode} [props.legendContent] - Custom legend content (overrides legend text if provided)
 * @param {Array<{value: string|number, label: string, disabled?: boolean, helpText?: string}>} props.options - Array of radio option objects
 * @param {string|number|null} [props.value] - Currently selected value (controlled)
 * @param {string|number|null} [props.defaultValue] - Default selected value (uncontrolled)
 * @param {Function} [props.onChange] - Callback invoked when the selected value changes, receives the new value
 * @param {Function} [props.onBlur] - Callback invoked when the radio group loses focus
 * @param {Function} [props.onFocus] - Callback invoked when the radio group gains focus
 * @param {boolean} [props.disabled=false] - Whether the entire radio group is disabled
 * @param {boolean} [props.required=false] - Whether a selection is required
 * @param {boolean} [props.error=false] - Whether the radio group is in an error state
 * @param {boolean} [props.success=false] - Whether the radio group is in a success state
 * @param {string} [props.errorMessage] - Error message to display below the radio group
 * @param {string} [props.successMessage] - Success message to display below the radio group
 * @param {string} [props.helpText] - Help text to display below the radio group
 * @param {string} [props.orientation='vertical'] - Layout orientation ('vertical' or 'horizontal')
 * @param {string} [props.className] - Additional CSS class names to append to the fieldset
 * @param {string} [props.ariaLabel] - Accessible label for the radio group (used when no visible legend)
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the radio group
 * @param {string} [props.ariaLabelledBy] - ID of the element that labels the radio group
 * @param {string} [props.id] - HTML id attribute for the fieldset
 * @param {string} [props.size='md'] - Radio button size ('sm', 'md', 'lg')
 * @returns {React.ReactElement} The radio group element
 */
const RadioGroup = ({
  name,
  legend,
  legendContent,
  options,
  value: controlledValue,
  defaultValue,
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
  orientation,
  className,
  ariaLabel,
  ariaDescribedBy,
  ariaLabelledBy,
  id,
  size,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(
    defaultValue !== undefined && defaultValue !== null ? defaultValue : null
  );

  const fieldsetRef = useRef(null);

  const currentValue = isControlled ? controlledValue : internalValue;

  /**
   * Handles change events on a radio input.
   * @param {string|number} newValue - The value of the selected radio option
   */
  const handleChange = useCallback((newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  }, [isControlled, onChange]);

  /**
   * Handles the native change event from the radio input.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    handleChange(newValue);
  }, [handleChange]);

  /**
   * Handles blur events on the fieldset.
   * @param {React.FocusEvent} e - The blur event
   */
  const handleBlur = useCallback((e) => {
    if (fieldsetRef.current && !fieldsetRef.current.contains(e.relatedTarget)) {
      if (onBlur && typeof onBlur === 'function') {
        onBlur(e);
      }
    }
  }, [onBlur]);

  /**
   * Handles focus events on the fieldset.
   * @param {React.FocusEvent} e - The focus event
   */
  const handleFocus = useCallback((e) => {
    if (onFocus && typeof onFocus === 'function') {
      onFocus(e);
    }
  }, [onFocus]);

  const descriptionId = errorMessage
    ? `${name}-error`
    : successMessage
      ? `${name}-success`
      : helpText
        ? `${name}-help`
        : undefined;

  const effectiveAriaDescribedBy = ariaDescribedBy || descriptionId;

  const hasLegend = legend || legendContent;

  const fieldsetClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const legendClass = required ? HB_CLASSES.formLabelRequired : HB_CLASSES.formLabel;

  /**
   * Returns size-specific inline styles for the radio input.
   * @param {string} s - The size string
   * @returns {Object} Inline style object for the radio input
   */
  const getRadioInputStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          width: '0.875rem',
          height: '0.875rem',
        };
      case 'lg':
        return {
          width: '1.375rem',
          height: '1.375rem',
        };
      case 'md':
      default:
        return {};
    }
  };

  /**
   * Returns size-specific inline styles for the radio label.
   * @param {string} s - The size string
   * @returns {Object} Inline style object for the radio label
   */
  const getRadioLabelStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          fontSize: '0.8125rem',
        };
      case 'lg':
        return {
          fontSize: '1rem',
        };
      case 'md':
      default:
        return {};
    }
  };

  const radioInputSizeStyle = getRadioInputStyle(size);
  const radioLabelSizeStyle = getRadioLabelStyle(size);

  const containerStyle = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
    gap: orientation === 'horizontal' ? '1.25rem' : '0.25rem',
  };

  const inputAccentStyle = {};
  if (error) {
    inputAccentStyle.accentColor = '#ef4444';
    inputAccentStyle.outlineColor = '#ef4444';
  } else if (success) {
    inputAccentStyle.accentColor = '#10b981';
    inputAccentStyle.outlineColor = '#10b981';
  }

  return (
    <fieldset
      id={id}
      ref={fieldsetRef}
      className={fieldsetClassName || undefined}
      role="radiogroup"
      aria-label={!hasLegend ? ariaLabel : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={effectiveAriaDescribedBy}
      aria-required={required || undefined}
      aria-invalid={error || undefined}
      disabled={disabled}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        marginBottom: '1.5rem',
        minWidth: 0,
      }}
    >
      {hasLegend && (
        <legend
          className={legendClass}
          style={{
            padding: 0,
            marginBottom: '0.5rem',
          }}
        >
          {legendContent || legend}
        </legend>
      )}

      <div style={containerStyle}>
        {Array.isArray(options) && options.map((option, index) => {
          const optionId = `${name}-option-${index}`;
          const isSelected = currentValue !== null && currentValue !== undefined && String(option.value) === String(currentValue);
          const isOptionDisabled = disabled || option.disabled;

          const labelStyle = {
            ...radioLabelSizeStyle,
          };

          if (isOptionDisabled) {
            labelStyle.color = '#9ca3af';
            labelStyle.cursor = 'not-allowed';
          }

          return (
            <div key={String(option.value)} className={HB_CLASSES.formCheck}>
              <input
                id={optionId}
                type="radio"
                name={name}
                value={String(option.value)}
                checked={isSelected}
                onChange={handleInputChange}
                disabled={isOptionDisabled}
                required={required && index === 0}
                className={HB_CLASSES.formCheckInput}
                aria-describedby={option.helpText ? `${optionId}-help` : undefined}
                style={{
                  ...radioInputSizeStyle,
                  ...inputAccentStyle,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label
                  htmlFor={optionId}
                  className={HB_CLASSES.formCheckLabel}
                  style={Object.keys(labelStyle).length > 0 ? labelStyle : undefined}
                >
                  {option.label}
                </label>
                {option.helpText && (
                  <span
                    id={`${optionId}-help`}
                    className={HB_CLASSES.formHelp}
                    style={{ marginLeft: 0, marginTop: '0.125rem' }}
                  >
                    {option.helpText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <span
          id={`${name}-error`}
          className={HB_CLASSES.formErrorText}
          role="alert"
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {errorMessage}
        </span>
      )}

      {!errorMessage && successMessage && (
        <span
          id={`${name}-success`}
          className={HB_CLASSES.formSuccessText}
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {successMessage}
        </span>
      )}

      {!errorMessage && !successMessage && helpText && (
        <span
          id={`${name}-help`}
          className={HB_CLASSES.formHelp}
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {helpText}
        </span>
      )}
    </fieldset>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  legendContent: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      helpText: PropTypes.string,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  id: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

RadioGroup.defaultProps = {
  legend: undefined,
  legendContent: undefined,
  value: undefined,
  defaultValue: undefined,
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
  orientation: 'vertical',
  className: '',
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
  ariaLabelledBy: undefined,
  id: undefined,
  size: 'md',
};

export default RadioGroup;