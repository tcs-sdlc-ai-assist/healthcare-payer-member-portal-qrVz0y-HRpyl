/**
 * Session timeout and activity tracking service for the Healthcare Member Portal.
 * Tracks user activity, enforces configurable inactivity timeout (default 15 minutes),
 * triggers warning at configurable threshold (default 13 minutes), and handles
 * session expiry with automatic logout.
 *
 * Implements SessionManager interface from the Authentication & Security cluster.
 * Integrates with authService for session validation, refresh, and logout.
 *
 * @module sessionManager
 */

import {
  getSession,
  refreshSession,
  logout,
  trackActivity as authTrackActivity,
  enforceTimeout as authEnforceTimeout,
  getSessionTimeRemaining,
  getSessionConfig,
  isAuthenticated,
} from './authService.js';
import { getItem, setItem, removeItem } from '../utils/storage.js';
import { SESSION_TIMEOUT, APP_CONFIG } from '../constants/constants.js';

/**
 * Storage keys for session manager state.
 * @type {Object.<string, string>}
 */
const SESSION_MANAGER_KEYS = {
  LAST_ACTIVITY: 'hcp_session_last_activity',
  WARNING_SHOWN: 'hcp_session_warning_shown',
  TIMER_ACTIVE: 'hcp_session_timer_active',
};

/**
 * Internal state for the session manager.
 * @type {Object}
 */
let _state = {
  checkIntervalId: null,
  onWarningCallback: null,
  onExpiredCallback: null,
  onActivityCallback: null,
  isMonitoring: false,
  activityEvents: ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'],
  activityThrottleMs: 30000,
  lastActivityTracked: 0,
};

/**
 * Returns the current session manager configuration.
 *
 * @returns {Object} Configuration object with timeout, warning, and check interval values
 */
export const getSessionManagerConfig = () => {
  return {
    timeoutMs: SESSION_TIMEOUT.timeoutMs,
    warningMs: SESSION_TIMEOUT.warningMs,
    checkIntervalMs: SESSION_TIMEOUT.checkIntervalMs,
    timeoutMinutes: APP_CONFIG.sessionTimeoutMinutes,
    warningMinutes: APP_CONFIG.sessionWarningMinutes,
    activityThrottleMs: _state.activityThrottleMs,
  };
};

/**
 * Records user activity by updating the last activity timestamp.
 * Throttled to avoid excessive storage writes.
 * Optionally refreshes the session to extend the expiration.
 *
 * @param {Object} [options] - Options
 * @param {boolean} [options.refreshSessionExpiry=false] - Whether to also refresh the session expiry
 * @returns {boolean} True if activity was tracked successfully
 */
export const trackActivity = (options = {}) => {
  const now = Date.now();

  if (now - _state.lastActivityTracked < _state.activityThrottleMs) {
    return true;
  }

  if (!isAuthenticated()) {
    return false;
  }

  _state.lastActivityTracked = now;

  const tracked = authTrackActivity();

  if (!tracked) {
    return false;
  }

  setItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY, new Date().toISOString());

  if (options.refreshSessionExpiry) {
    const result = refreshSession();
    if (!result.success) {
      return false;
    }

    setItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);
  }

  if (_state.onActivityCallback && typeof _state.onActivityCallback === 'function') {
    try {
      _state.onActivityCallback();
    } catch (error) {
      console.error('[sessionManager] Error in activity callback:', error);
    }
  }

  return true;
};

/**
 * Checks whether the session has expired and should be terminated.
 * If expired, performs automatic logout and invokes the expired callback.
 *
 * @returns {boolean} True if the session has expired and was terminated
 */
export const enforceTimeout = () => {
  const expired = authEnforceTimeout();

  if (expired) {
    handleSessionExpired();
    return true;
  }

  return false;
};

/**
 * Checks the current session state and determines if a warning should be shown
 * or if the session has expired.
 *
 * @returns {Object} Session check result with status, timeRemaining, isWarning, and isExpired
 */
