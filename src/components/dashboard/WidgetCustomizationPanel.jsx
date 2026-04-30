import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useWidgetCustomization } from '../../context/WidgetCustomizationContext.jsx';
import { HB_CLASSES } from '../../constants/constants.js';

/**
 * Returns an SVG icon element for the given icon identifier.
 * @param {string} iconName - The icon identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getPanelIcon = (iconName) => {
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

  switch (iconName) {
    case 'chevron-up':
      return (
        <svg {...iconProps}>
          <polyline points="18 15 12 9 6 15" />
        </svg>
      );
    case 'chevron-down':
      return (
        <svg {...iconProps}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case 'eye':
      return (
        <svg {...iconProps}>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'eye-off':
      return (
        <svg {...iconProps}>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...iconProps}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'move':
      return (
        <svg {...iconProps}>
          <polyline points="5 9 2 12 5 15" />
          <polyline points="9 5 12 2 15 5" />
          <polyline points="15 19 12 22 9 19" />
          <polyline points="19 9 22 12 19 15" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="12" y1="2" x2="12" y2="22" />
        </svg>
      );
    case 'x':
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
  }
};

/**
 * WidgetCustomizationPanel component.
 * Panel component for managing dashboard widget customization. Provides
 * checkboxes to show/hide widgets and arrow buttons to reorder. Includes
 * 'Reset to Default' button. Uses HB CSS form and button classes.
 * Accessible with ARIA labels.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.isOpen=false] - Whether the panel is currently open/visible
 * @param {Function} [props.onClose] - Callback invoked when the panel should close
 * @returns {React.ReactElement|null} The widget customization panel element or null if not open
 */
