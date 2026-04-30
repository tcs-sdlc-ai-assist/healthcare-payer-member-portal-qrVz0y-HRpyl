import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useWidgetCustomization } from '../../context/WidgetCustomizationContext.jsx';
import { HB_CLASSES } from '../../constants/constants.js';

import RecentClaimsWidget from './RecentClaimsWidget.jsx';
import DeductibleOOPWidget from './DeductibleOOPWidget.jsx';
import IDCardSummaryWidget from './IDCardSummaryWidget.jsx';
import FindCareCTAWidget from './FindCareCTAWidget.jsx';
import LearningCenterWidget from './LearningCenterWidget.jsx';

/**
 * Maps widget IDs to their corresponding React components.
 * Only widgets with implemented components are included.
 * @type {Object.<string, React.ComponentType>}
 */
const WIDGET_COMPONENT_MAP = {
  claims: RecentClaimsWidget,
  deductible: DeductibleOOPWidget,
  idCards: IDCardSummaryWidget,
  getCare: FindCareCTAWidget,
  support: LearningCenterWidget,
};

/**
 * Returns an SVG icon element for the given icon identifier.
 * @param {string} iconName - The icon identifier
 * @returns {React.ReactElement} The SVG icon element
 */
const getWidgetIcon = (iconName) => {
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
    case 'settings':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'refresh':
      return (
        <svg {...iconProps}>
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
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
 * WidgetWrapper component.
 * Wraps an individual dashboard widget with drag handle, visibility toggle,
 * reorder controls, and consistent card styling.
 *
 * @param {Object} props
 * @param {Object} props.widgetConfig - The widget configuration object from WidgetCustomizationContext
 * @param {React.ReactNode} props.children - The widget content to render
 * @param {boolean} props.isCustomizing - Whether customization mode is active
 * @param {Function} props.onToggleVisibility - Callback to toggle widget visibility
 * @param {Function} props.onMoveUp - Callback to move widget up in order
 * @param {Function} props.onMoveDown - Callback to move widget down in order
 * @param {boolean} props.isFirst - Whether this is the first widget in the list
 * @param {boolean} props.isLast - Whether this is the last widget in the list
 * @returns {React.ReactElement} The widget wrapper element
 */
const WidgetWrapper = ({
  widgetConfig,
  children,
  isCustomizing,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const hasComponent = WIDGET_COMPONENT_MAP[widgetConfig.id] !== undefined;

  if (!isCustomizing && !widgetConfig.visible) {
    return null;
  }

  if (!isCustomizing && !hasComponent) {
    return null;
  }

  return (
    <div
      style={{
        position: 'relative',
        opacity: !widgetConfig.visible ? 0.5 : 1,
        transition: 'opacity 0.2s ease-in-out',
      }}
      data-widget-id={widgetConfig.id}
    >
      {/* Customization controls overlay */}
      {isCustomizing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.25rem',
            backgroundColor: '#e6f0fa',
            borderRadius: '0.375rem',
            border: '1px solid #cce1f5',
          }}
        >
          {/* Left side: drag handle + label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                cursor: 'grab',
                flexShrink: 0,
              }}
              aria-hidden="true"
              title="Drag to reorder"
            >
              {getWidgetIcon('move')}
            </div>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#111827',
                lineHeight: 1.3,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {widgetConfig.label}
            </span>
            {!hasComponent && (
              <span
                style={{
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: '#9ca3af',
                  backgroundColor: '#f3f4f6',
                  padding: '0.0625rem 0.375rem',
                  borderRadius: '9999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Coming Soon
              </span>
            )}
          </div>

          {/* Right side: reorder + visibility controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
            }}
          >
            {/* Move up button */}
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              aria-label={`Move ${widgetConfig.label} up`}
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
              {getWidgetIcon('chevron-up')}
            </button>

            {/* Move down button */}
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              aria-label={`Move ${widgetConfig.label} down`}
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
              {getWidgetIcon('chevron-down')}
            </button>

            {/* Divider */}
            <div
              style={{
                width: '1px',
                height: '1.25rem',
                backgroundColor: '#d1d5db',
                margin: '0 0.125rem',
              }}
              aria-hidden="true"
            />

            {/* Visibility toggle */}
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-label={widgetConfig.visible ? `Hide ${widgetConfig.label}` : `Show ${widgetConfig.label}`}
              aria-pressed={widgetConfig.visible}
              title={widgetConfig.visible ? 'Hide widget' : 'Show widget'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.75rem',
                height: '1.75rem',
                padding: 0,
                background: widgetConfig.visible ? '#0069cc' : 'none',
                border: widgetConfig.visible ? '1px solid #0069cc' : '1px solid #d1d5db',
                borderRadius: '0.25rem',
                cursor: 'pointer',
                color: widgetConfig.visible ? '#ffffff' : '#6b7280',
                transition: 'all 0.15s ease-in-out',
              }}
              onMouseEnter={(e) => {
                if (!widgetConfig.visible) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#0069cc';
                  e.currentTarget.style.borderColor = '#0069cc';
                } else {
                  e.currentTarget.style.backgroundColor = '#0054a3';
                  e.currentTarget.style.borderColor = '#0054a3';
                }
              }}
              onMouseLeave={(e) => {
                if (!widgetConfig.visible) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.borderColor = '#d1d5db';
                } else {
                  e.currentTarget.style.backgroundColor = '#0069cc';
                  e.currentTarget.style.borderColor = '#0069cc';
                }
              }}
            >
              {widgetConfig.visible ? getWidgetIcon('eye') : getWidgetIcon('eye-off')}
            </button>
          </div>
        </div>
      )}

      {/* Widget content */}
      {widgetConfig.visible && hasComponent && (
        <div>
          {children}
        </div>
      )}

      {/* Hidden widget placeholder in customization mode */}
      {isCustomizing && !widgetConfig.visible && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem 1rem',
            backgroundColor: '#f9fafb',
            border: '1px dashed #d1d5db',
            borderRadius: '0.375rem',
            color: '#9ca3af',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
          }}
        >
          <span>
            {widgetConfig.label} is hidden.{' '}
            <button
              type="button"
              onClick={onToggleVisibility}
              style={{
                display: 'inline',
                padding: 0,
                background: 'none',
                border: 'none',
                color: '#0069cc',
                fontWeight: 500,
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.8125rem',
              }}
              aria-label={`Show ${widgetConfig.label}`}
            >
              Show
            </button>
          </span>
        </div>
      )}
    </div>
  );
};

