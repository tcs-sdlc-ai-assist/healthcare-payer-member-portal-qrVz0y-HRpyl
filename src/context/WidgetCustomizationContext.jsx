import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getItem, setItem } from '../utils/storage.js';

/**
 * Storage key for dashboard widget customization preferences.
 * @type {string}
 */
const WIDGET_PREFS_STORAGE_KEY = 'hcp_dashboard_prefs';

/**
 * Current schema version for widget preferences.
 * Increment when the schema changes to trigger migration.
 * @type {number}
 */
const WIDGET_PREFS_VERSION = 1;

/**
 * Default widget configuration for the dashboard.
 * Defines the initial set of widgets, their visibility, and display order.
 *
 * @typedef {Object} WidgetConfig
 * @property {string} id - Unique widget identifier
 * @property {string} label - Human-readable widget label
 * @property {boolean} visible - Whether the widget is visible on the dashboard
 * @property {number} order - Display order (lower numbers appear first)
 *
 * @type {WidgetConfig[]}
 */
const DEFAULT_WIDGETS = [
  { id: 'claims', label: 'Recent Claims', visible: true, order: 1 },
  { id: 'benefits', label: 'Benefits Summary', visible: true, order: 2 },
  { id: 'deductible', label: 'Deductible Tracker', visible: true, order: 3 },
  { id: 'idCards', label: 'ID Cards', visible: true, order: 4 },
  { id: 'notifications', label: 'Notifications', visible: true, order: 5 },
  { id: 'documents', label: 'Recent Documents', visible: true, order: 6 },
  { id: 'prescriptions', label: 'Prescriptions', visible: true, order: 7 },
  { id: 'wellness', label: 'Wellness', visible: true, order: 8 },
  { id: 'getCare', label: 'Get Care', visible: true, order: 9 },
  { id: 'support', label: 'Support & Contact', visible: true, order: 10 },
];

/**
 * @typedef {Object} WidgetPrefs
 * @property {WidgetConfig[]} dashboardWidgets - Array of widget configuration objects
 * @property {number} version - Schema version number
 */

/**
 * @typedef {Object} WidgetCustomizationContextValue
 * @property {WidgetConfig[]} widgets - Current widget configurations sorted by order
 * @property {WidgetConfig[]} visibleWidgets - Only visible widgets sorted by order
 * @property {Function} toggleWidgetVisibility - Toggles a widget's visibility by ID
 * @property {Function} reorderWidgets - Reorders widgets by moving a widget to a new position
 * @property {Function} setWidgetOrder - Sets the complete widget order from an array of IDs
 * @property {Function} resetToDefaults - Resets all widget preferences to defaults
 * @property {Function} isWidgetVisible - Checks if a widget is visible by ID
 * @property {Function} getWidgetById - Returns a widget config by ID
 * @property {boolean} isCustomized - Whether the current config differs from defaults
 */

const WidgetCustomizationContext = createContext(null);

/**
 * Custom hook to consume the WidgetCustomizationContext.
 * Must be used within a WidgetCustomizationProvider.
 *
 * @returns {WidgetCustomizationContextValue} The widget customization context value
 * @throws {Error} If used outside of a WidgetCustomizationProvider
 */
export const useWidgetCustomization = () => {
  const context = useContext(WidgetCustomizationContext);
  if (!context) {
    throw new Error('useWidgetCustomization must be used within a WidgetCustomizationProvider.');
  }
  return context;
};

/**
 * Validates widget preferences loaded from storage.
 * Ensures the data structure is correct and all required fields are present.
 *
 * @param {*} prefs - The preferences object to validate
 * @returns {boolean} True if the preferences are valid
 */
const isValidPrefs = (prefs) => {
  if (!prefs || typeof prefs !== 'object') {
    return false;
  }

  if (!Array.isArray(prefs.dashboardWidgets)) {
    return false;
  }

  if (typeof prefs.version !== 'number') {
    return false;
  }

  return prefs.dashboardWidgets.every((widget) => {
    return (
      widget &&
      typeof widget.id === 'string' &&
      widget.id.length > 0 &&
      typeof widget.label === 'string' &&
      typeof widget.visible === 'boolean' &&
      typeof widget.order === 'number'
    );
  });
};

