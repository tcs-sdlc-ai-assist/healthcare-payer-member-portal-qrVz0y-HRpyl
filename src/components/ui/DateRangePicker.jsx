import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable DateRangePicker component implementing HB CSS form classes.
 * Provides start and end date inputs for filtering claims, documents,
 * and other date-ranged data. Supports controlled and uncontrolled modes,
 * validation, error/success states, and accessible labeling.
 *
 * @param {Object} props
 * @param {string} props.id - Base HTML id attribute for the date inputs (required)
 * @param {string} [props.legend] - Legend text displayed above the date range inputs
 * @param {string} [props.startLabel='Start Date'] - Label for the start date input
 * @param {string} [props.endLabel='End Date'] - Label for the end date input
 * @param {string} [props.startValue] - Controlled value for start date (YYYY-MM-DD)
 * @param {string} [props.endValue] - Controlled value for end date (YYYY-MM-DD)
 * @param {string} [props.defaultStartValue] - Default start date value (uncontrolled)
 * @param {string} [props.defaultEndValue] - Default end date value (uncontrolled)
 * @param {string} [props.minDate] - Minimum selectable date (YYYY-MM-DD)
 * @param {string} [props.maxDate] - Maximum selectable date (YYYY-MM-DD)
 * @param {Function} [props.onStartChange] - Callback invoked when start date changes, receives the new value
 * @param {Function} [props.onEndChange] - Callback invoked when end date changes, receives the new value
 * @param {Function} [props.onChange] - Callback invoked when either date changes, receives { startDate, endDate }
 * @param {Function} [props.onBlur] - Callback invoked when either input loses focus
 * @param {Function} [props.onFocus] - Callback invoked when either input gains focus
 * @param {boolean} [props.disabled=false] - Whether both date inputs are disabled
 * @param {boolean} [props.required=false] - Whether both date inputs are required
 * @param {boolean} [props.error=false] - Whether the date range is in an error state
 * @param {boolean} [props.success=false] - Whether the date range is in a success state
 * @param {string} [props.errorMessage] - Error message to display below the inputs
 * @param {string} [props.successMessage] - Success message to display below the inputs
 * @param {string} [props.helpText] - Help text to display below the inputs
 * @param {string} [props.orientation='horizontal'] - Layout orientation ('horizontal' or 'vertical')
 * @param {string} [props.size='md'] - Input size ('sm', 'md', 'lg')
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.ariaLabel] - Accessible label for the date range group
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the date range
 * @param {boolean} [props.showClearButton=false] - Whether to show a clear button to reset both dates
 * @param {Function} [props.onClear] - Callback invoked when the clear button is clicked
 * @returns {React.ReactElement} The date range picker element
 */