WidgetWrapper.propTypes = {
  widgetConfig: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    order: PropTypes.number.isRequired,
  }).isRequired,
  children: PropTypes.node,
  isCustomizing: PropTypes.bool.isRequired,
  onToggleVisibility: PropTypes.func.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
};

WidgetWrapper.defaultProps = {
  children: null,
};

/**
 * WidgetContainer component.
 * Dashboard widget container with customization controls. Renders individual
 * dashboard widgets in user-customized order with visibility toggles and
 * reorder controls. Integrates with WidgetCustomizationContext for state
 * management and persistence. Uses HB CSS card and flexbox classes.
 *
 * @param {Object} props
 * @param {string} [props.className] - Additional CSS class names to append to the container
 * @param {string} [props.id] - HTML id attribute
 * @returns {React.ReactElement} The widget container element
 */
const WidgetContainer = ({ className, id }) => {
  const {
    widgets,
    visibleWidgets,
    toggleWidgetVisibility,
    reorderWidgets,
    resetToDefaults,
    isCustomized,
  } = useWidgetCustomization();

  const [isCustomizing, setIsCustomizing] = useState(false);

  /**
   * Toggles customization mode on/off.
   */
  const handleToggleCustomize = useCallback(() => {
    setIsCustomizing((prev) => !prev);
  }, []);

  /**
   * Handles resetting widget preferences to defaults.
   */
  const handleResetDefaults = useCallback(() => {
    resetToDefaults();
  }, [resetToDefaults]);

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
   * Renders the widget component for a given widget ID.
   * @param {string} widgetId - The widget identifier
   * @returns {React.ReactElement|null} The widget component or null
   */
  const renderWidgetComponent = (widgetId) => {
    const WidgetComponent = WIDGET_COMPONENT_MAP[widgetId];

    if (!WidgetComponent) {
      return null;
    }

    return <WidgetComponent id={`widget-${widgetId}`} />;
  };

  const displayWidgets = isCustomizing ? widgets : visibleWidgets;

  const containerClassName = [
    className || '',
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  const visibleCount = visibleWidgets.length;
  const totalCount = widgets.length;

  return (
    <div
      id={id || 'widget-container'}
      className={containerClassName || undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* Customization toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#111827',
              lineHeight: 1.3,
            }}
          >
            My Dashboard
          </h2>
          {isCustomizing && (
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: '#0069cc',
                backgroundColor: '#e6f0fa',
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
              }}
            >
              Customizing
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {/* Reset to defaults button (only shown when customized and in customization mode) */}
          {isCustomizing && isCustomized && (
            <button
              type="button"
              className={HB_CLASSES.btnTertiary}
              onClick={handleResetDefaults}
              aria-label="Reset dashboard to default layout"
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.8125rem',
              }}
            >
              {getWidgetIcon('refresh')}
              Reset
            </button>
          )}

          {/* Customize toggle button */}
          <button
            type="button"
            className={isCustomizing ? HB_CLASSES.btnPrimary : HB_CLASSES.btnSecondary}
            onClick={handleToggleCustomize}
            aria-label={isCustomizing ? 'Done customizing dashboard' : 'Customize dashboard widgets'}
            aria-pressed={isCustomizing}
            style={{
              padding: '0.375rem 0.875rem',
              fontSize: '0.8125rem',
            }}
          >
            {isCustomizing ? (
              <>
                Done
              </>
            ) : (
              <>
                {getWidgetIcon('settings')}
                Customize
              </>
            )}
          </button>
        </div>
      </div>

      {/* Customization info bar */}
      {isCustomizing && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '0.375rem',
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
            Use the controls to show, hide, or reorder your dashboard widgets.
            Showing {visibleCount} of {totalCount} widgets.
            {isCustomized && ' Your layout has been customized.'}
          </span>
        </div>
      )}

      {/* Widget list */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isCustomizing ? '0.5rem' : '1.5rem',
        }}
        role="list"
        aria-label="Dashboard widgets"
      >
        {displayWidgets.map((widget, index) => (
          <div key={widget.id} role="listitem">
            <WidgetWrapper
              widgetConfig={widget}
              isCustomizing={isCustomizing}
              onToggleVisibility={() => handleToggleVisibility(widget.id)}
              onMoveUp={() => handleMoveUp(widget.id, widget.order)}
              onMoveDown={() => handleMoveDown(widget.id, widget.order)}
              isFirst={index === 0}
              isLast={index === displayWidgets.length - 1}
            >
              {renderWidgetComponent(widget.id)}
            </WidgetWrapper>
          </div>
        ))}
      </div>

      {/* Empty state when all widgets are hidden */}
      {!isCustomizing && visibleWidgets.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '9999px',
              backgroundColor: '#f3f4f6',
              color: '#9ca3af',
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#374151',
                lineHeight: 1.3,
              }}
            >
              No widgets visible
            </p>
            <p
              style={{
                margin: '0 0 1rem 0',
                fontSize: '0.875rem',
                color: '#6b7280',
                lineHeight: 1.5,
                maxWidth: '24rem',
              }}
            >
              All dashboard widgets are currently hidden. Click &ldquo;Customize&rdquo; to show widgets on your dashboard.
            </p>
          </div>
          <button
            type="button"
            className={HB_CLASSES.btnPrimary}
            onClick={handleToggleCustomize}
            aria-label="Customize dashboard to show widgets"
          >
            {getWidgetIcon('settings')}
            Customize Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

WidgetContainer.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
};

WidgetContainer.defaultProps = {
  className: '',
  id: undefined,
};

export default WidgetContainer;