import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Reusable Dropdown component implementing HB CSS form classes.
 * Supports native select mode and custom listbox mode with accessible
 * ARIA listbox pattern, keyboard navigation, and floating label support.
 *
 * @param {Object} props
 * @param {string} props.id - HTML id attribute for the dropdown
 * @param {string} [props.label] - Label text for the dropdown
 * @param {Array<{value: string|number|boolean, label: string, disabled?: boolean}>} props.options - Array of option objects
 * @param {string|number|boolean|null} [props.value] - Currently selected value (controlled)
 * @param {string|number|boolean|null} [props.defaultValue] - Default selected value (uncontrolled)
 * @param {string} [props.placeholder='Select an option'] - Placeholder text when no value is selected
 * @param {Function} [props.onChange] - Callback invoked when the selected value changes
 * @param {Function} [props.onBlur] - Callback invoked when the dropdown loses focus
 * @param {Function} [props.onFocus] - Callback invoked when the dropdown gains focus
 * @param {boolean} [props.disabled=false] - Whether the dropdown is disabled
 * @param {boolean} [props.required=false] - Whether the dropdown is required
 * @param {boolean} [props.error=false] - Whether the dropdown is in an error state
 * @param {boolean} [props.success=false] - Whether the dropdown is in a success state
 * @param {string} [props.errorMessage] - Error message to display below the dropdown
 * @param {string} [props.successMessage] - Success message to display below the dropdown
 * @param {string} [props.helpText] - Help text to display below the dropdown
 * @param {boolean} [props.floatingLabel=false] - Whether to use floating label style
 * @param {boolean} [props.native=true] - Whether to use native select element or custom listbox
 * @param {boolean} [props.searchable=false] - Whether the custom listbox supports type-ahead search (only when native=false)
 * @param {string} [props.className] - Additional CSS class names to append
 * @param {string} [props.name] - HTML name attribute
 * @param {string} [props.ariaLabel] - Accessible label for the dropdown
 * @param {string} [props.ariaDescribedBy] - ID of the element that describes the dropdown
 * @param {string} [props.ariaLabelledBy] - ID of the element that labels the dropdown
 * @param {boolean} [props.block=false] - Whether the dropdown should be full width
 * @param {string} [props.size='md'] - Dropdown size ('sm', 'md', 'lg')
 * @returns {React.ReactElement} The dropdown element
 */