export const checkSessionStatus = () => {
  if (!isAuthenticated()) {
    return {
      status: 'expired',
      timeRemaining: 0,
      timeRemainingFormatted: '0:00',
      isWarning: false,
      isExpired: true,
      isActive: false,
    };
  }

  const session = getSession();

  if (!session.isAuthenticated) {
    return {
      status: 'expired',
      timeRemaining: 0,
      timeRemainingFormatted: '0:00',
      isWarning: false,
      isExpired: true,
      isActive: false,
    };
  }

  if (session.isExpired) {
    handleSessionExpired();
    return {
      status: 'expired',
      timeRemaining: 0,
      timeRemainingFormatted: '0:00',
      isWarning: false,
      isExpired: true,
      isActive: false,
    };
  }

  const timeInfo = getSessionTimeRemaining();

  if (session.isWarning) {
    const warningAlreadyShown = getItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);

    if (!warningAlreadyShown) {
      setItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, true);
      handleSessionWarning(timeInfo);
    }

    return {
      status: 'warning',
      timeRemaining: timeInfo.timeRemainingMs,
      timeRemainingFormatted: timeInfo.formatted,
      minutes: timeInfo.minutes,
      seconds: timeInfo.seconds,
      isWarning: true,
      isExpired: false,
      isActive: true,
    };
  }

  return {
    status: 'active',
    timeRemaining: timeInfo.timeRemainingMs,
    timeRemainingFormatted: timeInfo.formatted,
    minutes: timeInfo.minutes,
    seconds: timeInfo.seconds,
    isWarning: false,
    isExpired: false,
    isActive: true,
  };
};

/**
 * Extends the current session by refreshing the expiration time.
 * Should be called when the user confirms they want to continue their session
 * (e.g., clicking "Stay Logged In" on the timeout warning).
 *
 * @returns {Object} Result with success status and updated session info
 */
export const extendSession = () => {
  if (!isAuthenticated()) {
    return {
      success: false,
      error: 'No active session to extend.',
      expiresAt: null,
    };
  }

  const result = refreshSession();

  if (result.success) {
    setItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);
    _state.lastActivityTracked = Date.now();
    setItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY, new Date().toISOString());
  }

  return result;
};

/**
 * Handles session expiration by performing logout and invoking the expired callback.
 */
const handleSessionExpired = () => {
  stopMonitoring();

  removeItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY);
  removeItem(SESSION_MANAGER_KEYS.WARNING_SHOWN);
  removeItem(SESSION_MANAGER_KEYS.TIMER_ACTIVE);

  logout();

  if (_state.onExpiredCallback && typeof _state.onExpiredCallback === 'function') {
    try {
      _state.onExpiredCallback();
    } catch (error) {
      console.error('[sessionManager] Error in expired callback:', error);
    }
  }
};

/**
 * Handles session warning by invoking the warning callback.
 *
 * @param {Object} timeInfo - Time remaining information
 */
const handleSessionWarning = (timeInfo) => {
  if (_state.onWarningCallback && typeof _state.onWarningCallback === 'function') {
    try {
      _state.onWarningCallback({
        timeRemaining: timeInfo.timeRemainingMs,
        timeRemainingFormatted: timeInfo.formatted,
        minutes: timeInfo.minutes,
        seconds: timeInfo.seconds,
      });
    } catch (error) {
      console.error('[sessionManager] Error in warning callback:', error);
    }
  }
};

/**
 * Internal handler for user activity events on the DOM.
 * Throttled to prevent excessive processing.
 */
const handleUserActivity = () => {
  trackActivity({ refreshSessionExpiry: false });
};

/**
 * Periodic check function that runs on the configured interval.
 * Checks session status and triggers warnings or expiration as needed.
 */
const periodicCheck = () => {
  if (!isAuthenticated()) {
    handleSessionExpired();
    return;
  }

  const status = checkSessionStatus();

  if (status.isExpired) {
    handleSessionExpired();
  }
};

/**
 * Starts monitoring user activity and session timeout.
 * Registers DOM event listeners for activity tracking and starts
 * the periodic session check interval.
 *
 * @param {Object} [callbacks] - Callback functions
 * @param {Function} [callbacks.onWarning] - Called when session enters warning window
 * @param {Function} [callbacks.onExpired] - Called when session expires
 * @param {Function} [callbacks.onActivity] - Called when user activity is detected
 * @returns {boolean} True if monitoring was started successfully
 */
