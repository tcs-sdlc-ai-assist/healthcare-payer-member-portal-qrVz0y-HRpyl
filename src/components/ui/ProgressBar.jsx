import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatProgressPercentage } from '../../utils/formatters.js';

/**
 * Reusable ProgressBar component for displaying deductible and out-of-pocket progress.
 * Shows used/max amounts with percentage fill, currency formatting, and accessible
 * ARIA progressbar role. Supports multiple color variants and size options.
 *
 * @param {Object} props
 * @param {number} props.used - Amount used toward the maximum
 * @param {number} props.max - Maximum amount
 * @param {string} [props.variant='brand'] - Color variant ('brand', 'success', 'warning', 'error', 'info')
 * @param {string} [props.size='md'] - Bar height size ('sm', 'md', 'lg')
 * @param {string} [props.label] - Accessible label describing what the progress bar represents
 * @param {boolean} [props.showAmounts=true] - Whether to display used/max currency amounts
 * @param {boolean} [props.showPercentage=true] - Whether to display the percentage text
 * @param {boolean} [props.showRemaining=false] - Whether to display the remaining amount
 * @param {string} [props.usedLabel='Used'] - Label for the used amount
 * @param {string} [props.maxLabel='Max'] - Label for the max amount
 * @param {string} [props.remainingLabel='Remaining'] - Label for the remaining amount
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute for the container
 * @param {boolean} [props.animate=true] - Whether to animate the progress bar fill
 * @returns {React.ReactElement} The progress bar element
 */
const ProgressBar = ({
  used,
  max,
  variant,
  size,
  label,
  showAmounts,
  showPercentage,
  showRemaining,
  usedLabel,
  maxLabel,
  remainingLabel,
  className,
  id,
  animate,
}) => {
  const safeUsed = typeof used === 'number' && !isNaN(used) ? Math.max(used, 0) : 0;
  const safeMax = typeof max === 'number' && !isNaN(max) ? Math.max(max, 0) : 0;

  const percentage = safeMax > 0 ? Math.min((safeUsed / safeMax) * 100, 100) : 0;
  const remaining = safeMax > 0 ? Math.max(safeMax - safeUsed, 0) : 0;

  const formattedUsed = formatCurrency(safeUsed);
  const formattedMax = formatCurrency(safeMax);
  const formattedRemaining = formatCurrency(remaining);
  const formattedPercentage = formatProgressPercentage(safeUsed, safeMax);

  /**
   * Returns the fill color style based on the variant.
   * @param {string} v - The variant string
   * @returns {string} The CSS background color value
   */
  const getFillColor = (v) => {
    switch (v) {
      case 'brand':
        return '#0069cc';
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#0069cc';
    }
  };

  /**
   * Returns the track background color based on the variant.
   * @param {string} v - The variant string
   * @returns {string} The CSS background color value for the track
   */
  const getTrackColor = (v) => {
    switch (v) {
      case 'brand':
        return '#e6f0fa';
      case 'success':
        return '#ecfdf5';
      case 'warning':
        return '#fffbeb';
      case 'error':
        return '#fef2f2';
      case 'info':
        return '#eff6ff';
      default:
        return '#e6f0fa';
    }
  };

  /**
   * Returns the percentage text color based on the variant.
   * @param {string} v - The variant string
   * @returns {string} The CSS color value
   */
  const getPercentageColor = (v) => {
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
      default:
        return '#0054a3';
    }
  };

  /**
   * Returns the bar height in pixels based on the size.
   * @param {string} s - The size string
   * @returns {string} The CSS height value
   */
  const getBarHeight = (s) => {
    switch (s) {
      case 'sm':
        return '0.375rem';
      case 'md':
        return '0.625rem';
      case 'lg':
        return '0.875rem';
      default:
        return '0.625rem';
    }
  };

  const fillColor = getFillColor(variant);
  const trackColor = getTrackColor(variant);
  const percentageColor = getPercentageColor(variant);
  const barHeight = getBarHeight(size);

  const accessibleLabel = label || `Progress: ${formattedUsed} of ${formattedMax}`;

  const containerClassName = ['hb-w-full', className || '']
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      id={id}
      className={containerClassName}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
    >
      {(showAmounts || showPercentage) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          {showAmounts && (
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.25rem',
                flexWrap: 'wrap',
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.25,
                }}
              >
                {formattedUsed}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: '#6b7280',
                  lineHeight: 1.25,
                }}
              >
                {usedLabel}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: '#9ca3af',
                  lineHeight: 1.25,
                }}
              >
                /
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#374151',
                  lineHeight: 1.25,
                }}
              >
                {formattedMax}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 400,
                  color: '#6b7280',
                  lineHeight: 1.25,
                }}
              >
                {maxLabel}
              </span>
            </div>
          )}
          {showPercentage && (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: percentageColor,
                lineHeight: 1.25,
                flexShrink: 0,
              }}
            >
              {formattedPercentage}
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        style={{
          width: '100%',
          height: barHeight,
          backgroundColor: trackColor,
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: fillColor,
            borderRadius: '9999px',
            transition: animate ? 'width 0.5s ease-in-out' : 'none',
            minWidth: percentage > 0 ? '0.25rem' : '0',
          }}
        />
      </div>

      {showRemaining && (
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.25rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#374151',
              lineHeight: 1.25,
            }}
          >
            {formattedRemaining}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 400,
              color: '#6b7280',
              lineHeight: 1.25,
            }}
          >
            {remainingLabel}
          </span>
        </div>
      )}
    </div>
  );
};

ProgressBar.propTypes = {
  used: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(['brand', 'success', 'warning', 'error', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.string,
  showAmounts: PropTypes.bool,
  showPercentage: PropTypes.bool,
  showRemaining: PropTypes.bool,
  usedLabel: PropTypes.string,
  maxLabel: PropTypes.string,
  remainingLabel: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  animate: PropTypes.bool,
};

ProgressBar.defaultProps = {
  variant: 'brand',
  size: 'md',
  label: undefined,
  showAmounts: true,
  showPercentage: true,
  showRemaining: false,
  usedLabel: 'Used',
  maxLabel: 'Max',
  remainingLabel: 'Remaining',
  className: '',
  id: undefined,
  animate: true,
};

export default ProgressBar;