const Dropdown = ({
  id,
  label,
  options,
  value: controlledValue,
  defaultValue,
  placeholder,
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
  floatingLabel,
  native,
  searchable,
  className,
  name,
  ariaLabel,
  ariaDescribedBy,
  ariaLabelledBy,
  block,
  size,
}) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue !== undefined && defaultValue !== null ? defaultValue : '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTerm, setSearchTerm] = useState('');

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const optionRefs = useRef([]);

  const currentValue = isControlled ? controlledValue : internalValue;

  /**
   * Returns the filtered list of enabled options.
   */
  const enabledOptions = useMemo(() => {
    if (!Array.isArray(options)) {
      return [];
    }
    return options.filter((opt) => !opt.disabled);
  }, [options]);

  /**
   * Returns the currently selected option object.
   */
  const selectedOption = useMemo(() => {
    if (!Array.isArray(options) || currentValue === null || currentValue === undefined || currentValue === '') {
      return null;
    }
    return options.find((opt) => String(opt.value) === String(currentValue)) || null;
  }, [options, currentValue]);

  /**
   * Returns the display text for the current selection.
   */
  const displayText = useMemo(() => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return '';
  }, [selectedOption]);

  /**
   * Returns the index of the currently selected option in the full options array.
   */
  const selectedIndex = useMemo(() => {
    if (!Array.isArray(options) || currentValue === null || currentValue === undefined || currentValue === '') {
      return -1;
    }
    return options.findIndex((opt) => String(opt.value) === String(currentValue));
  }, [options, currentValue]);

  /**
   * Handles value change for both native and custom modes.
   * @param {string|number|boolean} newValue - The new selected value
   */
  const handleValueChange = useCallback((newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  }, [isControlled, onChange]);

  /**
   * Handles native select change event.
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
   */
  const handleNativeChange = useCallback((e) => {
    const newValue = e.target.value;
    handleValueChange(newValue);
  }, [handleValueChange]);

  /**
   * Handles native select blur event.
   */
  const handleNativeBlur = useCallback((e) => {
    if (onBlur && typeof onBlur === 'function') {
      onBlur(e);
    }
  }, [onBlur]);

  /**
   * Handles native select focus event.
   */
  const handleNativeFocus = useCallback((e) => {
    if (onFocus && typeof onFocus === 'function') {
      onFocus(e);
    }
  }, [onFocus]);

  /**
   * Opens the custom listbox dropdown.
   */
  const openListbox = useCallback(() => {
    if (disabled) {
      return;
    }

    setIsOpen(true);

    const idx = selectedIndex >= 0 ? selectedIndex : 0;
    setActiveIndex(idx);
  }, [disabled, selectedIndex]);

  /**
   * Closes the custom listbox dropdown.
   */
  const closeListbox = useCallback(() => {
    setIsOpen(false);
    setActiveIndex(-1);
    setSearchTerm('');

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, []);

  /**
   * Toggles the custom listbox dropdown.
   */
  const toggleListbox = useCallback(() => {
    if (isOpen) {
      closeListbox();
    } else {
      openListbox();
    }
  }, [isOpen, closeListbox, openListbox]);

  /**
   * Selects an option by index in the custom listbox.
   * @param {number} index - The option index
   */
  const selectOption = useCallback((index) => {
    if (!Array.isArray(options) || index < 0 || index >= options.length) {
      return;
    }

    const option = options[index];

    if (option.disabled) {
      return;
    }

    handleValueChange(option.value);
    closeListbox();

    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }, [options, handleValueChange, closeListbox]);

  /**
   * Handles click on a custom listbox option.
   * @param {number} index - The option index
   * @param {React.MouseEvent} e - The mouse event
   */
  const handleOptionClick = useCallback((index, e) => {
    e.preventDefault();
    e.stopPropagation();
    selectOption(index);
  }, [selectOption]);

  /**
   * Handles mouse enter on a custom listbox option.
   * @param {number} index - The option index
   */
  const handleOptionMouseEnter = useCallback((index) => {
    if (!Array.isArray(options) || options[index]?.disabled) {
      return;
    }
    setActiveIndex(index);
  }, [options]);

  /**
   * Scrolls the active option into view within the listbox.
   * @param {number} index - The option index to scroll to
   */
  const scrollOptionIntoView = useCallback((index) => {
    if (optionRefs.current[index] && listboxRef.current) {
      const optionEl = optionRefs.current[index];
      const listboxEl = listboxRef.current;

      const optionTop = optionEl.offsetTop;
      const optionBottom = optionTop + optionEl.offsetHeight;
      const listboxScrollTop = listboxEl.scrollTop;
      const listboxBottom = listboxScrollTop + listboxEl.clientHeight;

      if (optionTop < listboxScrollTop) {
        listboxEl.scrollTop = optionTop;
      } else if (optionBottom > listboxBottom) {
        listboxEl.scrollTop = optionBottom - listboxEl.clientHeight;
      }
    }
  }, []);

  /**
   * Finds the next enabled option index in a given direction.
   * @param {number} fromIndex - Starting index
   * @param {number} direction - Direction (1 for down, -1 for up)
   * @returns {number} The next enabled option index, or fromIndex if none found
   */
  const findNextEnabledIndex = useCallback((fromIndex, direction) => {
    if (!Array.isArray(options) || options.length === 0) {
      return -1;
    }

    let nextIndex = fromIndex + direction;
    const len = options.length;

    while (nextIndex >= 0 && nextIndex < len) {
      if (!options[nextIndex].disabled) {
        return nextIndex;
      }
      nextIndex += direction;
    }

    return fromIndex;
  }, [options]);

  /**
   * Handles type-ahead search in the custom listbox.
   * @param {string} char - The typed character
   */
  const handleTypeAhead = useCallback((char) => {
    if (!searchable || !Array.isArray(options) || options.length === 0) {
      return;
    }

    const newSearchTerm = searchTerm + char.toLowerCase();
    setSearchTerm(newSearchTerm);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm('');
      searchTimeoutRef.current = null;
    }, 500);

    const matchIndex = options.findIndex((opt) => {
      return !opt.disabled && opt.label.toLowerCase().startsWith(newSearchTerm);
    });

    if (matchIndex >= 0) {
      setActiveIndex(matchIndex);
      scrollOptionIntoView(matchIndex);
    }
  }, [searchable, options, searchTerm, scrollOptionIntoView]);

  /**
   * Handles keyboard events on the custom listbox trigger.
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleTriggerKeyDown = useCallback((e) => {
    if (disabled) {
      return;
    }

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && activeIndex >= 0) {
          selectOption(activeIndex);
        } else {
          openListbox();
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          openListbox();
        } else {
          const nextDown = findNextEnabledIndex(activeIndex, 1);
          if (nextDown !== activeIndex) {
            setActiveIndex(nextDown);
            scrollOptionIntoView(nextDown);
          }
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          openListbox();
        } else {
          const nextUp = findNextEnabledIndex(activeIndex, -1);
          if (nextUp !== activeIndex) {
            setActiveIndex(nextUp);
            scrollOptionIntoView(nextUp);
          }
        }
        break;

      case 'Home':
        e.preventDefault();
        if (isOpen && Array.isArray(options) && options.length > 0) {
          const firstEnabled = findNextEnabledIndex(-1, 1);
          if (firstEnabled >= 0) {
            setActiveIndex(firstEnabled);
            scrollOptionIntoView(firstEnabled);
          }
        }
        break;

      case 'End':
        e.preventDefault();
        if (isOpen && Array.isArray(options) && options.length > 0) {
          const lastEnabled = findNextEnabledIndex(options.length, -1);
          if (lastEnabled >= 0) {
            setActiveIndex(lastEnabled);
            scrollOptionIntoView(lastEnabled);
          }
        }
        break;

      case 'Escape':
        e.preventDefault();
        if (isOpen) {
          closeListbox();
          if (triggerRef.current) {
            triggerRef.current.focus();
          }
        }
        break;

      case 'Tab':
        if (isOpen) {
          closeListbox();
        }
        break;

      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (isOpen) {
            handleTypeAhead(e.key);
          }
        }
        break;
    }
  }, [
    disabled,
    isOpen,
    activeIndex,
    options,
    selectOption,
    openListbox,
    closeListbox,
    findNextEnabledIndex,
    scrollOptionIntoView,
    handleTypeAhead,
  ]);

  /**
   * Handles click outside to close the custom listbox.
   */
  useEffect(() => {
    if (!isOpen || native) {
      return;
    }

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeListbox();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, native, closeListbox]);

  /**
   * Scrolls active option into view when activeIndex changes.
   */
  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      scrollOptionIntoView(activeIndex);
    }
  }, [isOpen, activeIndex, scrollOptionIntoView]);

  /**
   * Cleanup search timeout on unmount.
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Returns the input class based on validation state.
   */
  const getInputClass = () => {
    if (error) {
      return HB_CLASSES.formInputError;
    }
    if (success) {
      return HB_CLASSES.formInputSuccess;
    }
    return HB_CLASSES.formSelect;
  };

  /**
   * Returns size-specific inline styles.
   * @param {string} s - The size string
   * @returns {Object} Inline style object
   */
  const getSizeStyle = (s) => {
    switch (s) {
      case 'sm':
        return {
          padding: '0.375rem 2.5rem 0.375rem 0.75rem',
          fontSize: '0.875rem',
        };
      case 'lg':
        return {
          padding: '0.75rem 2.5rem 0.75rem 0.75rem',
          fontSize: '1.125rem',
        };
      case 'md':
      default:
        return {};
    }
  };

  const sizeStyle = getSizeStyle(size);

  const labelClass = required ? HB_CLASSES.formLabelRequired : HB_CLASSES.formLabel;

  const descriptionId = errorMessage
    ? `${id}-error`
    : successMessage
      ? `${id}-success`
      : helpText
        ? `${id}-help`
        : undefined;

  const effectiveAriaDescribedBy = ariaDescribedBy || descriptionId;

  const containerClassName = [
    HB_CLASSES.formGroup,
    block ? 'hb-w-full' : '',
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  /**
   * Renders the native select element.
   */
  const renderNativeSelect = () => {
    const selectClass = getInputClass();

    if (floatingLabel) {
      return (
        <div className="hb-form-floating">
          <select
            id={id}
            name={name}
            className={selectClass}
            value={currentValue !== null && currentValue !== undefined ? String(currentValue) : ''}
            onChange={handleNativeChange}
            onBlur={handleNativeBlur}
            onFocus={handleNativeFocus}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error || undefined}
            aria-label={ariaLabel}
            aria-describedby={effectiveAriaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            style={Object.keys(sizeStyle).length > 0 ? sizeStyle : undefined}
          >
            {placeholder && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}
            {Array.isArray(options) && options.map((opt) => (
              <option
                key={String(opt.value)}
                value={String(opt.value)}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
          {label && (
            <label
              htmlFor={id}
              className="hb-form-floating-label"
            >
              {label}
              {required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
          )}
        </div>
      );
    }

    return (
      <>
        {label && (
          <label htmlFor={id} className={labelClass}>
            {label}
          </label>
        )}
        <select
          id={id}
          name={name}
          className={selectClass}
          value={currentValue !== null && currentValue !== undefined ? String(currentValue) : ''}
          onChange={handleNativeChange}
          onBlur={handleNativeBlur}
          onFocus={handleNativeFocus}
          disabled={disabled}
          required={required}
          aria-required={required || undefined}
          aria-invalid={error || undefined}
          aria-label={ariaLabel}
          aria-describedby={effectiveAriaDescribedBy}
          aria-labelledby={ariaLabelledBy}
          style={Object.keys(sizeStyle).length > 0 ? sizeStyle : undefined}
        >
          {placeholder && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {Array.isArray(options) && options.map((opt) => (
            <option
              key={String(opt.value)}
              value={String(opt.value)}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </>
    );
  };

  /**
   * Renders the custom listbox dropdown.
   */
  const renderCustomListbox = () => {
    const listboxId = `${id}-listbox`;
    const activeOptionId = activeIndex >= 0 && Array.isArray(options) && options[activeIndex]
      ? `${id}-option-${activeIndex}`
      : undefined;

    const triggerClass = [
      error ? 'hb-form-input hb-form-input-error' : success ? 'hb-form-input hb-form-input-success' : 'hb-form-input',
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    const triggerStyle = {
      ...sizeStyle,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.5rem',
      paddingRight: '2.5rem',
      position: 'relative',
      userSelect: 'none',
      backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
      color: displayText ? '#1f2937' : '#9ca3af',
    };

    return (
      <>
        {label && !floatingLabel && (
          <label id={`${id}-label`} className={labelClass}>
            {label}
          </label>
        )}
        <div
          ref={containerRef}
          style={{ position: 'relative' }}
        >
          {floatingLabel && label && (
            <div className="hb-form-floating" style={{ position: 'relative' }}>
              <div
                ref={triggerRef}
                id={id}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={isOpen ? activeOptionId : undefined}
                aria-required={required || undefined}
                aria-invalid={error || undefined}
                aria-label={ariaLabel}
                aria-describedby={effectiveAriaDescribedBy}
                aria-labelledby={ariaLabelledBy || `${id}-label`}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : 0}
                className={triggerClass}
                style={{
                  ...triggerStyle,
                  paddingTop: '1.625rem',
                  paddingBottom: '0.375rem',
                }}
                onClick={toggleListbox}
                onKeyDown={handleTriggerKeyDown}
                onBlur={(e) => {
                  if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
                    closeListbox();
                    if (onBlur && typeof onBlur === 'function') {
                      onBlur(e);
                    }
                  }
                }}
                onFocus={(e) => {
                  if (onFocus && typeof onFocus === 'function') {
                    onFocus(e);
                  }
                }}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {displayText || placeholder || '\u00A0'}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
                    transition: 'transform 0.15s ease-in-out',
                    flexShrink: 0,
                    pointerEvents: 'none',
                  }}
                >
                  <path d="M6 8l4 4 4-4" />
                </svg>
              </div>
              <label
                id={`${id}-label`}
                className="hb-form-floating-label"
                style={{
                  opacity: displayText ? 0.85 : undefined,
                  transform: displayText ? 'scale(0.75) translateY(-0.5rem)' : undefined,
                  color: displayText ? '#374151' : undefined,
                }}
              >
                {label}
                {required && <span style={{ color: '#ef4444' }}> *</span>}
              </label>
            </div>
          )}

          {!floatingLabel && (
            <div
              ref={triggerRef}
              id={id}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={isOpen ? listboxId : undefined}
              aria-activedescendant={isOpen ? activeOptionId : undefined}
              aria-required={required || undefined}
              aria-invalid={error || undefined}
              aria-label={ariaLabel}
              aria-describedby={effectiveAriaDescribedBy}
              aria-labelledby={ariaLabelledBy || (label ? `${id}-label` : undefined)}
              aria-disabled={disabled || undefined}
              tabIndex={disabled ? -1 : 0}
              className={triggerClass}
              style={triggerStyle}
              onClick={toggleListbox}
              onKeyDown={handleTriggerKeyDown}
              onBlur={(e) => {
                if (containerRef.current && !containerRef.current.contains(e.relatedTarget)) {
                  closeListbox();
                  if (onBlur && typeof onBlur === 'function') {
                    onBlur(e);
                  }
                }
              }}
              onFocus={(e) => {
                if (onFocus && typeof onFocus === 'function') {
                  onFocus(e);
                }
              }}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {displayText || placeholder || '\u00A0'}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
                  transition: 'transform 0.15s ease-in-out',
                  flexShrink: 0,
                  pointerEvents: 'none',
                }}
              >
                <path d="M6 8l4 4 4-4" />
              </svg>
            </div>
          )}

          {isOpen && (
            <ul
              ref={listboxRef}
              id={listboxId}
              role="listbox"
              aria-labelledby={ariaLabelledBy || (label ? `${id}-label` : undefined)}
              aria-label={!label ? ariaLabel : undefined}
              tabIndex={-1}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 50,
                marginTop: '0.25rem',
                maxHeight: '15rem',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
                listStyle: 'none',
                padding: '0.25rem 0',
                margin: 0,
              }}
              className="hb-scrollbar-thin"
            >
              {Array.isArray(options) && options.length > 0 ? (
                options.map((opt, index) => {
                  const isSelected = String(opt.value) === String(currentValue);
                  const isActive = index === activeIndex;
                  const isDisabled = opt.disabled;

                  return (
                    <li
                      key={String(opt.value)}
                      id={`${id}-option-${index}`}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={isDisabled || undefined}
                      onClick={(e) => {
                        if (!isDisabled) {
                          handleOptionClick(index, e);
                        }
                      }}
                      onMouseEnter={() => handleOptionMouseEnter(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
                        lineHeight: 1.5,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        backgroundColor: isActive ? '#e6f0fa' : isSelected ? '#f3f4f6' : 'transparent',
                        color: isDisabled ? '#9ca3af' : '#1f2937',
                        fontWeight: isSelected ? 500 : 400,
                        transition: 'background-color 0.1s ease-in-out',
                        userSelect: 'none',
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0069cc"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          style={{ flexShrink: 0 }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </li>
                  );
                })
              ) : (
                <li
                  role="option"
                  aria-disabled="true"
                  aria-selected={false}
                  style={{
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    textAlign: 'center',
                    cursor: 'default',
                  }}
                >
                  No options available
                </li>
              )}
            </ul>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={containerClassName}>
      {native ? renderNativeSelect() : renderCustomListbox()}

      {errorMessage && (
        <span
          id={`${id}-error`}
          className={HB_CLASSES.formErrorText}
          role="alert"
        >
          {errorMessage}
        </span>
      )}

      {!errorMessage && successMessage && (
        <span
          id={`${id}-success`}
          className={HB_CLASSES.formSuccessText}
        >
          {successMessage}
        </span>
      )}

      {!errorMessage && !successMessage && helpText && (
        <span
          id={`${id}-help`}
          className={HB_CLASSES.formHelp}
        >
          {helpText}
        </span>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  placeholder: PropTypes.string,
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
  floatingLabel: PropTypes.bool,
  native: PropTypes.bool,
  searchable: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
  ariaLabelledBy: PropTypes.string,
  block: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

Dropdown.defaultProps = {
  label: undefined,
  value: undefined,
  defaultValue: undefined,
  placeholder: 'Select an option',
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
  floatingLabel: false,
  native: true,
  searchable: false,
  className: '',
  name: undefined,
  ariaLabel: undefined,
  ariaDescribedBy: undefined,
  ariaLabelledBy: undefined,
  block: false,
  size: 'md',
};

export default Dropdown;