const DateRangePicker = ({
  id,
  legend,
  startLabel,
  endLabel,
  startValue: controlledStartValue,
  endValue: controlledEndValue,
  defaultStartValue,
  defaultEndValue,
  minDate,
  maxDate,
  onStartChange,
  onEndChange,
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
  size,
  className,
  ariaLabel,
  ariaDescribedBy,
  showClearButton,
  onClear,
}) => {
  const isStartControlled = controlledStartValue !== undefined;
  const isEndControlled = controlledEndValue !== undefined;

  const [internalStartValue, setInternalStartValue] = useState(
    defaultStartValue !== undefined && defaultStartValue !== null ? defaultStartValue : ''
  );
  const [internalEndValue, setInternalEndValue] = useState(
    defaultEndValue !== undefined && defaultEndValue !== null ? defaultEndValue : ''
  );
  const [validationError, setValidationError] = useState('');

  const currentStartValue = isStartControlled ? controlledStartValue : internalStartValue;
  const currentEndValue = isEndControlled ? controlledEndValue : internalEndValue;

  /**
   * Validates the date range and returns an error message if invalid.
   * @param {string} start - Start date string (YYYY-MM-DD)
   * @param {string} end - End date string (YYYY-MM-DD)
   * @returns {string} Validation error message or empty string
   */
  const validateRange = useCallback((start, end) => {
    if (!start || !end) {
      return '';
    }

    if (start > end) {
      return 'Start date must be before or equal to end date.';
    }

    return '';
  }, []);

  /**
   * Validates and updates the validation error state when values change.
   */
  useEffect(() => {
    const rangeError = validateRange(currentStartValue, currentEndValue);
    setValidationError(rangeError);
  }, [currentStartValue, currentEndValue, validateRange]);

  /**
   * Handles start date input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleStartChange = useCallback((e) => {
    const newValue = e.target.value;

    if (!isStartControlled) {
      setInternalStartValue(newValue);
    }

    if (onStartChange && typeof onStartChange === 'function') {
      onStartChange(newValue);
    }

    if (onChange && typeof onChange === 'function') {
      onChange({
        startDate: newValue,
        endDate: isEndControlled ? controlledEndValue : internalEndValue,
      });
    }
  }, [isStartControlled, isEndControlled, controlledEndValue, internalEndValue, onStartChange, onChange]);

  /**
   * Handles end date input change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleEndChange = useCallback((e) => {
    const newValue = e.target.value;

    if (!isEndControlled) {
      setInternalEndValue(newValue);
    }

    if (onEndChange && typeof onEndChange === 'function') {
      onEndChange(newValue);
    }

    if (onChange && typeof onChange === 'function') {
      onChange({
        startDate: isStartControlled ? controlledStartValue : internalStartValue,
        endDate: newValue,
      });
    }
  }, [isEndControlled, isStartControlled, controlledStartValue, internalStartValue, onEndChange, onChange]);

  /**
   * Handles blur events on either input.
   * @param {React.FocusEvent<HTMLInputElement>} e - The blur event
   */
  const handleBlur = useCallback((e) => {
    if (onBlur && typeof onBlur === 'function') {
      onBlur(e);
    }
  }, [onBlur]);

  /**
   * Handles focus events on either input.
   * @param {React.FocusEvent<HTMLInputElement>} e - The focus event
   */
  const handleFocus = useCallback((e) => {
    if (onFocus && typeof onFocus === 'function') {
      onFocus(e);
    }
  }, [onFocus]);

  /**
   * Handles the clear button click.
   */
  const handleClear = useCallback(() => {
    if (!isStartControlled) {
      setInternalStartValue('');
    }

    if (!isEndControlled) {
      setInternalEndValue('');
    }

    if (onStartChange && typeof onStartChange === 'function') {
      onStartChange('');
    }

    if (onEndChange && typeof onEndChange === 'function') {
      onEndChange('');
    }

    if (onChange && typeof onChange === 'function') {
      onChange({ startDate: '', endDate: '' });
    }

    if (onClear && typeof onClear === 'function') {
      onClear();
    }
  }, [isStartControlled, isEndControlled, onStartChange, onEndChange, onChange, onClear]);

  /**
   * Returns the input class based on validation state.
   * @returns {string} The HB CSS class string
   */
  const getInputClass = () => {
    if (error || validationError) {
      return HB_CLASSES.formInputError;
    }
    if (success) {
      return HB_CLASSES.formInputSuccess;
    }
    return HB_CLASSES.formInput;
  };

  /**
   * Returns size-specific inline styles for the date inputs.
   * @param {string} s - The size string
   * @returns {Object} Inline style object
   */
  const getSizeStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          padding: '0.375rem 0.75rem',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          padding: '0.75rem 0.75rem',
          fontSize: '1.125rem',
        };
      case 'md':
      default:
        return {};
    }
  };

  const sizeStyle = getSizeStyle(size);
  const inputClass = getInputClass();

  const startId = `${id}-start`;
  const endId = `${id}-end`;

  const displayError = errorMessage || validationError;

  const descriptionId = displayError
    ? `${id}-error`
    : successMessage
      ? `${id}-success`
      : helpText
        ? `${id}-help`
        : undefined;

  const effectiveAriaDescribedBy = ariaDescribedBy || descriptionId;

  const labelClass = required ? HB_CLASSES.formLabelRequired : HB_CLASSES.formLabel;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const isHorizontal = orientation === 'horizontal';

  const inputContainerStyle = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: isHorizontal ? '1rem' : '0.75rem',
    alignItems: isHorizontal ? 'flex-end' : 'stretch',
    flexWrap: isHorizontal ? 'wrap' : 'nowrap',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: isHorizontal ? '1 1 0%' : undefined,
    minWidth: isHorizontal ? '140px' : undefined,
  };

  /**
   * Computes the effective min date for the end date input.
   * If a start date is selected, the end date cannot be before it.
   * @returns {string|undefined} The effective min date for the end input
   */
  const getEndMinDate = () => {
    if (currentStartValue) {
      if (minDate && minDate > currentStartValue) {
        return minDate;
      }
      return currentStartValue;
    }
    return minDate || undefined;
  };

  /**
   * Computes the effective max date for the start date input.
   * If an end date is selected, the start date cannot be after it.
   * @returns {string|undefined} The effective max date for the start input
   */
  const getStartMaxDate = () => {
    if (currentEndValue) {
      if (maxDate && maxDate < currentEndValue) {
        return maxDate;
      }
      return currentEndValue;
    }
    return maxDate || undefined;
  };

  const hasDates = (currentStartValue && currentStartValue.length > 0) || (currentEndValue && currentEndValue.length > 0);

  return (
    <fieldset
      className={containerClassName || undefined}
      role="group"
      aria-label={!legend ? ariaLabel : undefined}
      aria-describedby={effectiveAriaDescribedBy}
      disabled={disabled}
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        marginBottom: '1.5rem',
        minWidth: 0,
      }}
    >
      {legend && (
        <legend
          className={labelClass}
          style={{
            padding: 0,
            marginBottom: '0.5rem',
          }}
        >
          {legend}
        </legend>
      )}

      <div style={inputContainerStyle}>
        {/* Start Date Input */}
        <div style={inputGroupStyle}>
          <label
            htmlFor={startId}
            className={labelClass}
          >
            {startLabel}
          </label>
          <input
            id={startId}
            type="date"
            className={inputClass}
            value={currentStartValue || ''}
            onChange={handleStartChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            min={minDate || undefined}
            max={getStartMaxDate()}
            aria-required={required || undefined}
            aria-invalid={(error || !!validationError) || undefined}
            aria-describedby={effectiveAriaDescribedBy}
            style={Object.keys(sizeStyle).length > 0 ? sizeStyle : undefined}
          />
        </div>

        {/* Separator */}
        {isHorizontal && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingBottom: '0.25rem',
              color: '#6b7280',
              fontSize: '0.875rem',
              fontWeight: 500,
              userSelect: 'none',
            }}
            aria-hidden="true"
          >
            to
          </span>
        )}

        {/* End Date Input */}
        <div style={inputGroupStyle}>
          <label
            htmlFor={endId}
            className={labelClass}
          >
            {endLabel}
          </label>
          <input
            id={endId}
            type="date"
            className={inputClass}
            value={currentEndValue || ''}
            onChange={handleEndChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            disabled={disabled}
            required={required}
            min={getEndMinDate()}
            max={maxDate || undefined}
            aria-required={required || undefined}
            aria-invalid={(error || !!validationError) || undefined}
            aria-describedby={effectiveAriaDescribedBy}
            style={Object.keys(sizeStyle).length > 0 ? sizeStyle : undefined}
          />
        </div>

        {/* Clear Button */}
        {showClearButton && hasDates && (
          <div
            style={{
              display: 'flex',
              alignItems: isHorizontal ? 'flex-end' : 'flex-start',
              paddingBottom: isHorizontal ? '0.125rem' : undefined,
            }}
          >
            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={handleClear}
              disabled={disabled}
              aria-label="Clear date range"
              style={{
                padding: '0.375rem 0.5rem',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap',
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {displayError && (
        <span
          id={`${id}-error`}
          className={HB_CLASSES.formErrorText}
          role="alert"
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {displayError}
        </span>
      )}

      {/* Success Message */}
      {!displayError && successMessage && (
        <span
          id={`${id}-success`}
          className={HB_CLASSES.formSuccessText}
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {successMessage}
        </span>
      )}

      {/* Help Text */}
      {!displayError && !successMessage && helpText && (
        <span
          id={`${id}-help`}
          className={HB_CLASSES.formHelp}
          style={{ display: 'block', marginTop: '0.375rem' }}
        >
          {helpText}
        </span>
      )}
    </fieldset>
  );
};

DateRangePicker.propTypes = {
  id: PropTypes.string.isRequired,
  legend: PropTypes.string,
  startLabel: PropTypes.string,
  endLabel: PropTypes.string,
  startValue: PropTypes.string,
  endValue: PropTypes.string,
  defaultStartValue: PropTypes.string,
  defaultEndValue: PropTypes.string,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  onStartChange: PropTypes.func,
  onEndChange: PropTypes.func,
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
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  showClearButton: PropTypes.bool,
  onClear: PropTypes.func,
};

DateRangePicker.defaultProps = {
  legend: undefined,
  startLabel: 'Start Date',
  endLabel: 'End Date',
  startValue: undefined,
  endValue: undefined,
  defaultStartValue: undefined,
  defaultEndValue: undefined,
  minDate: undefined,
  maxDate: undefined,
  onStartChange: undefined,
  onEndChange: undefined,
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
  orientation: 'horizontal',
  size: 'md',
  className: '',
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
  showClearButton: false,
  onClear: undefined,
};

export default DateRangePicker;