/**
 * Merges stored preferences with the default widget set.
 * Ensures any new default widgets are added and removed widgets are cleaned up.
 *
 * @param {WidgetConfig[]} storedWidgets - Widgets loaded from storage
 * @returns {WidgetConfig[]} Merged widget configurations
 */
const mergeWithDefaults = (storedWidgets) => {
  const storedMap = new Map();
  storedWidgets.forEach((widget) => {
    storedMap.set(widget.id, widget);
  });

  const defaultIds = new Set(DEFAULT_WIDGETS.map((w) => w.id));

  const merged = DEFAULT_WIDGETS.map((defaultWidget) => {
    const stored = storedMap.get(defaultWidget.id);
    if (stored) {
      return {
        ...defaultWidget,
        visible: stored.visible,
        order: stored.order,
      };
    }
    return { ...defaultWidget };
  });

  // Preserve any stored widgets that are not in defaults (future-proofing)
  storedWidgets.forEach((stored) => {
    if (!defaultIds.has(stored.id)) {
      merged.push({ ...stored });
    }
  });

  return merged;
};

/**
 * Loads widget preferences from localStorage.
 * Falls back to defaults if storage is empty, corrupt, or schema version mismatches.
 *
 * @returns {WidgetConfig[]} The loaded or default widget configurations
 */
const loadPrefs = () => {
  try {
    const stored = getItem(WIDGET_PREFS_STORAGE_KEY, null);

    if (!stored) {
      return DEFAULT_WIDGETS.map((w) => ({ ...w }));
    }

    if (!isValidPrefs(stored)) {
      return DEFAULT_WIDGETS.map((w) => ({ ...w }));
    }

    if (stored.version !== WIDGET_PREFS_VERSION) {
      // Migrate: merge stored prefs with current defaults
      const merged = mergeWithDefaults(stored.dashboardWidgets);
      return merged;
    }

    return mergeWithDefaults(stored.dashboardWidgets);
  } catch (error) {
    console.error('[WidgetCustomizationContext] Error loading widget preferences:', error);
    return DEFAULT_WIDGETS.map((w) => ({ ...w }));
  }
};

/**
 * Persists widget preferences to localStorage.
 *
 * @param {WidgetConfig[]} widgets - The widget configurations to persist
 * @returns {boolean} True if persisted successfully
 */
const savePrefs = (widgets) => {
  try {
    const prefs = {
      dashboardWidgets: widgets,
      version: WIDGET_PREFS_VERSION,
    };
    return setItem(WIDGET_PREFS_STORAGE_KEY, prefs);
  } catch (error) {
    console.error('[WidgetCustomizationContext] Error saving widget preferences:', error);
    return false;
  }
};

/**
 * Sorts widgets by their order property.
 *
 * @param {WidgetConfig[]} widgets - The widgets to sort
 * @returns {WidgetConfig[]} Sorted widget array
 */
const sortByOrder = (widgets) => {
  return [...widgets].sort((a, b) => a.order - b.order);
};

/**
 * Widget customization context provider component.
 * Wraps the dashboard to provide widget customization state, persistence,
 * and manipulation functions.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactElement} The provider component
 */