export const startMonitoring = (callbacks = {}) => {
  if (_state.isMonitoring) {
    return true;
  }

  if (!isAuthenticated()) {
    return false;
  }

  _state.onWarningCallback = callbacks.onWarning || null;
  _state.onExpiredCallback = callbacks.onExpired || null;
  _state.onActivityCallback = callbacks.onActivity || null;

  setItem(SESSION_MANAGER_KEYS.TIMER_ACTIVE, true);
  setItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);
  setItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY, new Date().toISOString());

  _state.lastActivityTracked = Date.now();

  if (typeof window !== 'undefined') {
    _state.activityEvents.forEach((eventName) => {
      try {
        window.addEventListener(eventName, handleUserActivity, { passive: true });
      } catch (error) {
        console.error(`[sessionManager] Error adding event listener for ${eventName}:`, error);
      }
    });
  }

  _state.checkIntervalId = setInterval(periodicCheck, SESSION_TIMEOUT.checkIntervalMs);

  _state.isMonitoring = true;

  return true;
};

/**
 * Stops monitoring user activity and session timeout.
 * Removes DOM event listeners and clears the periodic check interval.
 *
 * @returns {boolean} True if monitoring was stopped successfully
 */
export const stopMonitoring = () => {
  if (_state.checkIntervalId !== null) {
    clearInterval(_state.checkIntervalId);
    _state.checkIntervalId = null;
  }

  if (typeof window !== 'undefined') {
    _state.activityEvents.forEach((eventName) => {
      try {
        window.removeEventListener(eventName, handleUserActivity);
      } catch (error) {
        console.error(`[sessionManager] Error removing event listener for ${eventName}:`, error);
      }
    });
  }

  _state.isMonitoring = false;
  _state.onWarningCallback = null;
  _state.onExpiredCallback = null;
  _state.onActivityCallback = null;

  removeItem(SESSION_MANAGER_KEYS.TIMER_ACTIVE);

  return true;
};

/**
 * Returns whether the session manager is currently monitoring.
 *
 * @returns {boolean} True if monitoring is active
 */
export const isMonitoring = () => {
  return _state.isMonitoring;
};

/**
 * Returns the last recorded activity timestamp.
 *
 * @returns {string|null} ISO 8601 timestamp of last activity, or null if not available
 */
export const getLastActivity = () => {
  return getItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY, null);
};

/**
 * Returns whether the session warning has been shown.
 *
 * @returns {boolean} True if the warning has been shown
 */
export const isWarningShown = () => {
  return getItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);
};

/**
 * Resets the warning shown state.
 * Useful after the user extends their session.
 *
 * @returns {boolean} True if the state was reset successfully
 */
export const resetWarningState = () => {
  return setItem(SESSION_MANAGER_KEYS.WARNING_SHOWN, false);
};

/**
 * Performs a manual session logout and stops monitoring.
 *
 * @returns {Object} Logout result with success status and message
 */
export const logoutAndStopMonitoring = () => {
  stopMonitoring();

  removeItem(SESSION_MANAGER_KEYS.LAST_ACTIVITY);
  removeItem(SESSION_MANAGER_KEYS.WARNING_SHOWN);
  removeItem(SESSION_MANAGER_KEYS.TIMER_ACTIVE);

  return logout();
};

/**
 * Returns a comprehensive session status summary for UI display.
 *
 * @returns {Object} Session status summary with all relevant information
 */
export const getSessionStatusSummary = () => {
  const sessionStatus = checkSessionStatus();
  const config = getSessionManagerConfig();
  const lastActivity = getLastActivity();

  return {
    ...sessionStatus,
    lastActivity,
    isMonitoring: _state.isMonitoring,
    config: {
      timeoutMinutes: config.timeoutMinutes,
      warningMinutes: config.warningMinutes,
      checkIntervalMs: config.checkIntervalMs,
    },
  };
};

/**
 * Returns the storage keys used by the session manager.
 * Useful for testing and debugging.
 *
 * @returns {Object.<string, string>} Map of storage key names to their values
 */
export const getSessionManagerStorageKeys = () => {
  return { ...SESSION_MANAGER_KEYS };
};