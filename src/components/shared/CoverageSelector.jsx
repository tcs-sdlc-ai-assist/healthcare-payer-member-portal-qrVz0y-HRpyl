import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext.jsx';
import { getIDCards } from '../../services/idCardService.js';
import { getBenefits } from '../../services/benefitsService.js';
import { COVERAGE_TYPE, COVERAGE_TYPE_LABELS } from '../../constants/constants.js';
import Dropdown from '../ui/Dropdown.jsx';

/**
 * Returns a coverage type icon SVG element.
 * @param {string} coverageType - The coverage type identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getCoverageIcon = (coverageType) => {
  const iconProps = {
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
    style: { flexShrink: 0 },
  };

  switch (coverageType) {
    case 'MEDICAL':
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'DENTAL':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      );
    case 'VISION':
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'PHARMACY':
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
        </svg>
      );
    case 'BEHAVIORAL_HEALTH':
      return (
        <svg {...iconProps}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
};

/**
 * CoverageSelector component.
 * Coverage type selector dropdown for ID Cards and Benefits pages.
 * Displays available coverages (medical, dental, vision, pharmacy, behavioral health)
 * from the member's active coverage data. On selection change, invokes the onChange
 * callback with the selected coverage type. Uses Dropdown component with HB CSS styling.
 *
 * @param {Object} props
 * @param {string} [props.value] - Currently selected coverage type value (controlled)
 * @param {string} [props.defaultValue] - Default selected coverage type (uncontrolled)
 * @param {Function} [props.onChange] - Callback invoked when the selected coverage type changes, receives the new coverage type value
 * @param {string} [props.label='Coverage Type'] - Label text for the dropdown
 * @param {string} [props.placeholder='All Coverages'] - Placeholder text when no value is selected
 * @param {boolean} [props.showAllOption=true] - Whether to include an "All Coverages" option with empty value
 * @param {boolean} [props.required=false] - Whether a selection is required
 * @param {boolean} [props.disabled=false] - Whether the dropdown is disabled
 * @param {boolean} [props.error=false] - Whether the dropdown is in an error state
 * @param {string} [props.errorMessage] - Error message to display below the dropdown
 * @param {string} [props.helpText] - Help text to display below the dropdown
 * @param {string} [props.size='md'] - Dropdown size ('sm', 'md', 'lg')
 * @param {boolean} [props.native=true] - Whether to use native select element
 * @param {boolean} [props.block=true] - Whether the dropdown should be full width
 * @param {string} [props.source='benefits'] - Data source for available coverages ('benefits', 'idcards', 'static')
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute for the dropdown
 * @param {string} [props.ariaLabel] - Accessible label for the dropdown
 * @param {boolean} [props.showIcon=false] - Whether to show a coverage type icon next to the selected label
 * @returns {React.ReactElement} The coverage selector element
 */