const WidgetCustomizationProvider = ({ children }) => {
  const [widgets, setWidgets] = useState(() => loadPrefs());

  /**
   * Persist widget preferences to localStorage whenever they change.
   */
  useEffect(() => {
    savePrefs(widgets);
  }, [widgets]);

  /**
   * Returns widgets sorted by order.
   */
  const sortedWidgets = useMemo(() => {
    return sortByOrder(widgets);
  }, [widgets]);

  /**
   * Returns only visible widgets sorted by order.
   */
  const visibleWidgets = useMemo(() => {
    return sortByOrder(widgets.filter((w) => w.visible));
  }, [widgets]);

  /**
   * Toggles the visibility of a widget by its ID.
   *
   * @param {string} widgetId - The widget identifier to toggle
   */
  const toggleWidgetVisibility = useCallback((widgetId) => {
    if (!widgetId || typeof widgetId !== 'string') {
      return;
    }

    setWidgets((prev) => {
      const index = prev.findIndex((w) => w.id === widgetId);
      if (index === -1) {
        return prev;
      }

      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        visible: !updated[index].visible,
      };
      return updated;
    });
  }, []);

  /**
   * Reorders widgets by moving a widget from one position to another.
   * Recalculates order values for all widgets after the move.
   *
   * @param {string} widgetId - The widget identifier to move
   * @param {number} newOrder - The new order position (1-based)
   */
  const reorderWidgets = useCallback((widgetId, newOrder) => {
    if (!widgetId || typeof widgetId !== 'string') {
      return;
    }

    if (typeof newOrder !== 'number' || newOrder < 1) {
      return;
    }

    setWidgets((prev) => {
      const sorted = sortByOrder(prev);
      const currentIndex = sorted.findIndex((w) => w.id === widgetId);

      if (currentIndex === -1) {
        return prev;
      }

      const targetIndex = Math.min(Math.max(newOrder - 1, 0), sorted.length - 1);

      if (currentIndex === targetIndex) {
        return prev;
      }

      const reordered = [...sorted];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(targetIndex, 0, moved);

      return reordered.map((widget, index) => ({
        ...widget,
        order: index + 1,
      }));
    });
  }, []);

  /**
   * Sets the complete widget order from an array of widget IDs.
   * Widgets not in the array retain their relative order at the end.
   *
   * @param {string[]} orderedIds - Array of widget IDs in desired order
   */
  const setWidgetOrder = useCallback((orderedIds) => {
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return;
    }

    setWidgets((prev) => {
      const widgetMap = new Map();
      prev.forEach((w) => {
        widgetMap.set(w.id, { ...w });
      });

      const ordered = [];
      const usedIds = new Set();

      orderedIds.forEach((id) => {
        const widget = widgetMap.get(id);
        if (widget && !usedIds.has(id)) {
          ordered.push(widget);
          usedIds.add(id);
        }
      });

      // Append any widgets not in the ordered list
      prev.forEach((w) => {
        if (!usedIds.has(w.id)) {
          ordered.push({ ...w });
        }
      });

      return ordered.map((widget, index) => ({
        ...widget,
        order: index + 1,
      }));
    });
  }, []);

  /**
   * Resets all widget preferences to the default configuration.
   */
  const resetToDefaults = useCallback(() => {
    const defaults = DEFAULT_WIDGETS.map((w) => ({ ...w }));
    setWidgets(defaults);
  }, []);

  /**
   * Checks if a widget is visible by its ID.
   *
   * @param {string} widgetId - The widget identifier
   * @returns {boolean} True if the widget is visible
   */
  const isWidgetVisible = useCallback((widgetId) => {
    if (!widgetId || typeof widgetId !== 'string') {
      return false;
    }

    const widget = widgets.find((w) => w.id === widgetId);
    return widget ? widget.visible : false;
  }, [widgets]);

  /**
   * Returns a widget configuration by its ID.
   *
   * @param {string} widgetId - The widget identifier
   * @returns {WidgetConfig|null} The widget config or null if not found
   */
  const getWidgetById = useCallback((widgetId) => {
    if (!widgetId || typeof widgetId !== 'string') {
      return null;
    }

    return widgets.find((w) => w.id === widgetId) || null;
  }, [widgets]);

  /**
   * Whether the current widget configuration differs from the defaults.
   */
  const isCustomized = useMemo(() => {
    if (widgets.length !== DEFAULT_WIDGETS.length) {
      return true;
    }

    const defaultSorted = sortByOrder(DEFAULT_WIDGETS);
    const currentSorted = sortByOrder(widgets);

    return currentSorted.some((widget, index) => {
      const defaultWidget = defaultSorted[index];
      if (!defaultWidget) {
        return true;
      }
      return (
        widget.id !== defaultWidget.id ||
        widget.visible !== defaultWidget.visible ||
        widget.order !== defaultWidget.order
      );
    });
  }, [widgets]);

  const contextValue = useMemo(() => ({
    widgets: sortedWidgets,
    visibleWidgets,
    toggleWidgetVisibility,
    reorderWidgets,
    setWidgetOrder,
    resetToDefaults,
    isWidgetVisible,
    getWidgetById,
    isCustomized,
  }), [
    sortedWidgets,
    visibleWidgets,
    toggleWidgetVisibility,
    reorderWidgets,
    setWidgetOrder,
    resetToDefaults,
    isWidgetVisible,
    getWidgetById,
    isCustomized,
  ]);

  return (
    <WidgetCustomizationContext.Provider value={contextValue}>
      {children}
    </WidgetCustomizationContext.Provider>
  );
};

WidgetCustomizationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { WidgetCustomizationContext, DEFAULT_WIDGETS };
export default WidgetCustomizationProvider;