const WidgetCustomizationPanel = ({ className, id, isOpen, onClose }) => {
  const {
    widgets,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefaults,
    isCustomized,
  } = useWidgetCustomization();

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  /**
   * Focus the close button when the panel opens.
   * Stores the previously focused element for restoration on close.
   */
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement;

      const timer = setTimeout(() => {
        if (closeButtonRef.current) {
          closeButtonRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    } else {
      if (previousActiveElementRef.current && typeof previousActiveElementRef.current.focus === 'function') {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen]);

  /**
   * Handles keyboard events for the panel.
   * Closes on Escape key press.
   */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /**
   * Handles closing the panel.
   */
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  /**
   * Handles toggling visibility for a specific widget.
   * @param {string} widgetId - The widget identifier
   */
  const handleToggleVisibility = useCallback((widgetId) => {
    toggleWidgetVisibility(widgetId);
  }, [toggleWidgetVisibility]);

  /**
   * Handles moving a widget up in order.
   * @param {string} widgetId - The widget identifier
   * @param {number} currentOrder - The current order of the widget
   */
  const handleMoveUp = useCallback((widgetId, currentOrder) => {
    if (currentOrder > 1) {
      reorderWidgets(widgetId, currentOrder - 1);
    }
  }, [reorderWidgets]);

  /**
   * Handles moving a widget down in order.
   * @param {string} widgetId - The widget identifier
   * @param {number} currentOrder - The current order of the widget
   */
  const handleMoveDown = useCallback((widgetId, currentOrder) => {
    if (currentOrder < widgets.length) {
      reorderWidgets(widgetId, currentOrder + 1);
    }
  }, [reorderWidgets, widgets.length]);

  /**
   * Handles resetting widget preferences to defaults.
   */
  const handleResetDefaults = useCallback(() => {
    resetToDefaults();
  }, [resetToDefaults]);

  if (!isOpen) {
    return null;
  }

  const visibleCount = widgets.filter((w) => w.visible).length;
  const totalCount = widgets.length;

  const containerClassName = [
    HB_CLASSES.card,
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      id={id || 'widget-customization-panel'}
      className={containerClassName}
      ref={panelRef}
      role="region"
      aria-label="Dashboard widget customization"
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        className={HB_CLASSES.cardHeader}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '0.5rem',
              backgroundColor: '#e6f0fa',
              color: '#0069cc',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {getPanelIcon('settings')}
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '1.0625rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
              }}
            >
              Customize Dashboard
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.75rem',
                color: '#6b7280',
                lineHeight: 1.4,
              }}
            >
              Show, hide, or reorder your widgets
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          ref={closeButtonRef}
          onClick={handleClose}
          aria-label="Close customization panel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2rem',
            height: '2rem',
            padding: 0,
            background: 'none',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            color: '#6b7280',
            transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          {getPanelIcon('x')}
        </button>
      </div>

      {/* Info bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.625rem 1.5rem',
          backgroundColor: '#eff6ff',
          borderBottom: '1px solid #bfdbfe',
          fontSize: '0.8125rem',
          color: '#1e40af',
          lineHeight: 1.5,
        }}
        role="status"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          Showing {visibleCount} of {totalCount} widgets.
          {isCustomized && ' Your layout has been customized.'}
        </span>
      </div>

      {/* Body - Widget list */}
      <div
        className={HB_CLASSES.cardBody}
        style={{ padding: '0.75rem 1rem' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
          }}
          role="list"
          aria-label="Dashboard widgets"
        >
          {widgets.map((widget, index) => {
            const isFirst = index === 0;
            const isLast = index === widgets.length - 1;

            return (
              <div
                key={widget.id}
                role="listitem"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  padding: '0.625rem 0.75rem',
                  backgroundColor: widget.visible ? '#f9fafb' : '#ffffff',
                  border: '1px solid',
                  borderColor: widget.visible ? '#e5e7eb' : '#f3f4f6',
                  borderRadius: '0.375rem',
                  opacity: widget.visible ? 1 : 0.6,
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                {/* Left side: checkbox + drag handle + label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  {/* Drag handle indicator */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d1d5db',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {getPanelIcon('move')}
                  </div>

                  {/* Visibility checkbox */}
                  <div className={HB_CLASSES.formCheck} style={{ marginBottom: 0 }}>
                    <input
                      id={`widget-visibility-${widget.id}`}
                      type="checkbox"
                      className={HB_CLASSES.formCheckInput}
                      checked={widget.visible}
                      onChange={() => handleToggleVisibility(widget.id)}
                      aria-label={widget.visible ? `Hide ${widget.label}` : `Show ${widget.label}`}
                      style={{ marginTop: 0 }}
                    />
                    <label
                      htmlFor={`widget-visibility-${widget.id}`}
                      className={HB_CLASSES.formCheckLabel}
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: widget.visible ? '#111827' : '#9ca3af',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {widget.label}
                    </label>
                  </div>
                </div>

                {/* Right side: reorder controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    flexShrink: 0,
                  }}
                >
                  {/* Visibility icon indicator */}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: widget.visible ? '#10b981' : '#9ca3af',
                      marginRight: '0.25rem',
                    }}
                    aria-hidden="true"
                    title={widget.visible ? 'Visible' : 'Hidden'}
                  >
                    {widget.visible ? getPanelIcon('eye') : getPanelIcon('eye-off')}
                  </span>

                  {/* Move up button */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(widget.id, widget.order)}
                    disabled={isFirst}
                    aria-label={`Move ${widget.label} up`}
                    title="Move up"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.75rem',
                      height: '1.75rem',
                      padding: 0,
                      background: 'none',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      cursor: isFirst ? 'not-allowed' : 'pointer',
                      color: isFirst ? '#d1d5db' : '#6b7280',
                      opacity: isFirst ? 0.5 : 1,
                      transition: 'all 0.15s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      if (!isFirst) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#0069cc';
                        e.currentTarget.style.borderColor = '#0069cc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isFirst) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                  >
                    {getPanelIcon('chevron-up')}
                  </button>

                  {/* Move down button */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(widget.id, widget.order)}
                    disabled={isLast}
                    aria-label={`Move ${widget.label} down`}
                    title="Move down"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '1.75rem',
                      height: '1.75rem',
                      padding: 0,
                      background: 'none',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      cursor: isLast ? 'not-allowed' : 'pointer',
                      color: isLast ? '#d1d5db' : '#6b7280',
                      opacity: isLast ? 0.5 : 1,
                      transition: 'all 0.15s ease-in-out',
                    }}
                    onMouseEnter={(e) => {
                      if (!isLast) {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#0069cc';
                        e.currentTarget.style.borderColor = '#0069cc';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isLast) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#6b7280';
                        e.currentTarget.style.borderColor = '#d1d5db';
                      }
                    }}
                  >
                    {getPanelIcon('chevron-down')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div
        className={HB_CLASSES.cardFooter}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          padding: '0.75rem 1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {/* Reset to defaults button */}
        <button
          type="button"
          className={HB_CLASSES.btnTertiary}
          onClick={handleResetDefaults}
          disabled={!isCustomized}
          aria-label="Reset dashboard to default layout"
          style={{
            padding: '0.25rem 0.625rem',
            fontSize: '0.8125rem',
            opacity: isCustomized ? 1 : 0.5,
            cursor: isCustomized ? 'pointer' : 'not-allowed',
          }}
        >
          {getPanelIcon('refresh')}
          Reset to Default
        </button>

        {/* Done button */}
        <button
          type="button"
          className={HB_CLASSES.btnPrimary}
          onClick={handleClose}
          aria-label="Done customizing dashboard"
          style={{
            padding: '0.375rem 1rem',
            fontSize: '0.8125rem',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

WidgetCustomizationPanel.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

WidgetCustomizationPanel.defaultProps = {
  className: '',
  id: undefined,
  isOpen: false,
  onClose: undefined,
};

export default WidgetCustomizationPanel;