const CoverageSelector = ({
  value,
  defaultValue,
  onChange,
  label,
  placeholder,
  showAllOption,
  required,
  disabled,
  error,
  errorMessage,
  helpText,
  size,
  native,
  block,
  source,
  className,
  id,
  ariaLabel,
  showIcon,
}) => {
  const { user } = useAuth();

  /**
   * Builds the list of available coverage type options based on the data source.
   * For 'benefits' and 'idcards' sources, filters to only coverage types
   * that the member actually has. For 'static', returns all coverage types.
   *
   * @returns {Object[]} Array of { value, label } option objects
   */
  const coverageOptions = useMemo(() => {
    const memberId = user?.memberId;

    let availableTypes = [];

    if (source === 'static' || !memberId) {
      availableTypes = Object.entries(COVERAGE_TYPE).map(([key, typeValue]) => ({
        value: typeValue,
        label: COVERAGE_TYPE_LABELS[typeValue] || key,
      }));
    } else if (source === 'idcards') {
      try {
        const result = getIDCards({ memberId, activeOnly: true });
        const cards = result.cards || [];

        const typeSet = new Set();
        cards.forEach((card) => {
          if (card.coverageType) {
            typeSet.add(card.coverageType);
          }
        });

        const coverageOrder = [
          COVERAGE_TYPE.MEDICAL,
          COVERAGE_TYPE.DENTAL,
          COVERAGE_TYPE.VISION,
          COVERAGE_TYPE.PHARMACY,
          COVERAGE_TYPE.BEHAVIORAL_HEALTH,
        ];

        coverageOrder.forEach((typeValue) => {
          if (typeSet.has(typeValue)) {
            availableTypes.push({
              value: typeValue,
              label: COVERAGE_TYPE_LABELS[typeValue] || typeValue,
            });
          }
        });
      } catch (err) {
        console.error('[CoverageSelector] Error fetching ID cards for coverage options:', err);
        availableTypes = Object.entries(COVERAGE_TYPE).map(([key, typeValue]) => ({
          value: typeValue,
          label: COVERAGE_TYPE_LABELS[typeValue] || key,
        }));
      }
    } else {
      // source === 'benefits' (default)
      try {
        const result = getBenefits({ memberId, activeOnly: true });
        const benefits = result.benefits || [];

        const typeSet = new Set();
        benefits.forEach((benefit) => {
          if (benefit.coverageType) {
            typeSet.add(benefit.coverageType);
          }
        });

        const coverageOrder = [
          COVERAGE_TYPE.MEDICAL,
          COVERAGE_TYPE.DENTAL,
          COVERAGE_TYPE.VISION,
          COVERAGE_TYPE.PHARMACY,
          COVERAGE_TYPE.BEHAVIORAL_HEALTH,
        ];

        coverageOrder.forEach((typeValue) => {
          if (typeSet.has(typeValue)) {
            availableTypes.push({
              value: typeValue,
              label: COVERAGE_TYPE_LABELS[typeValue] || typeValue,
            });
          }
        });
      } catch (err) {
        console.error('[CoverageSelector] Error fetching benefits for coverage options:', err);
        availableTypes = Object.entries(COVERAGE_TYPE).map(([key, typeValue]) => ({
          value: typeValue,
          label: COVERAGE_TYPE_LABELS[typeValue] || key,
        }));
      }
    }

    if (showAllOption) {
      return [{ value: '', label: placeholder || 'All Coverages' }, ...availableTypes];
    }

    return availableTypes;
  }, [user, source, showAllOption, placeholder]);

  /**
   * Handles coverage type selection change.
   * @param {string} newValue - The new selected coverage type value
   */
  const handleChange = useCallback((newValue) => {
    if (onChange && typeof onChange === 'function') {
      onChange(newValue);
    }
  }, [onChange]);

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const dropdownId = id || 'coverage-selector';

  return (
    <div
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}
    >
      {showIcon && value && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '1.75rem',
              height: '1.75rem',
              borderRadius: '0.375rem',
              backgroundColor: '#e6f0fa',
              color: '#0069cc',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {getCoverageIcon(value)}
          </div>
          <span
            style={{
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            {COVERAGE_TYPE_LABELS[value] || ''}
          </span>
        </div>
      )}

      <Dropdown
        id={dropdownId}
        label={label}
        options={coverageOptions}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        error={error}
        errorMessage={errorMessage}
        helpText={helpText}
        size={size}
        native={native}
        block={block}
        ariaLabel={ariaLabel || 'Select coverage type'}
        name="coverageType"
      />
    </div>
  );
};

CoverageSelector.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  showAllOption: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  helpText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  native: PropTypes.bool,
  block: PropTypes.bool,
  source: PropTypes.oneOf(['benefits', 'idcards', 'static']),
  className: PropTypes.string,
  id: PropTypes.string,
  ariaLabel: PropTypes.string,
  showIcon: PropTypes.bool,
};

CoverageSelector.defaultProps = {
  value: undefined,
  defaultValue: undefined,
  onChange: undefined,
  label: 'Coverage Type',
  placeholder: 'All Coverages',
  showAllOption: true,
  required: false,
  disabled: false,
  error: false,
  errorMessage: undefined,
  helpText: undefined,
  size: 'md',
  native: true,
  block: true,
  source: 'benefits',
  className: '',
  id: undefined,
  ariaLabel: undefined,
  showIcon: false,
};

export default CoverageSelector;